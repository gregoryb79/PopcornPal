import express from "express";
import { Review } from "../models/review.model";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();


router.get("/", authenticate, async (req, res) => {
    const {search} = req.query;
    const userId = req.signedCookies.userId;

    if (search){
        try{
            const reviews = await Review.find(
                {                   
                    $or: [
                        { itemTitle: new RegExp(search?.toString() ?? "", "gi") },
                        { itemId : search },
                    ], 
                },
                { _id: true, itemTitle: true, content: true}
            );        
            res.json(reviews);
        } catch(error) {
            console.error(`Couldnt find reviews for : ${search} in DB.`,error);
            res.status(500);
            res.send(`Couldnt find reviews for : ${search} in DB.`);
        } 
    }else{
        try{
            const reviews = await Review.find(
                {                   
                    userId: userId
                },
                { _id: true, itemId: true, itemTitle: true, score: true}
            );        
            res.json(reviews);
        } catch(error) {
            console.error(`Couldnt find reviews by : ${userId} in DB.`,error);
            res.status(500);
            res.send(`Couldnt find reviews by : ${userId} in DB.`);
        } 
    }   
});

router.get("/:id",authenticate, async (req, res) => {
    const { id } = req.params;    

    try{
        console.log(`getting Review id= ${id}`);        
        const raiting = await Review.findById(id);       
        if (!raiting) {
            console.log(`Review id : ${id} is not in DB.`);
            res.status(404);
            res.send(`Review id : ${id} is not in DB.`);            
            return;
        }       

        res.json(raiting);
    }catch (error) {
        console.error(`Couldnt look for Review id: ${id} in DB.`,error);

        res.status(500);
        res.send(`Couldnt look for Review id : ${id} in DB.`);
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
            await Review.findOneAndReplace(
                {_id: id},
                {...body, userId : req.signedCookies.userId},
                { upsert: true }
            );
    
            res.status(201);
            res.json(id);
        } catch (error) {        
            console.error(`Couldnt put Review id: ${id}.`,error);
            res.status(500);
            res.send(`Couldnt put Review id: ${id}.`);
        }
    }else{
        const newReview = new Review({
            itemId: body.itemId,
            itemTitle: body.itemTitle,
            userId: req.signedCookies.userId,
            content: body.content
        });
        console.log(newReview);
         try{
             await newReview.save();
             res.status(201);
             res.json(newReview._id);
         } catch (error) {        
             console.error(`Couldnt save new Review.`,error);
             res.status(500);
             res.send(`Couldnt save new Review.`);
         }
    }   
        
});

router.delete("/:id",authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);       
        if (!review) {
            console.log(`Review id : ${id} is not in DB.`);
            res.status(404);
            res.send(`Review id : ${id} is not in DB.`);            
            return;
        }
        if (review.userId != req.signedCookies.userId){
            console.log(`Access denied to review id : ${id}.`);
            res.status(401);
            res.send(`Access denied to review id : ${id}.`);            
            return;
        }
        
        await Review.findOneAndDelete({ _id: id });     
        res.status(204);
        res.end();  
    } catch {
        console.log(`Couldnt delete Review id: ${id}.`);
        res.status(500);
        res.send(`Couldnt delete Review id: ${id}.`);
        return;
    }

    res.status(204);
    res.end();
});

