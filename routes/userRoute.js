const express = require("express")
const crypto = require('crypto');

const user_route = express()
user_route.use(express.static('public/user'))


const session = require("express-session");
const config = require("../config/config");
const auth = require('../middileware/auth');
user_route.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false }));

user_route.use(express.urlencoded({ extended: true }));
user_route.use(express.json());

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController');
const addressController = require('../controllers/addressController');
const orderController = require('../controllers/orderController');
const wishlistController = require('../controllers/wishlistController');
const couponController = require('../controllers/couponController');
const catogoryController = require('../controllers/catogoryController');

user_route.get('/register', userController.loadRegister);
user_route.post('/register', userController.insertUser);
user_route.get('/verify', userController.verifyMail);
user_route.post('/verify', userController.checkotp);
user_route.get('/', auth.isLogout, userController.loginLoad);
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);
user_route.get('/logout', auth.isLogin, userController.userLogout);
user_route.get('/home', auth.isLogin, userController.loadHome);
user_route.get('/shop', auth.isLogin, userController.loadshop);
user_route.get('/myaccount', auth.isLogin, userController.loadMyaccount);
user_route.get('/editprofile', auth.isLogin, userController.loadeditprofile);
user_route.post('/editprofile', userController.submiteditprofile);
user_route.get('/detailview', auth.isLogin, userController.loaddetailview);
user_route.get('/cart', auth.isLogin, cartController.loadCart);
user_route.post('/addtocart', cartController.addtocart);
user_route.post('/changeProductQuantity', cartController.changeProductCount);
user_route.get('/checkout', auth.isLogin, cartController.loadCheckout);
user_route.get('/addadress', auth.isLogin, addressController.addAddress);
user_route.post('/addadress', addressController.insertAddress);
user_route.post('/checkout', orderController.placeOrder);
user_route.post('/verifyPayment', orderController.verifypayment);
user_route.get('/orderSuccess', auth.isLogin, orderController.ordersuccess);
user_route.get('/keepshopping', auth.isLogin, orderController.keepshopping);
user_route.get('/trackorder', auth.isLogin, orderController.loadorderhistory);
user_route.get('/viewoproducts', auth.isLogin, orderController.loaddetailsofproducts);
user_route.post('/wishlist', wishlistController.addToWishlist);
user_route.get('/loadWishlist', auth.isLogin, wishlistController.loadWishlist);
user_route.get('/removeWishlist', auth.isLogin, wishlistController.removeWishlist);
user_route.post('/wishtocart', wishlistController.wishtocart);
user_route.get('/addprofileaddress', auth.isLogin, addressController.loadaddprofileaddress);
user_route.get('/editprofileaddress', auth.isLogin, addressController.loadeditprofileaddress);
user_route.get('/editcheckoutaddress2', auth.isLogin, addressController.loadeditcheckoutaddress);
user_route.get('/removeprofileaddress', auth.isLogin, addressController.loadremoveprofileaddress);
user_route.get('/removecheckoutaddress', auth.isLogin, addressController.loaddeleatecheckoutadress);
user_route.post('/addprofileaddress', addressController.addprofileaddress);
user_route.post('/editprofileaddress', addressController.editprofileaddress);
user_route.post('/editcheckoutaddress2',addressController.editcheckoutaddress)
user_route.post('/applyCoupon', couponController.postcoupon);
user_route.get('/dcatogory', auth.isLogin, catogoryController.applyfilter);

module.exports = user_route