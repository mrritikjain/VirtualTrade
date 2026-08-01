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
    const user = await User.fineOne({email});
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
        })
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.cookies("token", token,{
            httpOnly : true,
            maxAge : 60*60*24,
            secure : process.env.NODE_ENV == "production",
            sameSite : "strict",
        })
        return res.status(200).json({message: "User registered successfully"});
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
    if(!email || !passowrd){
        return res.status(400).json({message: "All fileds are required"});
    }    
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User not found"});
    } 
    isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.cookie("token", token,{
        httpOnly : true,
        maxAge : 60*60*24,
        secure : process.env.NODE_ENV == "production",
        sameSite : "strict",
    })
    return res.status(200).json({message: "User logged in successfully"});
 } catch (error) {
    res.status(500).json({
        message : "Something went wrong",
        error : error.message,
    })
 }
}

module.exports.logout = async function (req, res){
    res.cookie("token", "", {
        httpOnly : true,
        maxAge : 0,
        secure : process.env.NODE_ENV == "production",
        sameSite : "strict",
    })
    return res.status(200).json({message: "User logged out successfully"});
}