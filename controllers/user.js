
const { response } = require('express');
const User = require('../models/User');
var bcrypt = require('bcryptjs');


const getSingle = async(req,res)=>{
    let user = await User.findById(req.params._id);
    res.json({msg:"fetched successfully",success:true,user})
}

const getAllusers = async(req,res)=>{
    let users = await User.find({}).populate({path:'Exam'})
    res.status(200).json({msg:"users fetched successfully",success:true,users})
}

module.exports = {
 
    getSingle,
    getAllusers
}