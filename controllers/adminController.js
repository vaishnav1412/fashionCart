const User = require("../models/userModel")
const Product = require("../models/productModel")
const Catogory = require('../models/catogoryModel')
const Order = require('../models/orderModel')

const bcrypt = require("bcrypt")
const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: "your email and password are incorrect" })
                }
                else {

                    req.session.admin_id = userData._id;
                    res.redirect('/admin/home')
                }
            }
            else {
                res.render('login', { message: "your email and password are incorrect" })
            }
        }
        else {
            res.render('login', { message: "your email and password are incorrect" })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {

    try {
        const orderData = await Order.find({ status: { $ne: "cancelled" } })

        let SubTotal = 0
        orderData.forEach(function (value) {
            SubTotal = SubTotal + value.totalAmount;

        })

        const cod = await Order.find({ paymentMethod: "COD" }).count()
        const online = await Order.find({ paymentMethod: "ONLINE" }).count()
        const totalOrder = await Order.find({ status: { $ne: "cancelled" } }).count()
        const totalUser = await User.find().count()
        const totalProducts = await Product.find().count()

        const date = new Date()
        const year = date.getFullYear()
        const currentYear = new Date(year, 0, 1)

        const salesByYear = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: currentYear }, status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])


        let sales = []
        for (i = 1; i < 13; i++) {
            let result = true
            for (j = 0; j < salesByYear.length; j++) {
                result = false
                if (salesByYear[j]._id == i) {
                    sales.push(salesByYear[j])
                    break;
                } else {
                    result = true

                }
            }
            if (result) {
                sales.push({ _id: i, total: 0, count: 0 })
            }

        }
        let yearChart = []
        for (i = 0; i < sales.length; i++) {
            yearChart.push(sales[i].total)
        }

        res.render('home', { data: orderData, total: SubTotal, cod, online, totalOrder, totalUser, totalProducts, yearChart })

    } catch (error) {
        console.log(error.messaage)
    }
}

const logout = async (req, res) => {
    try {
        req.session.admin_id = false
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

const getTable = async (req, res) => {
    try {
        const userData = await User.find({ is_admin: 0 })

        res.render('table', { users: userData })
    } catch (error) {
        console.log(error.message);
    }
}
const blockUser = async (req, res) => {
    try {
        const block = req.query.id
        const blockuser = await User.findByIdAndUpdate({ _id: block }, { $set: { is_blocked: true } })
        if (blockuser) {
            req.session.user_id = false
        }

        res.redirect('/admin/table')
    } catch (error) {
        console.log(error.message);
    }
}
const unblockUser = async (req, res) => {
    try {
        const unblock = req.query.id
        const unblockuser = await User.findByIdAndUpdate({ _id: unblock }, { $set: { is_blocked: false } })
        res.redirect('/admin/table')

    } catch (error) {
        console.log(error.message);
    }
}

//products page controlling
const getTable2 = async (req, res) => {
    try {
        const productData = await Product.find({ is_product: 0 })

        res.render('table2', { products: productData })
    } catch (error) {
        console.log(error.message);
    }
}
const getRegistration2 = async (req, res) => {
    try {

        const catogoryData = await Catogory.find({ blocked: 0 })
        res.render('registration2', { catogoryData })
    } catch (error) {
        console.log(error.message);
    }
}
//post details controlling
const insertProduct = async (req, res) => {
    try {
        const offerData = req.body.offer
        let productData
        if (offerData > 0) {
            const p = req.body.price
            const price = p - ((p * offerData) / 100)
            const img = []
            for (i = 0; i < req.files.length; i++) {
                img[i] = req.files[i].filename
            }
            const products = new Product({
                name: req.body.name,
                catogory: req.body.catogory,
                offer: req.body.offer,
                image: img,
                quantity: req.body.quantity,
                blocked: req.body.blocked,
                price: price,
                offerprice: req.body.price,
                description: req.body.description,
                is_product: req.body.is_product
            })
            productData = await products.save();
        }
        else {
            const img = []
            for (i = 0; i < req.files.length; i++) {
                img[i] = req.files[i].filename
            }
            const products = new Product({
                name: req.body.name,
                catogory: req.body.catogory,
                offer: req.body.offer,
                image: img,
                quantity: req.body.quantity,
                blocked: req.body.blocked,
                price: req.body.price,
                offerprice: req.body.price,
                description: req.body.description,
                is_product: req.body.is_product
            })
            productData = await products.save()

        }

        if (productData) {
            const catogoryData = await Catogory.find({ blocked: 0 })
            res.redirect('/admin/table2')
        }
        else {
            res.render("/admin/table2", { message: 'your registration is failed' })
        }
    } catch (error) {
        console.log(error.message)
    }
}
//edit product get methord
const editProduct = async (req, res) => {
    try {
        const catogoryData = await Catogory.find({ blocked: 0 })
        const id = req.query.id
        const productData = await Product.findById({ _id: id })
        if (productData) {
            res.render('editProduct', { product: productData, catogoryData })
        }
        else {
            res.redirect('/admin/home')
        }

    } catch (error) {
        console.log(error.message)
    }
}

const updateProducts = async (req, res) => {
    try {
        let offer = req.body.offer
        let price = req.body.price

        if (offer > 0) {
            const payment = price - ((price * offer) / 100)
            const productData = await Product.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, catogory: req.body.catogory, quantity: req.body.quantity, price: payment, description: req.body.description, blocked: req.body.blocked, offer: req.body.offer } })

            for (let i = 0; i < req.files.length; i++) {
                const imageUpdate = await Product.findByIdAndUpdate({ _id: req.body.id }, { $push: { image: req.files[i].filename } });
            }

            if (productData || imageUpdate) {
                res.redirect("/admin/table2")
            } else {
                res.render('editProduct', { messaage: 'product edit failed' })
            }
        } else {
            const productData = await Product.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, catogory: req.body.catogory, quantity: req.body.quantity, price: req.body.price, description: req.body.description, blocked: req.body.blocked, offer: req.body.offer } })
            for (let i = 0; i < req.files.length; i++) {
                const imageUpdate = await Product.findByIdAndUpdate({ _id: req.body.id }, { $push: { image: req.files[i].filename } });
            }

            if (productData || imageUpdate) {
                res.redirect("/admin/table2")
            } else {
                res.render('home', { message: 'product edit failed' })
            }
        }



    } catch (error) {
        console.log(error.message)
    }
}
const viewproductload = async (req, res) => {
    try {
        const id = req.query.id
        const orderData = await Order.findOne({ _id: id }).populate("products.productId");
        const productData = orderData.products;

        if (productData) {
            res.render('displayproduct', { productData })
        } else {
            res.redirect('/admin/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const deleatephoto = async (req, res) => {
    try {


        const position = req.body.position;
        const id = req.body.id;
        const productImage = await Product.findById(id);
        const image = productImage.image[position];
        const data = await Product.updateOne(
            { _id: id },
            { $pullAll: { image: [image] } }
        );
        if (data) {
            res.json({ success: true });
        } else {
            res.redirect("/admin/table2");
        }
    } catch (error) {

    }
}

module.exports = {
    loginLoad,
    verifyLogin,
    loadHome,
    logout,
    getTable,
    blockUser,
    unblockUser,
    getTable2,
    getRegistration2,
    insertProduct,
    editProduct,
    updateProducts,
    viewproductload,
    deleatephoto


}