const Banner = require('../models/bannerModels');
const { deleteOne } = require('../models/catogoryModel');

const loadbanner = async (req, res) => {
    try {
        const bannerData = await Banner.find({})
        res.render('banner', { bannerData })
    } catch (error) {
        console.log(error.message);
    }
}
const loadaddbanner = async (req, res) => {
    try {
        res.render('addbanner')
    } catch (error) {
        console.log(error.message);
    }
}
const postbanner = async (req, res) => {
    try {

        const img = []

        for (i = 0; i < req.files.length; i++) {
            img[i] = req.files[i].filename
        }
        const banner = new Banner({
            caption: req.body.caption,
            type: req.body.type,
            image: img

        })

        const bannerData = await banner.save()
        if (bannerData) {
            res.redirect('/admin/banner')
        } else {
            res.redirect('/admin/addbanner')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadremovebanner = async (req, res) => {
    try {
        id = req.query.id
        const bannerData = await Banner.deleteOne({ _id: id })
        if (bannerData) {
            res.redirect('/admin/banner')
        }
    } catch (error) {

    }
}

module.exports = {
    loadremovebanner,
    loadaddbanner,
    postbanner,
    loadbanner


}