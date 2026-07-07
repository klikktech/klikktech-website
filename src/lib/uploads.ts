import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { siteUrl } from "@/lib/seo/site-config";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 4 * 1024 * 1024;

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

// Same validation as retail-software's lib/uploads.ts, but returns an
// ABSOLUTE url (this file is served from klikktech-website's own domain,
// not the tenant's) since the tenant's retail-software deployment renders
// logoUrl as a plain external <img src> with no local /uploads of its own
// copy of the file.
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

  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return `${siteUrl.replace(/\/$/, "")}/uploads/${subdir}/${filename}`;
}
