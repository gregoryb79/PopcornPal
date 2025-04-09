import express from "express";
import { router as itemsRouter } from "./items.router";
import { router as ratingsRouter } from "./ratings.router";
import { router as reviewsRouter } from "./review.router";
import { router as watchlistRouter } from "./watchlist.router";

export const router = express.Router();

// router.get("/hello", (_, res) => {
//     res.json({ message: "Hello World!" });
// });

router.use("/items", itemsRouter);
router.use("/ratings", ratingsRouter);
router.use("/reviews", reviewsRouter);
router.use("/watchlist", watchlistRouter);
