const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({

    caption: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('banner', bannerSchema)