const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    deliveryAddress:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentId:{
        type:String
    },
    products:[{
        productId:{
            type:String,
            ref:"product",
            required:true
        },
        count:{
            type:Number,
        },
        productPrice:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number
        }
    }],
    totalAmount:{
        type:Number,
        required:true
    },
    date:{
        type:Date
    },
    status:{
        type:String
    }
},
{timestamps:true}
)

const ordermodel = mongoose.model("order",orderSchema);
module.exports = ordermodel;