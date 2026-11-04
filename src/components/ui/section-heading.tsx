import { Reveal, SplitText } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal y={12}>
          <span className={cn("eyebrow", tone === "light" && "text-sage", align === "center" && "justify-center")}>{eyebrow}</span>
        </Reveal>
      ) : null}
      <SplitText
        as="h2"
        text={title}
        className={cn(
          "mt-4 font-display text-[2.1rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]",
          tone === "light" ? "text-ivory" : "text-forest",
        )}
      />
      {description ? (
        <Reveal delay={0.2}>
          <p className={cn("mt-5 text-lg leading-relaxed", tone === "light" ? "text-ivory/75" : "text-ink/70")}>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
