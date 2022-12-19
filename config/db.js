import mongoose from "mongoose";
import { MONGO_URL } from '.';
const connectDB = async() =>{
    const conn = await mongoose.connect(MONGO_URL,{
        useNewUrlParser: true
    });
    console.log("SUCCESSFUL CONNECTED TO DATABASE");
}
export default connectDB;