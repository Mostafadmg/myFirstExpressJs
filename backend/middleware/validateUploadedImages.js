import { open, unlink } from "node:fs/promises";

async function readImageMimeType(filePath) {
  const file = await open(filePath, "r");
  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await file.read(header, 0, header.length, 0);
    const bytes = header.subarray(0, bytesRead);

    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") return "image/png";
    if (["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"))) return "image/gif";
    if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
    return null;
  } finally {
    await file.close();
  }
}

async function removeUploadedFiles(files = []) {
  await Promise.allSettled(files.map((file) => unlink(file.path)));
}

export async function validateUploadedImages(req, res, next) {
  try {
    for (const file of req.files ?? []) {
      const actualMimeType = await readImageMimeType(file.path);
      if (!actualMimeType || actualMimeType !== file.mimetype) {
        await removeUploadedFiles(req.files);
        return res.status(400).json({ message: "An uploaded file is not a valid image matching its declared type." });
      }
    }
    return next();
  } catch (error) {
    await removeUploadedFiles(req.files);
    return next(error);
  }
}
