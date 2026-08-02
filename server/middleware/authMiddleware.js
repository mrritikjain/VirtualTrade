const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports.authMiddleware = async function(req, res, next){
    try{
        const token = req.cookies.token;
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
