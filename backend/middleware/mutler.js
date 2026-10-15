import multer from "multer";

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/listings");
  },

  filename: function (req, file, cb) {
    const base = sanitizeFilename(file.originalname) || "photo";
    cb(null, `${req.params.id}-${base}.jpg`);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});
