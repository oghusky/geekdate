const mongoose = require('mongoose');

exports.connectDB=async()=>{
    const conn = mongoose.connect("mongodb://localhost:27017/geekdate"||process.env.MONGO_URI,{
        useCreateIndex:true,
        useFindAndModify:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    if(conn) console.log("Connected to DB")
    else console.log("Not connected to DB");
}