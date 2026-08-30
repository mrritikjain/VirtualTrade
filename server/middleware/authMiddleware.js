const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports.authMiddleware = async function(req, res, next){
    try{
        let token;
        
        // 1. Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // 2. Fallback to cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id);
        next();
        
    }
    catch(error){
        return res.status(500).json({
            message : "Something went wrong",
            error : error.message,
        })
    }
}
