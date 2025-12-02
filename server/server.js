import express from "express";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
const app=express();
connectDB();
const PORT=process.env.PORT||4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

app.get("/",(req,res)=>{
    res.send("Quyl");
})
app.listen(PORT,()=>{
    console.log(`${PORT}`);
});