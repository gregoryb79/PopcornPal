import express from "express";
import { Item } from "../models/item.model";
import mongoose from "mongoose";

export const router = express.Router();

router.get("/", async (req, res) => {
  const { search } = req.query;  

  try{
      const items = await Item.find(
          {
              $or: [
                  { title: new RegExp(search?.toString() ?? "", "gi") },
                  { director: new RegExp(search?.toString() ?? "", "gi") },
                  { description: new RegExp(search?.toString() ?? "", "gi") },
                  { genres: new RegExp(search?.toString() ?? "", "gi") },
                  { cast: new RegExp(search?.toString() ?? "", "gi") },
              ],              
          },
          { _id: true, title: true, releaseDate: true, posterUrl : true }
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
      const item = await Item.findById(id);       
      if (!item) {
          console.log(`note id : ${id} is not in DB.`);
          res.status(404);
          res.send(`note id : ${id} is not in DB.`);            
          return;
      }     

      res.json(item);
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
          await Item.findOneAndReplace(
              {_id: id},
              {...body},
              { upsert: true }
          );
  
          res.status(201);
          res.json(id);
      } catch (error) {        
          console.error(`Couldnt put Item id: ${id}.`,error);
          res.status(500);
          res.send(`Couldnt put Item id: ${id}.`);
      }
  }else{
      const newItem = new Item({...body});
      console.log(newItem);
       try{
           await newItem.save();
           res.status(201);
           res.json(newItem._id);
       } catch (error) {        
           console.error(`Couldnt save new Item.`,error);
           res.status(500);
           res.send(`Couldnt save new Item.`);
       }
  }   
      
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const item = await Item.findById(id);       
      if (!item) {
          console.log(`item id : ${id} is not in DB.`);
          res.status(404);
          res.send(`item id : ${id} is not in DB.`);            
          return;
      }      
      await Item.findOneAndDelete({ _id: id });     
      res.status(204);
      res.end();  
  } catch {
      console.log(`Couldnt delete Item id: ${id}.`);
      res.status(500);
      res.send(`Couldnt delete Item id: ${id}.`);
      return;
  }

  res.status(204);
  res.end();
});