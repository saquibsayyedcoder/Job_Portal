// multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the directory exists
const uploadPath = path.join(path.resolve(), "uploads", "resumes");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export const singleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("MulterError:", err);
      return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    next();
  });
};
