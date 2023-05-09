const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discountType:{
        type:String,
        required:true
    },
    discountAmount:{
        type:Number
    },
    maxCartAmount:{
        type:Number
    },
    maxDiscountAmount:{
        type:Number
    },
    user:{
        type:Array,
        ref:"user",
        default:[]
    },
    maxUsers:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    is_blocked:{
        type:Number,
        default:0
    }
})

const couponModel = mongoose.model("coupon",couponSchema);
module.exports = couponModel;