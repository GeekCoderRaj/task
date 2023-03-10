import Joi from 'joi';
import { User , RefreshToken} from '../../models';
import { REFRESH_SECRET } from '../../config';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
const loginController = {
    async login(req,res,next){
        //console.log("LOGIN KE ANDER");
        // Validaton
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const {error} = loginSchema.validate(req.body);
        if(error){
            return next(error);
        }
        try{
           const user = await User.findOne({email: req.body.email});
        //    console.log(user);
           if(!user){
               return next(CustomErrorHandler.wrongCredentials());
           }
           //compare password
           const match = await bcrypt.compare(req.body.password,user.password);
           if(!match){
            return next(CustomErrorHandler.wrongCredentials());
           }

           //Token
           const access_token = JwtService.sign({_id: user._id});
           const refresh_token = JwtService.sign({_id: user._id},'1y',REFRESH_SECRET);
            // console.log(refresh_token);
 
            //database whitelist
            const refreshtoken = new RefreshToken({
                refresh_token
            })
            await refreshtoken.save();
           res.json({access_token, refresh_token});
               

        }catch(err){

        }
    }
}
export default loginController;