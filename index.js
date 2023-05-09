const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO)
const express = require("express")
const app= express()

app.use((req, res, next) => {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
  })


//for user routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute )


//for user admin
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)



app.listen(5000,()=>{
    console.log("server running port no 5000");
})