import { Schema, model, Types } from "mongoose";

const episodeSchema = new Schema({
  title: { type: String, required: true },
  seasonNumber: { type: Number, required: true },
  episodeNumber: { type: Number, required: true },
  airDate: { type: Date },
  runtime: { type: Number },
  showId: { type: Types.ObjectId, ref: "Item", required: true },
}, { timestamps: true });

export const Episode = model("Episode", episodeSchema, "episodes");
