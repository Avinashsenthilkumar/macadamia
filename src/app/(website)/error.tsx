"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonClasses } from "@/components/ui/button";

export default function WebsiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-deep pb-24 pt-44 text-ivory">
      <div className="container-x max-w-2xl text-center">
        <p className="eyebrow justify-center text-sage">Something went wrong</p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">We couldn&apos;t load this page.</h1>
        <p className="mt-4 text-ivory/75">Please try again. If the problem continues, call or WhatsApp us and we&apos;ll help directly.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="light" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={buttonClasses({ variant: "outline-light" })}>
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
