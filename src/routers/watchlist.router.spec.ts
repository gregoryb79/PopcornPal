import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { router as watchlistRouter } from "./watchlist.router";
import { WatchlistItem } from "../models/watchlistItem.model";

const testUserId = new mongoose.Types.ObjectId();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.signedCookies = { userId: testUserId.toString() };
    next();
  });

app.use("/api/watchlist", watchlistRouter);

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
  await WatchlistItem.deleteMany({});
});

const validBody1 = {
    itemTitle: "Test title 01",    
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
    status: "Completed",
  };

const validBody2 = {
    itemTitle: "Test title 02",   
    itemId: new mongoose.Types.ObjectId(),
    userId: testUserId,
    status: "Watching",
  };


describe("Items API", () => {
  it("should create a new item", async () => {
    const res = await request(app).put("/api/watchlist/invalid-id").send(validBody1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
  });

  it("should update an existing item", async () => {
    const item = await WatchlistItem.create(validBody1);
    const res = await request(app)
      .put(`/api/watchlist/${item._id}`)
      .send({ content: "item review updated" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(item._id.toString());
  });

  it("should fetch all watchlist", async () => {
    await WatchlistItem.create([validBody1,validBody2]);
   
    const res = await request(app).get("/api/watchlist");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should search watchlist by item ID", async () => {
    
    await WatchlistItem.create(validBody1);

    const res = await request(app).get(`/api/watchlist?search=${validBody1.itemId.toString()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should search watchlist by title", async () => {
    
    await WatchlistItem.create(validBody1);

    const res = await request(app).get(`/api/watchlist?search=01`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should search watchlist by status", async () => {
    
    await WatchlistItem.create(validBody1);

    const res = await request(app).get(`/api/watchlist?search=Completed`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].itemTitle).toBe("Test title 01");
  });

  it("should get item by ID", async () => {
    const item = await WatchlistItem.create(validBody1);
    const res = await request(app).get(`/api/watchlist/${item._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.itemTitle).toBe("Test title 01");
  });

  it("should return 404 for non-existent item ID", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/watchlist/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it("should delete an item", async () => {
    const item = await WatchlistItem.create(validBody1);

    const res = await request(app).delete(`/api/watchlist/${item._id}`);
    expect(res.statusCode).toBe(204);

    const found = await WatchlistItem.findById(item._id);
    expect(found).toBeNull();
  });

  it("should return 404 on deleting non-existent item", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/watchlist/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
