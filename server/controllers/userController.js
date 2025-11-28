// import userModel from "../models/userModel.js";

// export const register=async (req,res)=>{
//     try{
//         const {name,email,password}=req.body;
//         const user=new userModel({name,email,password});
    
//         await user.save();
//         return res.json({success:true});
//     }catch(error){
//         return res.json({success:false,message:error.message});
//     }
// }