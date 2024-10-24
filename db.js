const mongoose = require('mongoose');

const connectToDb = async()=>{
    await mongoose.connect('mongodb://localhost:27017/exam_platformPractice')
    .then(()=>console.log('Connected to DB successfully'))
    .catch((err)=>console.log('error connecting to DB',err))
}

module.exports = connectToDb