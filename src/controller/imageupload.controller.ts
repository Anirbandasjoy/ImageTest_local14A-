import { NextFunction, Request, Response } from "express";
import { successResponse } from "./response.controller";

import createHttpError from "http-errors";
import path from "path";
import fs from "fs/promises";
import Image from "../models/imageupload.model";

export const handleImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { author_name, description, keywords } = req.body;
    console.log({ author_name, description, keywords });
    const imageFile = req.file?.filename;
    if (!imageFile) {
      next(createHttpError(400, "No image uploaded."));
      return;
    }

    const newPlace = await Image.create({
      author_name,
      image: imageFile,
      description,
      keywords,
    });

    successResponse(res, {
      statusCode: 201,
      message: "Image has been uploaded successfully",
      payload: newPlace,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindAllPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { keywords } = req.query;

    let filter = {};
    if (keywords) {
      filter = {
        keywords: { $in: Array.isArray(keywords) ? keywords : [keywords] },
      };
    }

    const places = await Image.find(filter);
    successResponse(res, {
      statusCode: 200,
      message: "All places retrieved successfully",
      payload: places,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const placeToDelete = await Image.findById(id);

    if (!placeToDelete) {
      return next(createHttpError(404, "Place not found."));
    }

    const image = placeToDelete.image;
    if (image) {
      const fullPath = path.join(__dirname, "..", "..", "uploads", image);
      try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      } catch (err: any) {
        if (err.code === "ENOENT") {
          console.warn(`File not found: ${fullPath}`);
        } else {
          console.error(`Failed to delete image at ${fullPath}:`, err);
        }
      }
    }

    await Image.findByIdAndDelete(id);

    successResponse(res, {
      statusCode: 200,
      message: "Place deleted successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindSinglePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const place = await Image.findById(id);

    if (!place) {
      return next(createHttpError(404, "Place not found."));
    }

    successResponse(res, {
      statusCode: 200,
      message: "Place retrieved successfully",
      payload: place,
    });
  } catch (error) {
    next(error);
  }
};
``;
