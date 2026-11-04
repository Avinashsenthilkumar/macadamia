import Link from "next/link";
import { FloatingNature, GrowingSapling } from "@/components/motion/decor";
import { buttonClasses } from "@/components/ui/button";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-screen items-center overflow-hidden bg-deep text-ivory">
      <FloatingNature />
      <div className="container-x relative grid items-center gap-10 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow text-sage">Error 404</p>
          <h1 className="mt-5 font-display text-5xl leading-tight sm:text-7xl">This path hasn&apos;t been planted yet.</h1>
          <p className="mt-5 max-w-md text-lg text-ivory/75">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className={buttonClasses({ variant: "light", size: "lg" })}>
              Back to home
            </Link>
            <Link href="/macadamia-plants" className={buttonClasses({ variant: "outline-light", size: "lg" })}>
              Macadamia plants
            </Link>
          </div>
        </div>
        <GrowingSapling className="mx-auto h-80 w-auto" />
      </div>
    </main>
  );
}
