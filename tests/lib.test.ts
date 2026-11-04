import { test } from "node:test";
import assert from "node:assert/strict";
import { csvCell, toCsv } from "../src/lib/csv";
import { detectImageType } from "../src/lib/image-type";
import { buildEnquiryWhere } from "../src/lib/enquiry-filters";
import { priceLabel, productSpecs } from "../src/lib/products";
import { mergeSettings } from "../src/lib/settings-merge";
import { defaultSiteSettings } from "../src/config/site";
import { readingTime, slugify, stripMarkdown, truncate } from "../src/lib/utils";
import { whatsappLink } from "../src/lib/whatsapp";

test("CSV cells that look like formulas are neutralised", () => {
  for (const evil of ["=HYPERLINK(\"http://x\")", "+cmd", "-2+3", "@SUM(A1)", "\tTAB"]) {
    assert.ok(csvCell(evil).replace(/^"/, "").startsWith("'"), evil);
  }
  assert.equal(csvCell("normal"), "normal");
  assert.equal(csvCell('He said "hi", ok'), '"He said ""hi"", ok"');
  assert.equal(csvCell(null), "");
  assert.equal(csvCell(42), "42");
});

test("CSV output has a BOM and CRLF rows", () => {
  const csv = toCsv(["A", "B"], [["1", "x,y"]]);
  assert.ok(csv.startsWith("﻿"));
  assert.equal(csv.slice(1), 'A,B\r\n1,"x,y"');
});

test("image type is detected from magic bytes, not file name", () => {
  const pad = (b: number[]) => new Uint8Array([...b, ...new Array(16).fill(0)]);
  assert.equal(detectImageType(pad([0xff, 0xd8, 0xff, 0xe0]))?.ext, "jpg");
  assert.equal(detectImageType(pad([0x89, 0x50, 0x4e, 0x47]))?.ext, "png");
  const webp = new Uint8Array(20);
  webp.set([..."RIFF"].map((c) => c.charCodeAt(0)), 0);
  webp.set([..."WEBP"].map((c) => c.charCodeAt(0)), 8);
  assert.equal(detectImageType(webp)?.ext, "webp");
  const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  assert.equal(detectImageType(svg), null, "SVG (can carry scripts) is rejected");
  assert.equal(detectImageType(new TextEncoder().encode("<?php echo 'x'; ?>      ")), null);
  assert.equal(detectImageType(new Uint8Array(4)), null);
});

test("enquiry filters ignore invalid values", () => {
  const w = buildEnquiryWhere({ status: "DROP TABLE", type: "NOPE", from: "2026-13-99x", to: "yesterday" });
  assert.deepEqual(w, {});
  const w2 = buildEnquiryWhere({ status: "NEW", type: "BULK_SAPLING", from: "2026-11-01", q: "  Ravi " });
  assert.equal(w2.status, "NEW");
  assert.equal(w2.enquiryType, "BULK_SAPLING");
  assert.ok(w2.createdAt && "gte" in (w2.createdAt as object));
  assert.equal(Array.isArray(w2.OR), true);
});

test("prices are only shown when fixed, enabled on the product AND enabled site-wide", () => {
  const p = { priceType: "FIXED" as const, price: "150", priceUnit: "per plant", showPrice: true };
  assert.equal(priceLabel(p, true).isNumeric, true);
  assert.match(priceLabel(p, true).text, /150/);
  assert.equal(priceLabel(p, false).text, "Price on request");
  assert.equal(priceLabel({ ...p, showPrice: false }, true).text, "Price on request");
  assert.equal(priceLabel({ ...p, priceType: "QUOTATION" }, true).text, "Contact for quotation");
});

test("unverified (blank) specifications are never displayed", () => {
  const specs = productSpecs({
    scientificName: null,
    variety: null,
    propagation: "UNSPECIFIED",
    propagationMethod: null,
    plantAge: null,
    plantHeight: "1.5 ft",
    containerSize: null,
    availability: "ON_ENQUIRY",
    stockQuantity: null,
  });
  assert.deepEqual(specs.map((s) => s.label), ["Plant height", "Availability"]);
});

test("stored settings merge over defaults and reject wrong types", () => {
  const merged = mergeSettings({ businessName: "GN", phones: { primary: "+91 1" }, established: "not a number", unknownKey: 1 });
  assert.equal(merged.businessName, "GN");
  assert.equal(merged.phones.primary, "+91 1");
  assert.equal(merged.phones.secondary, defaultSiteSettings.phones.secondary, "nested defaults kept");
  assert.equal(merged.established, defaultSiteSettings.established, "wrong type falls back to default");
  assert.equal((merged as unknown as Record<string, unknown>).unknownKey, undefined);
  assert.deepEqual(mergeSettings(null), defaultSiteSettings);
});

test("utility helpers", () => {
  assert.equal(slugify("Grafted vs Seed-Grown Macadamia Plants!"), "grafted-vs-seed-grown-macadamia-plants");
  assert.equal(slugify("  Café   Ñandú  "), "cafe-nandu");
  assert.equal(readingTime("word ".repeat(450)), 2);
  assert.equal(readingTime(""), 1);
  assert.equal(stripMarkdown("## Title\n**bold** [link](http://x)"), "Title bold link");
  assert.equal(truncate("abcdefghij", 5), "abcd…");
  assert.equal(whatsappLink("+91 99431 19955", "Hi there"), "https://wa.me/919943119955?text=Hi%20there");
});
