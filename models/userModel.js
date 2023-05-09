const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        default: 0
    },
    is_varified: {
        type: Number,
        default: 0
    },
    is_blocked: {
        type: Boolean,
        default:false
    },
    referallink:{
        type:String,
        default:0
    },
    hashid:{
        type:String,
        default:0
    },
    referer:{
        type:String,
        default:0
    }, wallet:{
        type:Number,
        default:0
    }

    
})
module.exports = mongoose.model('user',userSchema)