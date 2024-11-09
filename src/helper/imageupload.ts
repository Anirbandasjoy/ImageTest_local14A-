import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

sharp.concurrency(2);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage });

export const optimizeImageQuality = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  try {
    const file = req.file;
    const filePath = path.join("uploads", file.filename);
    const fileExtension = path.extname(file.filename).toLowerCase();

    if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
      const outputPath = path.join("uploads", `optimized-${file.filename}`);

      const image = sharp(filePath).resize({
        width: 1200, // Adjust width as needed
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      });

      if (fileExtension === ".png") {
        await image.png({ quality: 80 }).toFile(outputPath);
      } else {
        await image.jpeg({ quality: 70 }).toFile(outputPath);
      }

      // Replace original file with optimized version
      await fs.rename(outputPath, filePath);
    }

    next();
  } catch (error) {
    console.error("Failed to optimize image quality:", error);
    next(error);
  }
};
