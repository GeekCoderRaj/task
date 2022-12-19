import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { RefreshToken, User } from '../../models';
import JwtService from '../../services/JwtService';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';
const registerController = {
    async register(req,res,next){
        //console.log("HI");
        const registerSchema = Joi.object({
           name: Joi.string().min(3).max(30).required(),
           email: Joi.string().email().required(),
           password: Joi.string().required(),
        });

        const {error} = registerSchema.validate(req.body);

        if(error){
          return next(error);  
        }
        // check if user is in the database already
        try{
          const exist = await User.exists({email: req.body.email});// return true or false
          if(exist){
              return next(CustomErrorHandler.alreadyExist('This email is alreay exist'));
          }
        }catch(err){
              return next(err);    
        }


        //Hash Password
        const hashPassword = await bcrypt.hash(req.body.password,10);

        // prepare the model
        const {name,email,password} = req.body;
        const user = new User({
            name,
            email,
            password: hashPassword
        })
        let access_token;
        let refresh_token;
        try{
            const result = await user.save();

            //Token
            access_token = JwtService.sign({_id: result._id });
            
            refresh_token = JwtService.sign({_id: result._id},'1y',REFRESH_SECRET);
            
 
            //database whitelist
            const refreshtoken = new RefreshToken({
                refresh_token
            })
            await refreshtoken.save();

        }catch(err){
            
            return next(err);
        }



        res.json({status:201,access_token, refresh_token});
    }
}

export default registerController;