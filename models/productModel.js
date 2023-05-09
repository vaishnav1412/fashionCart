const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    catogory:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    blocked:{
        type:Boolean,
        default:false
    },
    price:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        required:true
    },
    is_product:{
        type:Number,
        default:0
    },
    offer:{
        type:Number,
        default:0
    },
    offerprice:{
        type:Number,
        default:0
    }


})

module.exports =mongoose.model('product',productSchema)