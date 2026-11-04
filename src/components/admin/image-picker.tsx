"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

const MAX_EDGE = 2000;
const REQUEST_BUDGET = 4 * 1024 * 1024; // Vercel limits request bodies to ~4.5 MB

/** Downscales large photos and converts them to WebP in the browser before upload */
async function compress(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 900_000) return file;
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/** File input with client-side compression and previews (validation still happens on the server) */
export function ImagePicker({ name, multiple = false, label = "Upload images", hint = "JPG, PNG, WebP or AVIF · large photos are resized automatically" }: { name: string; multiple?: boolean; label?: string; hint?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p)), [previews]);

  const onChange = async (list: FileList | null) => {
    const input = inputRef.current;
    if (!input || !list) return;
    setBusy(true);
    const files: File[] = await Promise.all(Array.from(list).map(compress));
    try {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    } catch {
      // Older browsers without DataTransfer: originals are uploaded unchanged
    }
    setTotal(files.reduce((sum, f) => sum + f.size, 0));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    setBusy(false);
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-forest/20 bg-white px-6 py-8 text-center transition hover:border-leaf hover:bg-cream/40">
        {busy ? <Loader2 className="h-8 w-8 animate-spin text-leaf" /> : <ImagePlus className="h-8 w-8 text-leaf" />}
        <span className="font-semibold text-deep">{busy ? "Optimising…" : label}</span>
        <span className="text-xs text-ink/55">{hint}</span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => void onChange(e.target.files)}
        />
      </label>
      {previews.length ? (
        <>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimisable
              <img key={src} src={src} alt="Selected file preview" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
          <p className={`mt-2 text-xs ${total > REQUEST_BUDGET ? "font-semibold text-red-700" : "text-ink/55"}`}>
            {(total / 1024 / 1024).toFixed(1)} MB selected
            {total > REQUEST_BUDGET ? " — too large for one upload. Please select fewer images at a time." : ""}
          </p>
        </>
      ) : null}
    </div>
  );
}
