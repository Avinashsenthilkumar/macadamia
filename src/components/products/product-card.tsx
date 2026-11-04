import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/motion/primitives";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { availabilityTone, priceLabel, productSpecs } from "@/lib/products";
import type { PublicProduct } from "@/lib/queries";
import { availabilityLabels } from "@/lib/labels";
import { productWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ProductCard({ product, showPrices, whatsappNumber }: { product: PublicProduct; showPrices: boolean; whatsappNumber: string }) {
  const image = product.images[0] ?? { url: "/images/orchard/orchard-young-tree.webp", alt: `${product.name} (illustrative image)` };
  const specs = productSpecs(product).filter((s) => s.label !== "Availability" && s.label !== "Scientific name").slice(0, 4);
  const price = priceLabel(product, showPrices);
  const href = `/macadamia-plants/${product.slug}`;

  return (
    <TiltCard className="group h-full rounded-[1.75rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-forest/5 transition-shadow duration-500 group-hover:shadow-lift">
        <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-cream" tabIndex={-1} aria-hidden>
          <Image src={image.url} alt={image.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold backdrop-blur", availabilityTone[product.availability])}>
            {availabilityLabels[product.availability]}
          </span>
          {product.isFeatured ? <span className="absolute right-4 top-4 rounded-full bg-nut px-3 py-1 text-xs font-bold text-ivory">Featured</span> : null}
        </Link>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl leading-tight text-forest">
            <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
              {product.name}
            </Link>
          </h3>
          {product.scientificName ? <p className="mt-1 text-sm italic text-ink/60">{product.scientificName}</p> : null}
          {product.shortDescription ? <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-ink/70">{product.shortDescription}</p> : null}
          {specs.length ? (
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-forest/8 pt-5 text-sm">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-ink/45">{s.label}</dt>
                  <dd className="mt-0.5 font-semibold text-deep">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-auto pt-6">
            <p className={cn("text-sm", price.isNumeric ? "font-display text-2xl text-forest" : "font-semibold text-nut")}>{price.text}</p>
            <div className="relative z-10 mt-4 flex gap-2">
              <Link href={`${href}#enquire`} className={buttonClasses({ size: "sm", className: "flex-1" })}>
                Enquire <ArrowSlide />
              </Link>
              <a
                href={whatsappLink(whatsappNumber, productWhatsAppMessage(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask about ${product.name} on WhatsApp`}
                className={buttonClasses({ variant: "whatsapp", size: "icon", className: "h-9 w-9" })}
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
