import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { router as reviewsRouter } from "./review.router";
import { Review } from "../models/review.model";

const testUserId = new mongoose.Types.ObjectId();

const app = express();
app.use(express.json());
app.use((req, _, next) => {
    req.signedCookies = { userId: testUserId.toString() };
    next();
  });

app.use("/api/reviews", reviewsRouter);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: "jest",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Review.deleteMany({});
});

const validBody1 = {
    itemTitle: "Test title 01",
    content: "item review test text 01",
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
  };

const validBody2 = {
    itemTitle: "Test title 02",
    content: "item review test text 02",
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
  };


describe("Items API", () => {
  it("should create a new item", async () => {
    const res = await request(app).put("/api/reviews/invalid-id").send(validBody1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
  });

  it("should update an existing item", async () => {
    const item = await Review.create(validBody1);
    const res = await request(app)
      .put(`/api/reviews/${item._id}`)
      .send({ content: "item review updated" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(item._id.toString());
  });

  it("should fetch all reviews", async () => {
    await Review.create([validBody1,validBody2]);

    const res = await request(app).get("/api/reviews");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should search reviews by item ID", async () => {
    
    await Review.create(validBody1);

    const res = await request(app).get(`/api/reviews?search=${validBody1.itemId.toString()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should search reviews by title", async () => {
    
    await Review.create(validBody1);

    const res = await request(app).get(`/api/reviews?search=01`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should search reviews by userId", async () => {
    
    await Review.create(validBody1);

    const res = await request(app).get(`/api/reviews`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].content).toBe("item review test text 01");
  });

  it("should get item by ID", async () => {
    const item = await Review.create(validBody1);
    const res = await request(app).get(`/api/reviews/${item._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.itemTitle).toBe("Test title 01");
  });

  it("should return 404 for non-existent item ID", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/reviews/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it("should delete an item", async () => {
    const item = await Review.create(validBody1);

    const res = await request(app).delete(`/api/reviews/${item._id}`);
    expect(res.statusCode).toBe(204);

    const found = await Review.findById(item._id);
    expect(found).toBeNull();
  });

  it("should return 404 on deleting non-existent item", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/reviews/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
