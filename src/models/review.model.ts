import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  itemId: { type: Types.ObjectId, ref: "Item", required: true },
  itemType: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Review = model("Review", reviewSchema, "reviews");
