import multer from "multer";
import { randomUUID } from "node:crypto";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const extensionByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/listings");
  },

  filename: function (req, file, cb) {
    const id = randomUUID();
    const mimeType = file.mimetype;

    cb(null, `${id}${extensionByMimeType[mimeType]}`);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    const error = new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
    error.status = 400;
    cb(error);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});
