const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.register = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("All the fields are required");
      return res.status(400).json({ message: "All the fields are required" });
    }
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({message: "User already exists"})
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            credits: 100000
        })
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token,{
            httpOnly : true,
            maxAge : 1000 * 60 * 60 * 24,
            secure : isProd,
            sameSite : isProd ? "none" : "lax",
        })
        return res.status(200).json({
            message: "User registered successfully",
            token: token
        });
    }
  } catch (error) {
    res.status(500).json({
        message : "Something went wrong",
        error : error.message,
    })
  }
};
    
module.exports.login = async function (req, res){
 try {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }    
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User not found"});
    } 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token,{
        httpOnly : true,
        maxAge : 1000 * 60 * 60 * 24,
        secure : isProd,
        sameSite : isProd ? "none" : "lax",
    })
    return res.status(200).json({
        message: "User logged in successfully",
        token: token
    });
 } catch (error) {
    res.status(500).json({
        message : "Something went wrong",
        error : error.message,
    })
 }
}

module.exports.logout = async function (req, res){
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
        httpOnly : true,
        maxAge : 0,
        secure : isProd,
        sameSite : isProd ? "none" : "lax",
    })
    return res.status(200).json({message: "User logged out successfully"});
}
module.exports.Profile = async function(req, res){
    return res.status(200).json({user: req.user});    
}