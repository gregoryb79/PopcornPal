import express from "express";
import { Episode } from "../models/episode.model";
import mongoose from "mongoose";

export const router = express.Router();

router.get("/", async (req, res) => {
  const { search } = req.query;  

  try{
      const items = await Episode.find(
          {
              $or: [
                  { title: new RegExp(search?.toString() ?? "", "gi") },
              ],              
          },
          { _id: true, title: true, createdAt: true }
      );        
      res.json(items);
  } catch(error) {
      console.error(`Couldnt do the query: ${search} in DB.`,error);
      res.status(500);
      res.send(`Couldnt do the query: ${search} in DB.`);
  }    
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;    

  try{
      console.log(`getting note id= ${id}`);        
      const episode = await Episode.findById(id);       
      if (!episode) {
          console.log(`note id : ${id} is not in DB.`);
          res.status(404);
          res.send(`note id : ${id} is not in DB.`);            
          return;
      }     

      res.json(episode);
  }catch (error) {
      console.error(`Couldnt look for note id: ${id} in DB.`,error);

      res.status(500);
      res.send(`Couldnt look for note id : ${id} in DB.`);
  }   
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  console.log(`is the id = ${id} valid id? => ${isValidId}`);
  console.log(body);

  if (isValidId) {
      try{
          await Episode.findOneAndReplace(
              {_id: id},
              {...body},
              { upsert: true }
          );
  
          res.status(201);
          res.json(id);
      } catch (error) {        
          console.error(`Couldnt put Episode id: ${id}.`,error);
          res.status(500);
          res.send(`Couldnt put Episode id: ${id}.`);
      }
  }else{
      const newItem = new Episode({
          title: body.title,
          body          
      });
      console.log(newItem);
       try{
           await newItem.save();
           res.status(201);
           res.json(newItem._id);
       } catch (error) {        
           console.error(`Couldnt save new Episode.`,error);
           res.status(500);
           res.send(`Couldnt save new Episode.`);
       }
  }   
      
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const episode = await Episode.findById(id);       
      if (!episode) {
          console.log(`episode id : ${id} is not in DB.`);
          res.status(404);
          res.send(`episode id : ${id} is not in DB.`);            
          return;
      }      
      await Episode.findOneAndDelete({ _id: id });     
      res.status(204);
      res.end();  
  } catch {
      console.log(`Couldnt delete Episode id: ${id}.`);
      res.status(500);
      res.send(`Couldnt delete Episode id: ${id}.`);
      return;
  }

  res.status(204);
  res.end();
});