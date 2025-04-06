import { Schema, model, Types } from "mongoose";

const ratingSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  itemId: { type: Types.ObjectId, ref: "Item", required: true },
  itemType: { type: String, required: true },
  score: { type: Number, required: true },
}, { timestamps: true });

export const Rating = model("Rating", ratingSchema, "ratings");
