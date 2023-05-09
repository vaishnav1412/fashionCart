
const Catogory = require('../models/catogoryModel')
const Product = require('../models/productModel')

const getCatogory = async (req, res) => {
    try {
        const catogoryData = await Catogory.find({ is_catogory: 0 })
        res.render('catogory', { catogoryData })

    } catch (error) {
        console.log(error.message);
    }
}
const getaddCatogory = async (req, res) => {
    try {
        res.render("addCatogory")
    } catch (error) {
        console.log(error.message);
    }
}
const insertCatogory = async (req, res) => {
    try {
        const catogories = req.body.catogory
        const findcatogory = await Catogory.findOne({ catogory: catogories })
        if (findcatogory) {
            res.redirect('/admin/catogory')
        }
        else {
            const catogory = new Catogory({
                catogory: req.body.catogory,
                offer: req.body.offer


            })
            const catogoryData = await catogory.save()
            if (catogoryData) {

                res.redirect('/admin/catogory')
            }
            else {
                res.render('addCatogory')
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}
const blockCatogory = async (req, res) => {
    try {
        const block = req.query.id
        const blockCatogory = await Catogory.findByIdAndUpdate({ _id: block }, { $set: { blocked: true } })
        res.redirect("/admin/catogory")
    } catch (error) {
        console.log(error.message);
    }
}
const unblockCatogory = async (req, res) => {
    try {
        const unblock = req.query.id
        const blockCatogory = await Catogory.findByIdAndUpdate({ _id: unblock }, { $set: { blocked: false } })
        res.redirect("/admin/catogory")
    } catch (error) {
        console.log(error.message);
    }
}
const applyfilter = async (req, res) => {
    try {
        const id = req.query.id
        const totalproduct = await Product.find({ catogory: id })
        
        if (req.query.id == 'all') {
            const catogoryData = await Catogory.find()
            const productData = await Product.find()
            res.render('shop', { catogoryData, productData })

        } else {
            const catogoryData = await Catogory.find()
            const productData = await Product.find({ catogory: id })
            res.render('shop', { catogoryData, productData })
        }


    } catch (error) {

    }
}


module.exports = {
    getCatogory,
    getaddCatogory,
    insertCatogory,
    blockCatogory,
    unblockCatogory,
    applyfilter
}