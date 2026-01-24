
export const sentTokenToClient = (cookieName, token, res)=>{
    res.cookie(cookieName, token, {
        httpOnly: true, // Prevent From accessing cookei in JS
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict" // Prevent CSRF
    })
}