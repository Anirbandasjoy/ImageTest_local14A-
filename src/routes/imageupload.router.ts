import { Router } from "express";
import { optimizeImageQuality, upload } from "../helper/imageupload";
import {
  handleDeletePlace,
  handleFindAllPlaces,
  handleFindSinglePlace,
  handleImageUpload,
} from "../controller/imageupload.controller";

const imageUploadRouter = Router();

imageUploadRouter.post(
  "/upload",
  upload.single("image"),
  optimizeImageQuality,
  handleImageUpload
);

imageUploadRouter.get("/find", handleFindAllPlaces);
imageUploadRouter.get("/:id", handleFindSinglePlace);
imageUploadRouter.delete("/:id", handleDeletePlace);

export default imageUploadRouter;
