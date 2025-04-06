import "dotenv/config";

import { createServer } from "http";
import mongoose from "mongoose";
import { app } from "./app";

const server = createServer(app);
const port = process.env.PORT || 8090;

async function init() {
    await mongoose.connect(process.env.CONNECTION_STRING!, {
        dbName: process.env.DB_NAME,
    });

    server.listen(port, () => console.log(`Server listening on port ${port}`));
}

init();
