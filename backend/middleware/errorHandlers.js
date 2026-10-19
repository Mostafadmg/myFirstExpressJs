import multer from "multer";

export function notFound(req, res) {
  return res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Each image must be 5 MB or smaller."
      : error.code === "LIMIT_FILE_COUNT"
        ? "You can upload at most 5 images at a time."
        : "The uploaded files could not be accepted.";
    return res.status(status).json({ message });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }

  if (error.status && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ message: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
}
