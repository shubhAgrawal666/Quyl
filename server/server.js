import express from "express";
import connectDB from "./config/mongodb.js";
import {register} from "./controllers/authController.js"
import "dotenv/config";
const app=express();
connectDB();
const PORT=process.env.PORT||4000;

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Quyl");
})
app.post('/user',register);

app.listen(PORT,()=>{
    console.log(`${PORT}`);
});