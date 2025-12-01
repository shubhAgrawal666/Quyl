import express from "express";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";

import "dotenv/config";
const app=express();
connectDB();
const PORT=process.env.PORT||4000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
    res.send("Quyl");
})
app.listen(PORT,()=>{
    console.log(`${PORT}`);
});