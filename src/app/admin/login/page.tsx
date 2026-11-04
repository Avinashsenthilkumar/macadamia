import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { FloatingNature } from "@/components/motion/decor";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-4 py-16">
      <FloatingNature />
      <div className="relative w-full max-w-md rounded-[2rem] bg-ivory p-8 shadow-2xl sm:p-10">
        <p className="eyebrow">Ganesh Nursery</p>
        <h1 className="mt-3 font-display text-3xl text-forest">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink/60">Authorised staff only.</p>
        <LoginForm />
      </div>
    </main>
  );
}
