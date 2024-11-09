import { Document } from "mongoose";

export interface IPlace extends Document {
  author_name: string;
  keyords: string[];
  image: string;
  description: string;
}
