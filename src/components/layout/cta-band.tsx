import Link from "next/link";
import { Magnetic, Reveal } from "@/components/motion/primitives";
import { FloatingNature } from "@/components/motion/decor";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { SectionHeading } from "@/components/ui/section-heading";
import { whatsappLink, whatsappMessages, type WhatsAppPreset } from "@/lib/whatsapp";

export function CtaBand({
  title = "Planning Your Macadamia Plantation?",
  description = "Tell us about your land and requirements — our team will get back to you.",
  whatsappNumber,
  preset = "consultation",
}: {
  title?: string;
  description?: string;
  whatsappNumber: string;
  preset?: WhatsAppPreset;
}) {
  return (
    <section className="container-x py-20 sm:py-28">
      <div className="grain relative isolate overflow-hidden rounded-[2.5rem] bg-forest px-6 py-16 text-center text-ivory sm:px-16 sm:py-20">
        <FloatingNature />
        <div className="relative">
          <SectionHeading tone="light" align="center" title={title} description={description} />
          <Reveal delay={0.3} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Link href="/contact#enquiry" className={buttonClasses({ variant: "light", size: "lg" })}>
                Discuss Your Requirements <ArrowSlide />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={whatsappLink(whatsappNumber, whatsappMessages[preset])} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "lg" })}>
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
