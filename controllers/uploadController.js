const multer = require("multer");
import  fs  from 'fs';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import { parse } from "csv-parse";
import { Upload } from '../models';

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/'),
    filename:(req , file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({storage}).single('file');

const uploadController = {
    async store(req,res,next){
        //Multipart form data
        handleMultipartData(req, res, (err) =>{
            if(err){
                return next(CustomErrorHandler.serverError("Please upload valid file"));
            }
            
            const file = req.file;
            console.log(file)
            if(file.mimetype != 'text/csv')
            {
                console.log(file.path);
                fs.unlinkSync(file.path);
                return next(CustomErrorHandler.serverError("Please upload valid file"));
            }
        
        console.log(file);
console.log(req.body);

     try{

         fs.createReadStream(file.path)
         .pipe(parse({ delimiter: ",", from_line: 2 }))
         .on('data', async(data) => {
           const filedata = new Upload({
             name: data[0],
             phone: data[1],
             email: data[2],
             linkedln_profile_url: data[3]
           })
           console.log(filedata);
           await filedata.save();
           //console.log("hi")
         }).on('end',()=>{
            fs.unlinkSync(file.path);
            res.status(201).json({upload: true});
         }).on('error',(e)=>{
            fs.unlinkSync(file.path);
            res.status(400).json({upload: false});
         })
         
         
         //console.log(req.files);
     }catch(e){
        return next(CustomErrorHandler.serverError());
     }
      
        });        
    }
    
}

export default uploadController;