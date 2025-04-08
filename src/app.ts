import path from "path";
import express from "express";
import crypto from "crypto";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { router as apiRouter } from "./routers/api";
import { User } from "./models/users.model";

export const app = express();

app.use((req, _, next) => {
    console.log((new Date()).toLocaleString(), req.method, req.url);
    next();
});

app.use(json());
app.use(cookieParser(process.env.SESSION_SECRET));
const hashKey = process.env.HASH_SECRET || "defaultKey";

app.use((req, res, next) => {
    const userId = req.signedCookies.userId;   

    if (req.url.startsWith("/home") || 
        req.url.startsWith("/raitings") || 
        req.url.startsWith("/reviews") ||
        req.url.startsWith("/item") || 
        req.url.startsWith("/watchlist")) {
        if (!userId) {
            console.log(`Unauthorized access attempt to ${req.url}`);
            res.redirect("/login"); 
            return;
        }    
    }
    
    next(); // Proceed to the next middleware or route handler
});

app.all("/", (req, res, next) => {
    const userId = req.signedCookies.userId;
    if (userId) {
        console.log(`User ${userId} already logged in`);
        res.redirect("/home");
        return;
    }else{
        res.redirect("/login");
    }
    next();
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log(`Starting login email = ${email}, password = ${password}`);

    const credentials  = await User.find({email: email},
        {email: true,
         passwordHash: true});

    console.log(credentials);
    if (credentials.length == 0){
        res.status(401);
        res.send("Wrong credentials");
        return;
    }
    const hashedPassword = crypto.createHmac("sha256", hashKey).update(`${password}-${email}`).digest("hex");

    if (email !== credentials[0].email || hashedPassword !== credentials[0].passwordHash) {
        res.status(401);
        res.send("Wrong credentials");
        return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    console.log(credentials[0]._id);
    
    res.cookie("userId", credentials[0]._id, {
        expires,
        signed: true,
        httpOnly: true,
    });

    res.end();
});

app.get("/logout", async (req, res) => {
    res.clearCookie("userId", { httpOnly: true, signed: true });
    res.send("Logged out successfully.");
});

app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    console.log("Starting register");

    const emailCheck  = await User.find({email: email},{email: true});
    if (emailCheck.length > 0){
        res.status(401);
        res.send(`user with email ${email} already exists.`);
        console.log(`user with email ${email} already exists.`);
        return;
    }

    const usernameCheck  = await User.find({username: username},{username: true});
    if (usernameCheck.length > 0){
        res.status(401);
        res.send(`user with username ${username} already exists.`);
        console.log(`user with username ${username} already exists.`);
        return;
    }
    
    const hashedPassword = crypto.createHmac("sha256", hashKey).update(`${password}-${email}`).digest("hex");

    try {     

        const createdUser = await User.create({
            email,
            passwordHash: hashedPassword,
            username,
        });

        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        res.cookie("userId", createdUser._id, {
            expires,
            signed: true,
            httpOnly: true,
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);

        res.status(500);
        res.send("Oops, something went wrong");
    }
});

app.use("/api", apiRouter);
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use((req, res) => {
    console.log((new Date()).toLocaleString(), req.method, req.url);
    res.redirect("404.html");
});
