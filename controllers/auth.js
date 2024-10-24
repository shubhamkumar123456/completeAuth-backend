const User = require('../models/User');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const bcrypt = require('bcryptjs')


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = async(req,res)=>{
    const {name,email,password} = req.body
    if(!name){
        return res.json({msg:"name is required",success:false})
    }
    if(!email){
        return res.json({msg:"email is required",success:false})
    }
   
    try {
        const existingUser = await User.findOne({email})
        console.log(existingUser)
    if(!existingUser){
        let user = await User.create({
            name,
            email,
            password
        })
        return res.json({msg:"user created successfully",success:true})
    }
    else{
        return res.json({msg:"user already exists",success:false})
    }
    } catch (error) {
        return res.json({msg:"error in creating user",success:false,error})
    }
}

const loginUSer = async(req,res)=>{
        let  {email,password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            const passwordChek = await bcrypt.compareSync(password,existingUser.password)
            if(passwordChek){
              const payload = { user: { _id: existingUser._id,name:existingUser.name } };
             let token =  jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: 3600 });
                return res.json({msg:"user login successfully",success:true,token})
            }
            else{
                return res.json({msg:"wrong password",success:false})
            }
        }else{
            return res.json({msg:"user not exists",success:false})
        }
}


const googleLogin = async(req,res)=>{
    const {token} = req.body;
    console.log("token = ",token)
    try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        console.log("ticket = ",ticket)
    
        const { name, email, picture, sub } = ticket.getPayload();
        console.log({name,email,picture,sub})
    
        let user = await User.findOne({ email });
        if (user) {
          if (!user.googleId) {
            user.googleId = sub;
            user.avatar = picture;
            await user.save();
          }
        } else {
          user = new User({ name, email, googleId: sub, avatar: picture });
          await user.save();
        }
    
        const payload = { user: { _id: user._id,name:user.name } };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({msg:"user logged in successfull",success:true, token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).json({msg:"server error",error:err.message});
      }
}


module.exports = {
    googleLogin,
    createUser,
    loginUSer
}