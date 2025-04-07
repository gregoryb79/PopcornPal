import express from "express";
import { Rating } from "../models/rating.model";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();


router.get("/", async (req, res) => {
    const itemId = req.query.search;
    const userId = req.signedCookies.userId;

    console.log(`itemId for ratings is ${itemId}`);

    if (itemId){
        try{
            const ratings = await Rating.find(
                {                   
                    itemId: itemId
                },
                { _id: true, itemTitle: true, score: true}
            );        
            if(ratings.length > 0){
                console.log(`Found ratings: ${JSON.stringify(ratings)}`);
                res.json(ratings);
            }else{
                console.log(`No ratings found for itemId: ${itemId}`);
                res.status(500);
                res.send(`Couldnt find raitings for : ${itemId} in DB.`);
            }
            
        } catch(error) {
            console.error(`Couldnt find raitings for : ${itemId} in DB.`,error);
            res.status(500);
            res.send(`Couldnt find raitings for : ${itemId} in DB.`);
        } 
    }else{
        try{
            const ratings = await Rating.find(
                {                   
                    userId: userId
                },
                { _id: true, itemId: true, itemTitle: true, score: true}
            );      
            if(ratings.length > 0){
                res.json(ratings);
            }else{
                res.status(500);
                res.send(`Couldnt find raitings for : ${itemId} in DB.`);
            }              
        } catch(error) {
            console.error(`Couldnt find raitings by : ${userId} in DB.`,error);
            res.status(500);
            res.send(`Couldnt find raitings by : ${userId} in DB.`);
        } 
    }   
});

router.get("/:id",authenticate, async (req, res) => {
    const { id } = req.params;    

    try{
        console.log(`getting rating id= ${id}`);        
        const raiting = await Rating.findById(id);       
        if (!raiting) {
            console.log(`rating id : ${id} is not in DB.`);
            res.status(404);
            res.send(`rating id : ${id} is not in DB.`);            
            return;
        }
        if (raiting.userId != req.signedCookies.userId){
            console.log(`Access denied to raiting id : ${id}.`);
            res.status(401);
            res.send(`Access denied to raiting id : ${id}.`);            
            return;
        }

        res.json(raiting);
    }catch (error) {
        console.error(`Couldnt look for raiting id: ${id} in DB.`,error);

        res.status(500);
        res.send(`Couldnt look for raiting id : ${id} in DB.`);
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
            await Rating.findOneAndReplace(
                {_id: id},
                {...body, userId : req.signedCookies.userId},
                { upsert: true }
            );
    
            res.status(201);
            res.json(id);
        } catch (error) {        
            console.error(`Couldnt put Rating id: ${id}.`,error);
            res.status(500);
            res.send(`Couldnt put Rating id: ${id}.`);
        }
    }else{
        const newRating = new Rating({...body});
        console.log(newRating);
         try{
             await newRating.save();
             res.status(201);
             res.json(newRating._id);
         } catch (error) {        
             console.error(`Couldnt save new Rating.`,error);
             res.status(500);
             res.send(`Couldnt save new Rating.`);
         }
    }   
        
});

router.delete("/:id",authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const rating = await Rating.findById(id);       
        if (!rating) {
            console.log(`Rating id : ${id} is not in DB.`);
            res.status(404);
            res.send(`Rating id : ${id} is not in DB.`);            
            return;
        }
        if (rating.userId != req.signedCookies.userId){
            console.log(`Access denied to rating id : ${id}.`);
            res.status(401);
            res.send(`Access denied to rating id : ${id}.`);            
            return;
        }
        
        await Rating.findOneAndDelete({ _id: id });     
        res.status(204);
        res.end();  
    } catch {
        console.log(`Couldnt delete Rating id: ${id}.`);
        res.status(500);
        res.send(`Couldnt delete Rating id: ${id}.`);
        return;
    }

    res.status(204);
    res.end();
});

