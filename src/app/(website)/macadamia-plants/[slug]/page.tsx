import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHero } from "@/components/layout/page-hero";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { getProductBySlug, getPublishedProducts, getRelatedProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { availabilityTone, priceLabel, productSpecs } from "@/lib/products";
import { availabilityLabels } from "@/lib/labels";
import { pageMetadata, productJsonLd } from "@/lib/seo";
import { productWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { cn, stripMarkdown, truncate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Plant not found" };
  return pageMetadata({
    title: p.seoTitle || `${p.name} — Macadamia Plants`,
    description: p.seoDescription || truncate(p.shortDescription || stripMarkdown(p.description), 160),
    path: `/macadamia-plants/${p.slug}`,
    image: p.images[0]?.url,
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);
  if (!product) notFound();
  const related = await getRelatedProducts(product.id);
  const specs = productSpecs(product, { includeStock: true });
  const price = priceLabel(product, settings.showPrices);

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.name,
          slug: product.slug,
          description: product.shortDescription || truncate(stripMarkdown(product.description), 300),
          images: product.images.map((i) => i.url),
          scientificName: product.scientificName,
          price: price.isNumeric ? product.price : null,
          availability: product.availability,
        })}
      />
      <PageHero
        eyebrow={product.variety ? `Variety · ${product.variety}` : "Macadamia Plants"}
        title={product.name}
        description={product.shortDescription ?? undefined}
        image={product.images[0]?.url ?? "/images/gallery/macadamia-sapling-nursery.webp"}
        imageAlt={product.images[0]?.alt ?? product.name}
        crumbs={[
          { name: "Macadamia Plants", path: "/macadamia-plants" },
          { name: product.name, path: `/macadamia-plants/${product.slug}` },
        ]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <Reveal>
            <ProductGallery images={product.images} name={product.name} />
          </Reveal>
          <div>
            <Reveal>
              <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", availabilityTone[product.availability])}>{availabilityLabels[product.availability]}</span>
              {product.scientificName ? <p className="mt-4 text-lg italic text-ink/60">{product.scientificName}</p> : null}
              <p className={cn("mt-4", price.isNumeric ? "font-display text-4xl text-forest" : "text-lg font-semibold text-nut")}>{price.text}</p>
            </Reveal>

            <Stagger className="mt-8 divide-y divide-forest/10 overflow-hidden rounded-3xl bg-white shadow-soft" stagger={0.06}>
              {specs.map((s) => (
                <StaggerItem key={s.label} className="flex items-center justify-between gap-6 px-6 py-4">
                  <span className="text-sm text-ink/60">{s.label}</span>
                  <span className={cn("text-right font-semibold text-deep", s.italic && "italic")}>{s.value}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#enquire" className={buttonClasses({ size: "lg", className: "flex-1" })}>
                Request details
              </Link>
              <a href={whatsappLink(settings.whatsappNumber, productWhatsAppMessage(product.name))} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "lg", className: "flex-1" })}>
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp enquiry
              </a>
            </Reveal>

            <Reveal delay={0.25} className="prose-gn mt-10">
              <h2>About this plant</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.description}</ReactMarkdown>
            </Reveal>
            {product.growingInfo ? (
              <Reveal className="prose-gn mt-4">
                <h2>Growing information</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.growingInfo}</ReactMarkdown>
                <p className="text-sm text-ink/60">
                  General guidance only. See our <Link href="/cultivation-guide">cultivation guide</Link> and consult a local agricultural expert for your site.
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-28 bg-cream py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <span className="eyebrow">Enquire</span>
            <h2 className="mt-4 font-display text-4xl text-forest sm:text-5xl">Ask about {product.name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">Send your requirement and we&apos;ll confirm availability, specifications and pricing.</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-10 lg:col-span-3">
            <EnquiryForm
              whatsappNumber={settings.whatsappNumber}
              defaultType="INDIVIDUAL_PURCHASE"
              productId={product.id}
              productName={product.name}
              source="product"
            />
          </Reveal>
        </div>
      </section>

      {related.length ? (
        <section className="py-20 sm:py-28">
          <div className="container-x">
            <h2 className="font-display text-4xl text-forest">Related plants</h2>
            <Stagger className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} showPrices={settings.showPrices} whatsappNumber={settings.whatsappNumber} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}
    </>
  );
}
