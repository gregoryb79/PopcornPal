import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Movie", "Show"], required: true },
  releaseDate: { type: String, required: true },
  posterUrl: { type: String },
  description: { type: String },
  genres: [{ type: String }],
  cast: [{ type: String }],
  director: { type: String },
  runtime: { type: Number },
  seasons: { type: Number },
}, { timestamps: true });

export const Item = model("Item", itemSchema, "items");
