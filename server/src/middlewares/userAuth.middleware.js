import { User } from '../models/user.model.js';
import Errorhandler from '../utils/errorHandler.util.js'
import jwt from 'jsonwebtoken'
export const userAuthMiddleware = async (req, res, next)=>{
    const {accessToken, refreshToken} = req.cookei;
    if(!accessToken && !refreshToken)return next(new Errorhandler(401, "Unauthorized"));
    if(accessToken){
        // Validate the access Token
        try {
           const decodeToken =  jwt.verify(accessToken, ACCESS_TOKEN_SECRETE);
           const userFound = await User.find({id: decodeToken.id});
           console.log(userFound);
           if(userFound)next();
        } catch (error) {
            // Validate the refersh token
        }
        // Refresh token validations
        
    }
}