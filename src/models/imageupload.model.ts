import { model, Schema } from "mongoose";
import { IPlace } from "../types/imageupload.types";

const imageSchema = new Schema<IPlace>(
  {
    author_name: {
      type: String,
      required: [true, "author_name is required"],
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 500,
    },

    keywords: {
      type: [String],
      required: [true, "keyords is required"],
    },
  },

  {
    timestamps: true,
  }
);

const Image = model<IPlace>("Image", imageSchema);

export default Image;
