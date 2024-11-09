import { Document } from "mongoose";

export interface IPlace extends Document {
  author_name: string;
  keywords: string[];
  image: string;
  description: string;
}
