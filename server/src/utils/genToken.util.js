import jwt from 'jsonwebtoken'
// Access token generator
export const generateAccessToken = (id)=>{
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
};

// Refresh token gernator
export const generateRefreshToken = (id)=>{
    return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}
