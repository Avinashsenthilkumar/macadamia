import "server-only";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";
import { UploadError } from "@/lib/upload";
import { fieldErrors } from "@/lib/validations/admin";

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string | undefined>;
  redirectTo?: string;
} | null;

/**
 * Wraps admin server-action bodies: converts known errors into friendly messages and
 * never leaks database details to the browser. Do not call redirect() inside `fn` —
 * return `redirectTo` and redirect after this resolves.
 */
export async function runAction(fn: () => Promise<NonNullable<ActionState>>): Promise<ActionState> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, message: error.message };
    if (error instanceof UploadError) return { ok: false, message: error.message };
    if (error instanceof ZodError) return { ok: false, message: "Please correct the highlighted fields.", errors: fieldErrors(error) };
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { ok: false, message: "An item with the same unique value (such as the URL slug or email) already exists." };
      if (error.code === "P2025") return { ok: false, message: "This item no longer exists. Please refresh the page." };
    }
    console.error("[admin action]", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export function revalidatePublic(...paths: string[]) {
  for (const p of new Set(["/", "/sitemap.xml", ...paths])) revalidatePath(p);
}

export function idFrom(formData: FormData, key = "id"): string | null {
  const v = formData.get(key);
  return typeof v === "string" && /^[a-z0-9]{10,40}$/i.test(v) ? v : null;
}
