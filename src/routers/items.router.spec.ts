import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { router as itemsRouter } from "./items.router";
import { Item } from "../models/item.model";

const app = express();
app.use(express.json());
app.use("/api/items", itemsRouter);

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
  await Item.deleteMany({});
});

const validBody1 = {
    title: "Test Movie",
    director: "John Doe",
    description: "Test description",
    genres: ["Drama"],
    cast: ["Actor A"],
    releaseDate: "2001-01-01T00:00:00.000Z",
    type: "Movie"
  };

const validBody2 = {
    title: "Test Movie2",
    director: "John Doe2",
    description: "Test description2",
    genres: ["Drama"],
    cast: ["Actor A"],
    releaseDate: "2001-01-01T00:00:00.000Z",
    type: "Movie"
  };


describe("Items API", () => {
  it("should create a new item", async () => {
    const res = await request(app).put("/api/items/invalid-id").send(validBody1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
  });

  it("should update an existing item", async () => {
    const item = await Item.create(validBody1);
    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(item._id.toString());
  });

  it("should fetch all items", async () => {
    await Item.create([validBody1,validBody2]);

    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should search items by title or fields", async () => {
    
    await Item.create(validBody1);


    const res = await request(app).get("/api/items?search=test");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("Test Movie");
  });

  it("should get item by ID", async () => {
    const item = await Item.create(validBody1);
    const res = await request(app).get(`/api/items/${item._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Movie");
  });

  it("should return 404 for non-existent item ID", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/items/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it("should delete an item", async () => {
    const item = await Item.create(validBody1);

    const res = await request(app).delete(`/api/items/${item._id}`);
    expect(res.statusCode).toBe(204);

    const found = await Item.findById(item._id);
    expect(found).toBeNull();
  });

  it("should return 404 on deleting non-existent item", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/items/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
