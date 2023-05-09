const User = require('../models/userModel')
const Product = require("../models/productModel")
const Banner = require('../models/bannerModels')
const Catogory = require('../models/catogoryModel')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const { name } = require('ejs')
const Address = require('../models/addressModel1')
const crypto = require('crypto');

let dotenv = require('dotenv')
dotenv.config()

let otp2

let varemail
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const sendVerifymail = async (name, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }

        })
        const mailOptions = {
            from: process.env.user,
            to: email,
            subject: 'For Verification mail',
            html: '<p>hi' + name + ',please click here to<a href="http://localhost:5000/verify">varify</a> and enter the' + otp + ' for your verification ' + email + '</p>',
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent :-", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
const loadRegister = async (req, res) => {
    try {
        id = req.query.ref
        res.render('registration')
    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async (req, res) => {
    try {
        let ref = req.query.ref

        const email = req.body.email
        const alredy = await User.findOne({ email: email })
        varemail = email
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            age: req.body.age,
            mobile: req.body.mobile,
            email: req.body.email,
            password: spassword,
            is_admin: 0,
            referer: ref

        })
        const userData = await user.save()
        if (userData) {


            const refferer = await User.findOne({ referer: ref })
            const rauser = await User.findOne({ hashid: ref })

            if (refferer || rauser) {

                const reffererData = await User.findOneAndUpdate({ referer: ref }, { $inc: { wallet: 20 } })
                const rauserData = await User.findOneAndUpdate({ hashid: ref }, { $inc: { wallet: 20 } })
                const removeData = await User.findOneAndUpdate({ referer: ref }, { $set: { referer: 0 } })


                const otpgenerator = Math.floor(1000 + Math.random() * 9999)
                otp2 = otpgenerator
                sendVerifymail(req.body.name, req.body.email, otpgenerator)
                res.redirect("/verify")
            } else {
                const otpgenerator = Math.floor(1000 + Math.random() * 9999)
                otp2 = otpgenerator
                sendVerifymail(req.body.name, req.body.email, otpgenerator)
                res.redirect("/verify")
            }



        }
        else {
            res.render('registration', { message: "your registration failed" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const verifyMail = async (req, res) => {
    try {


        res.render("verify")

    } catch (error) {
        console.log(error.message);
    }
}
const checkotp = async (req, res) => {

    try {
        if (otp2 == req.body.otp) {
            const updateInfo = await User.findOneAndUpdate({ email: varemail }, { $set: { is_varified: 1 } })
            res.render("login")
        }
        else {
            res.render("registration")
        }

    } catch (error) {
        console.log(error);

    }

}

const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
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
                if (userData.is_varified === 0) {
                    res.render('login', { message: 'Plese veryfy your mail' })
                }
                else {

                    if (userData.is_blocked === true) {
                        res.render('login', { message: 'your account blocked' })
                    }
                    else {
                        req.session.user_id = userData._id
                        res.redirect('/home')
                    }

                }
            }
            else {
                res.render('login', { message: 'Email and Password is incorrect' })
            }

        }
        else {
            res.render('login', { message: 'Email and Password is incorrect.' })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadHome = async (req, res) => {
    try {



        const userId = req.session.user_id;
        const secret = 'your-secret-key';
        const hash = crypto.createHmac('sha256', secret)
            .update(userId)
            .digest('hex');
        const referralLink = `localhost:5000/register?ref=${hash}`;
        id = req.session.user_id

        const hashid = crypto.createHmac('sha256', secret)
            .update(userId)
            .digest('hex');

        const refer = await User.findOneAndUpdate({ _id: id }, { $set: { referallink: referralLink, hashid: hashid } })
        const bannerData = await Banner.find({})
        res.render('home', { bannerData })
    } catch (error) {
        console.log(error.message);
    }
}
const loadshop = async (req, res) => {
    try {
        const productData = await Product.find({ blocked: false })
        const catogoryData = await Catogory.find({ blocked: false })


        res.render('shop', { productData, catogoryData })


    } catch (error) {
        console.log(error.message);
    }
}
const userLogout = async (req, res) => {
    try {
        req.session.user_id = false;
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}
const loadMyaccount = async (req, res) => {
    try {

        const userData = await User.find({ _id: req.session.user_id })
        const addressData = await Address.findOne({ userId: req.session.user_id });
        if (req.session.user_id) {
            if (addressData) {
                if (addressData.addresses.length > 0) {
                    const address = addressData.addresses;

                    res.render('userprofile', { userData, address })
                }
                else {
                    res.render('userprofile2', { userData })
                }
            } else {
                res.render('userprofile2', { userData })
            }
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadeditprofile = async (req, res) => {
    try {
        const userData = await User.find({ _id: req.session.user_id })
        res.render('editprofile', ({ userData }))
    } catch (error) {
        console.log(error.message);
    }
}
const submiteditprofile = async (req, res) => {
    try {
        const profileData = await User.findByIdAndUpdate({ _id: req.session.user_id }, { $set: { name: req.body.name, age: req.body.age, mobile: req.body.mobile, email: req.body.email } })
        if (profileData) {
            res.redirect('/myaccount')
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loaddetailview = async (req, res) => {
    try {
        const userData = await User.find({ _id: req.session.user_id })

        const id = req.query.id
        const productData = await Product.findOne({ _id: id })
        res.render('detailview', { productData, userData })

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    checkotp,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    loadMyaccount,
    loadeditprofile,
    submiteditprofile,
    loaddetailview,
    loadshop

}