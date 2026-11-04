import type { Metadata } from "next";
import { SITE_URL, defaultSiteSettings, type SiteSettings } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

const DEFAULT_OG = "/images/site/og-image.jpg";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

export function pageMetadata({ title, description, path, image, type = "website", publishedTime, noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image || DEFAULT_OG);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: defaultSiteSettings.businessName,
      locale: "en_IN",
      type,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

// ─── Structured data (JSON-LD) ──────────────────────────────────────────

export function localBusinessJsonLd(s: SiteSettings) {
  const main = s.addresses[0];
  const sameAs = [s.social.facebook, s.social.instagram, s.social.youtube, s.social.linkedin, ...s.relatedSites.map((r) => r.url)].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GardenStore"],
    "@id": `${SITE_URL}/#business`,
    name: s.businessName,
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_OG),
    logo: absoluteUrl(s.logoUrl),
    description: s.seo.defaultDescription,
    telephone: s.phones.primary,
    email: s.email,
    foundingDate: String(s.established),
    address: main
      ? {
          "@type": "PostalAddress",
          streetAddress: [main.line1, main.line2].filter(Boolean).join(", "),
          addressLocality: main.city,
          addressRegion: main.state,
          postalCode: main.postalCode,
          addressCountry: "IN",
        }
      : undefined,
    areaServed: { "@type": "Country", name: "India" },
    sameAs,
  };
}

export function websiteJsonLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: s.businessName,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleJsonLd(p: {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    image: [absoluteUrl(p.image || DEFAULT_OG)],
    datePublished: p.publishedAt?.toISOString(),
    dateModified: p.updatedAt.toISOString(),
    author: { "@type": "Organization", name: p.authorName },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
  };
}

/**
 * Product schema. Offers are only included when a real, visible fixed price exists —
 * we never publish made-up prices or availability.
 */
export function productJsonLd(p: {
  name: string;
  slug: string;
  description: string;
  images: string[];
  scientificName?: string | null;
  price?: string | null;
  availability: string;
}) {
  const availabilityMap: Record<string, string> = {
    IN_STOCK: "https://schema.org/InStock",
    LIMITED: "https://schema.org/LimitedAvailability",
    OUT_OF_STOCK: "https://schema.org/OutOfStock",
    PRE_ORDER: "https://schema.org/PreOrder",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((i) => absoluteUrl(i)),
    url: absoluteUrl(`/macadamia-plants/${p.slug}`),
    brand: { "@type": "Brand", name: "Ganesh Nursery" },
    ...(p.scientificName ? { additionalProperty: [{ "@type": "PropertyValue", name: "Scientific name", value: p.scientificName }] } : {}),
    ...(p.price && availabilityMap[p.availability]
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: p.price,
            availability: availabilityMap[p.availability],
            seller: { "@id": `${SITE_URL}/#business` },
          },
        }
      : {}),
  };
}
