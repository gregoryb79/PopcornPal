import express from "express";
import { Review } from "../models/review.model";
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();


router.get("/", authenticate, async (req, res) => {
    const {search} = req.query;
    const searchStr = search?.toString() ?? "";   
    const userId = req.signedCookies.userId;
    const isValidId = mongoose.Types.ObjectId.isValid(searchStr);
    
    const conditions = [];
    if (searchStr) {
        conditions.push({ itemTitle: new RegExp(search?.toString() ?? "", "gi") });
        if (isValidId) {
          conditions.push({ itemId: new mongoose.Types.ObjectId(searchStr) });
        }
      }

    if (search){
        try{
            const reviews = await Review.find(
                conditions.length ? { $or: conditions } : {},
                { _id: true, itemTitle: true, content: true, updatedAt: true, itemId: true}              
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
                { _id: true, itemTitle: true, content: true, updatedAt: true, itemId: true}
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
        const review = await Review.findById(id);       
        if (!review) {
            console.log(`Review id : ${id} is not in DB.`);
            res.status(404);
            res.send(`Review id : ${id} is not in DB.`);            
            return;
        }       

        res.json(review);
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
        const newReview = new Review( {...body, userId : req.signedCookies.userId});
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

