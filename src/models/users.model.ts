import { Schema, model } from "mongoose";

const schema = new Schema({
    username: {type: String, required: true },
    email: {type: String, required: true },
    passwordHash: {type: String, required: true },    
}, { timestamps: true });

export const Listing = model("User", schema,"users");
