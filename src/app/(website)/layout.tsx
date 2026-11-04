import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { ScrollProgress } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteSettings } from "@/lib/settings";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <JsonLd data={websiteJsonLd(settings)} />
      <ScrollProgress />
      <Header
        businessName={settings.businessName}
        logoUrl={settings.logoUrl}
        phone={settings.phones.primary}
        announcement={settings.announcement}
      />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloat number={settings.whatsappNumber} />
    </>
  );
}
