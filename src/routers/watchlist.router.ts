import express from "express";
import {WatchlistItem} from "../models/watchlistItem.model"
import { authenticate } from "../middleware/authenticate";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

export const router = express.Router();

router.get("/",authenticate, async (req, res) => {
    const { search } = req.query;
    const userId = req.signedCookies.userId;

    try{
        const wlItems = await WatchlistItem.find(
            {
                $or: [
                    { itemTitle: new RegExp(search?.toString() ?? "", "gi") },                    
                    { itemId: search },
                ],
                user: userId
            },
            { _id: true, itemTitle: true, itemId: true, status: true }
        );        
        res.json(wlItems);
    } catch(error) {
        console.error(`Couldnt do the query: ${search} in DB.`,error);
        res.status(500);
        res.send(`Couldnt do the query: ${search} in DB.`);
    }    
});

router.get("/:id",authenticate, async (req, res) => {
    const { id } = req.params;    

    try{
        console.log(`getting wlItem id= ${id}`);        
        const wlItem = await WatchlistItem.findById(id);       
        if (!wlItem) {
            console.log(`wlItem id : ${id} is not in DB.`);
            res.status(404);
            res.send(`wlItem id : ${id} is not in DB.`);            
            return;
        }
        if (wlItem.userId != req.signedCookies.userId){
            console.log(`Access denied to wlItem id : ${id}.`);
            res.status(401);
            res.send(`Access denied to wlItem id : ${id}.`);            
            return;
        }

        res.json(wlItem);
    }catch (error) {
        console.error(`Couldnt look for wlItem id: ${id} in DB.`,error);

        res.status(500);
        res.send(`Couldnt look for wlItem id : ${id} in DB.`);
    }   
});

router.put("/:id",authenticate, async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    console.log(`is the id = ${id} valid id? => ${isValidId}`);
    console.log(body);

    if (isValidId) {
        try{
            await WatchlistItem.findOneAndReplace(
                {_id: id},
                {...body, user : req.signedCookies.userId},
                { upsert: true }
            );
    
            res.status(201);
            res.json(id);
        } catch (error) {        
            console.error(`Couldnt put wlItem id: ${id}.`,error);
            res.status(500);
            res.send(`Couldnt put wlItem id: ${id}.`);
        }
    }else{
        const newWLItem = new WatchlistItem({            
            itemId: body.itemId,
            itemTitle: body.itemTitle,
            userId: req.signedCookies.userId,
            status: body.status
        });
        console.log(newWLItem);
         try{
             await newWLItem.save();
             res.status(201);
             res.json(newWLItem._id);
         } catch (error) {        
             console.error(`Couldnt save new wlItem.`,error);
             res.status(500);
             res.send(`Couldnt save new wlItem.`);
         }
    }   
        
});

router.delete("/:id",authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const wlItem = await WatchlistItem.findById(id);       
        if (!wlItem) {
            console.log(`wlItem id : ${id} is not in DB.`);
            res.status(404);
            res.send(`wlItem id : ${id} is not in DB.`);            
            return;
        }
        if (wlItem.userId != req.signedCookies.userId){
            console.log(`Access denied to wlItem id : ${id}.`);
            res.status(401);
            res.send(`Access denied to wlItem id : ${id}.`);            
            return;
        }
        
        await WatchlistItem.findOneAndDelete({ _id: id });     
        res.status(204);
        res.end();  
    } catch {
        console.log(`Couldnt delete wlItem id: ${id}.`);
        res.status(500);
        res.send(`Couldnt delete wlItem id: ${id}.`);
        return;
    }

    res.status(204);
    res.end();
});