import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost" | "outline-light" | "nut" | "danger" | "whatsapp";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-deep shadow-soft hover:shadow-lift",
  secondary: "bg-transparent text-forest ring-1 ring-inset ring-forest/25 hover:bg-forest hover:text-ivory",
  light: "bg-ivory text-forest hover:bg-white shadow-soft",
  ghost: "bg-transparent text-forest hover:bg-forest/5",
  "outline-light": "bg-white/5 text-ivory ring-1 ring-inset ring-ivory/40 backdrop-blur-sm hover:bg-ivory hover:text-forest",
  nut: "bg-nut text-ivory hover:bg-[#755438] shadow-soft",
  danger: "bg-red-700 text-white hover:bg-red-800",
  whatsapp: "bg-[#1f9d55] text-white hover:bg-[#178347] shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
  icon: "h-10 w-10",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-all duration-300 ease-out",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} {...props} />;
});

/** Arrow icon that slides on hover — use inside buttons/links with the `group/btn` class */
export function ArrowSlide({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-4 w-4 overflow-hidden", className)} aria-hidden>
      <svg viewBox="0 0 16 16" className="absolute h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 16 16" className="absolute h-4 w-4 -translate-x-5 transition-transform duration-300 group-hover/btn:translate-x-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
