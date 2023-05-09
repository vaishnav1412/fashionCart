const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    refferallink:{
        type:String,
        required:true
    }
})

const couponModel = mongoose.model("referal",referalSchema);
module.exports = couponModel;