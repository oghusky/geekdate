require('dotenv').config();
const express = require('express'),
app = express(),
{connectDB} = require('./config/connectDB'),
PORT = process.env.PORT||3001;

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',require('./routes/user-routes'))

app.listen(PORT,()=>{
    console.log("http://localhost:"+3001);
});