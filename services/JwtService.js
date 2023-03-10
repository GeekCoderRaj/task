import {SECRET} from '../config';
import jwt from 'jsonwebtoken';
class JwtService {
    static sign(payload, expiry= '600s', secret = SECRET){
       return jwt.sign(payload, secret, {expiresIn: expiry})  
    }
    static verify(token, secret = REFRESH_SECRET){
        return jwt.verify(token, secret);  
     }
}
export default JwtService;