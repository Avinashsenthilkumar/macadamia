import "server-only";
import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { detectImageType } from "@/lib/image-type";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export class UploadError extends Error {}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

/**
 * Validates and stores an uploaded image. Uses Cloudinary when configured (required on
 * Vercel, whose filesystem is read-only); falls back to /public/uploads in development.
 */
export async function storeImage(file: File, folder: string): Promise<string> {
  if (!(file instanceof File) || file.size === 0) throw new UploadError("Please choose an image to upload.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 5 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) throw new UploadError("Only JPG, PNG, WebP or AVIF images are allowed.");

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "misc";

  if (isCloudinaryConfigured()) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const cloudFolder = `ganesh-nursery/${safeFolder}`;
    const toSign = `folder=${cloudFolder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    const signature = createHash("sha1").update(toSign).digest("hex");

    const form = new FormData();
    form.append("file", new Blob([bytes], { type: type.mime }));
    form.append("api_key", process.env.CLOUDINARY_API_KEY!);
    form.append("timestamp", timestamp);
    form.append("folder", cloudFolder);
    form.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      console.error("[upload] Cloudinary error", res.status, await res.text());
      throw new UploadError("Image upload failed. Please try again.");
    }
    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) throw new UploadError("Image upload failed. Please try again.");
    return json.secure_url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new UploadError("Image storage is not configured. Add Cloudinary credentials in the environment settings.");
  }

  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${type.ext}`;
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${safeFolder}/${name}`;
}

/** Reads an optional image from FormData; returns null when no file was chosen */
export async function optionalImage(formData: FormData, field: string, folder: string): Promise<string | null> {
  const file = formData.get(field);
  if (!file || !(file instanceof File) || file.size === 0) return null;
  return storeImage(file, folder);
}
