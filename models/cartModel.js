const mongoose = require('mongoose')

const { ObjectId } = require('mongodb');
const cartSchema = new mongoose.Schema({
    userName:{
        type:String,
        ref:"user",
        required:true
    },
    user:{
        type:String,
        required:true
    },
    products:[{
        productId:{
            type:String,
            ref:"product",
            required:true
        },
        count:{
            type:Number,
            default:1
        },
        productPrice:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            default:0
        }
    }]


})

module.exports=mongoose.model('cart',cartSchema)