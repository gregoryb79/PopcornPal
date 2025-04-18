import { Schema, model, Types } from "mongoose";

const watchlistItemSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  itemId: { type: Types.ObjectId, ref: "Item", required: true },
  itemTitle: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Watching", "Completed", "Plan to Watch", "Dropped"], 
    required: true 
  },
}, { timestamps: true });

export const WatchlistItem = model("WatchlistItem", watchlistItemSchema, "watchlist.items");
