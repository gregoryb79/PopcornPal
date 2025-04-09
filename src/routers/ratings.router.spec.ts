import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { router as ratingsRouter } from "./ratings.router";
import { Rating } from "../models/rating.model";

const testUserId = new mongoose.Types.ObjectId();

const app = express();
app.use(express.json());
app.use((req, _, next) => {
  req.signedCookies = { userId: testUserId.toString() };
  next();
});

app.use("/api/ratings", ratingsRouter);

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
  await Rating.deleteMany({});
});

const validBody1 = {
    itemTitle: "Test title 01",
    score: 5,
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
  };

const validBody2 = {
    itemTitle: "Test title 02",
    score: 2,
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
  };


describe("Items API", () => {
  it("should create a new item", async () => {
    const res = await request(app).put("/api/ratings/invalid-id").send(validBody1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
  });

  it("should update an existing item", async () => {
    const item = await Rating.create(validBody1);
    const res = await request(app)
      .put(`/api/ratings/${item._id}`)
      .send({ score: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(item._id.toString());
  });

  it("should fetch all ratings", async () => {
    await Rating.create([validBody1,validBody2]);

    const res = await request(app).get("/api/ratings");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should search ratings by item ID", async () => {
    
    await Rating.create(validBody1);

    const res = await request(app).get(`/api/ratings?search=${validBody1.itemId.toString()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should search ratings by user ID", async () => {
    
    await Rating.create(validBody2);

    const res = await request(app).get(`/api/ratings`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemId).toBe(validBody2.itemId.toString());
  });

  it("should get item by ID", async () => {
    const item = await Rating.create(validBody1);
    const res = await request(app).get(`/api/ratings/${item._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.itemTitle).toBe("Test title 01");
  });

  it("should return 404 for non-existent item ID", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/ratings/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it("should delete an item", async () => {
    const item = await Rating.create(validBody1);

    const res = await request(app).delete(`/api/ratings/${item._id}`);
    expect(res.statusCode).toBe(204);

    const found = await Rating.findById(item._id);
    expect(found).toBeNull();
  });

  it("should return 404 on deleting non-existent item", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/ratings/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
