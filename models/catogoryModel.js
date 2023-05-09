const mongoose = require('mongoose')
const catogorySchema = new mongoose.Schema({
    
    catogory:{
        type:String,
        required:true
    },
   
    blocked:{
        type:Boolean,
        default:false
    },
    is_catogory:{
        type:Number,
        default:0
    },
    offer:{
        type:Number,
        default:0
    }
    
})
module.exports =mongoose.model('catogory',catogorySchema)
