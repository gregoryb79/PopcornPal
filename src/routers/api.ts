import express from "express";
import { router as itemsRouter } from "./items.router";

export const router = express.Router();

router.get("/hello", (_, res) => {
    res.json({ message: "Hello World!" });
});

router.use("/items", itemsRouter);