import { availabilityLabels, propagationLabels, type AvailabilityKey, type PriceTypeKey, type PropagationKey } from "@/lib/labels";
import { formatINR } from "@/lib/utils";

type PriceInput = {
  priceType: PriceTypeKey;
  price: string | null;
  priceUnit: string | null;
  showPrice: boolean;
};

/** Never shows a number unless it's a fixed price, the product allows it and prices are enabled site-wide */
export function priceLabel(p: PriceInput, globalShowPrices: boolean): { text: string; isNumeric: boolean } {
  if (p.priceType === "FIXED" && p.price && p.showPrice && globalShowPrices) {
    return { text: `${formatINR(p.price)}${p.priceUnit ? ` ${p.priceUnit}` : ""}`, isNumeric: true };
  }
  if (p.priceType === "QUOTATION") return { text: "Contact for quotation", isNumeric: false };
  return { text: "Price on request", isNumeric: false };
}

type SpecInput = {
  scientificName: string | null;
  variety: string | null;
  propagation: PropagationKey;
  propagationMethod: string | null;
  plantAge: string | null;
  plantHeight: string | null;
  containerSize: string | null;
  availability: AvailabilityKey;
  stockQuantity: number | null;
};

/** Only verified (non-empty) specifications are returned */
export function productSpecs(p: SpecInput, opts: { includeStock?: boolean } = {}) {
  const specs: { label: string; value: string; italic?: boolean }[] = [];
  if (p.scientificName) specs.push({ label: "Scientific name", value: p.scientificName, italic: true });
  if (p.variety) specs.push({ label: "Variety", value: p.variety });
  if (p.propagation !== "UNSPECIFIED") specs.push({ label: "Propagation", value: propagationLabels[p.propagation] });
  if (p.propagationMethod) specs.push({ label: "Propagation method", value: p.propagationMethod });
  if (p.plantAge) specs.push({ label: "Plant age", value: p.plantAge });
  if (p.plantHeight) specs.push({ label: "Plant height", value: p.plantHeight });
  if (p.containerSize) specs.push({ label: "Container / grow bag", value: p.containerSize });
  specs.push({ label: "Availability", value: availabilityLabels[p.availability] });
  if (opts.includeStock && p.stockQuantity !== null && p.availability !== "OUT_OF_STOCK") {
    specs.push({ label: "Stock", value: `${p.stockQuantity} plants` });
  }
  return specs;
}

export const availabilityTone: Record<AvailabilityKey, string> = {
  IN_STOCK: "bg-emerald-100 text-emerald-900",
  LIMITED: "bg-amber-100 text-amber-900",
  OUT_OF_STOCK: "bg-stone-200 text-stone-700",
  PRE_ORDER: "bg-sky-100 text-sky-900",
  ON_ENQUIRY: "bg-cream text-nut",
};
