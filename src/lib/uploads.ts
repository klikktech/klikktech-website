import "server-only";
import { put, del } from "@vercel/blob";
import { randomUUID } from "node:crypto";

const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

// Same validation as retail-software's lib/uploads.ts. Returns an absolute
// Vercel Blob URL — this file is served independently of the tenant's own
// domain, so the tenant's retail-software deployment just renders logoUrl
// as a plain external <img src>, same as before.
export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  const extension =
    EXTENSION_BY_MIME_TYPE[file.type] ??
    (file.name.toLowerCase().endsWith(".svg") ? ".svg" : undefined);
  if (!extension) {
    throw new Error("Images must be JPEG, PNG, WebP, GIF, or SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Each image must be smaller than 4MB.");
  }

  const blob = await put(`${subdir}/${randomUUID()}${extension}`, file, { access: "public" });
  return blob.url;
}

// Best-effort removal of a logo saved by saveUploadedImage. Only attempts
// deletion for URLs that look like a Vercel Blob URL — anything else (e.g. a
// manually-entered logo URL) is left alone.
export async function deleteUploadedImageIfLocal(imageUrl: string): Promise<void> {
  if (!imageUrl.includes(".public.blob.vercel-storage.com/")) return;
  await del(imageUrl).catch(() => {});
}
