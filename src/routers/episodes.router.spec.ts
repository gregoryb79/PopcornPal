import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { router as episodesRouter } from "./episodes.router";
import { Episode } from "../models/episode.model";

const app = express();
app.use(express.json());
app.use("/api/episodes", episodesRouter);

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
  await Episode.deleteMany({});
});

const validBody1 = {
    title: "Pilot test",
        seasonNumber: 1,
        episodeNumber: 1,
        showId: new mongoose.Types.ObjectId(),
  };

const validBody2 = {
    title: "Super Pilot",
        seasonNumber: 2,
        episodeNumber: 2,
        showId: new mongoose.Types.ObjectId(),
  };


describe("Items API", () => {
  it("should create a new item", async () => {
    const res = await request(app).put("/api/episodes/invalid-id").send(validBody1);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
  });

  it("should update an existing item", async () => {
    const item = await Episode.create(validBody1);
    const res = await request(app)
      .put(`/api/episodes/${item._id}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(item._id.toString());
  });

  it("should fetch all episodes", async () => {
    await Episode.create([validBody1,validBody2]);

    const res = await request(app).get("/api/episodes");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should search episodes by title or fields", async () => {
    
    await Episode.create(validBody1);


    const res = await request(app).get("/api/episodes?search=test");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("Pilot test");
  });

  it("should get item by ID", async () => {
    const item = await Episode.create(validBody1);
    const res = await request(app).get(`/api/episodes/${item._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Pilot test");
  });

  it("should return 404 for non-existent item ID", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/episodes/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it("should delete an item", async () => {
    const item = await Episode.create(validBody1);

    const res = await request(app).delete(`/api/episodes/${item._id}`);
    expect(res.statusCode).toBe(204);

    const found = await Episode.findById(item._id);
    expect(found).toBeNull();
  });

  it("should return 404 on deleting non-existent item", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/episodes/${id}`);
    expect(res.statusCode).toBe(404);
  });
});
