import mongoose from "mongoose";
//console.log(mongoose);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{timestamps : true});    

export default mongoose.model('User',userSchema,'users');