import mongoose from "mongoose";
//console.log(mongoose);
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    linkedln_profile_url:{
        type: String,
    },
},{timestamps : true});    

export default mongoose.model('Upload',uploadSchema,'uploads');