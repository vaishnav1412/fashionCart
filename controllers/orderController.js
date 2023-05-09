const Order = require('../models/orderModel')
const Address = require('../models/addressModel1')
const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Razorpay = require('razorpay')
const exceljs = require('exceljs')

// const ejs = require('ejs')
// const pdf = require('html-pdf')
// const fs = require('fs')

const path = require('path');
const { log, Console } = require('console')

var instance = new Razorpay({
    key_id: 'rzp_test_KgphPCgit7FD2N',
    key_secret: process.env.razo
});

const placeOrder = async (req, res) => {
    try {
        const userName = await User.findOne({ _id: req.session.user_id });
        const address = req.body.address;

        const paymentMethod = req.body.payment;

        const cartData = await Cart.findOne({ userName: req.session.user_id });
        const products = cartData.products;

        const total = await Cart.aggregate([{ $match: { user: userName.name } }, { $unwind: "$products" }, { $project: { productPrice: "$products.productPrice", count: "$products.count" } }, { $group: { _id: null, total: { $sum: { $multiply: ["$productPrice", "$count"] } } } }]);

        const Total = total[0].total

        const status = paymentMethod === "COD" ? "placed" : "pending";

        const order = new Order({
            deliveryAddress: address,
            userId: req.session.user_id,
            userName: userName.name,
            paymentMethod: paymentMethod,
            products: products,

            totalAmount: Total,


            date: new Date(),
            status: status,

        })


        const orderData = await order.save();

        const date = orderData.date.toISOString().substring(5, 7);
        const orderId = orderData._id;
        if (orderData) {
            for (let i = 0; i < products.length; i++) {
                const pro = products[i].productId;
                const count = products[i].count;
                await Product.findByIdAndUpdate({ _id: pro }, { $inc: { stockQuantity: -count } });
            }
            if (order.status == "placed") {

                await Order.updateOne({ _id: orderId }, { $set: { month: date } })

                await Cart.deleteOne({ userName: req.session.user_id });
                res.json({ codSuccess: true });

            } else {


                const orderId = orderData._id;
                await Order.updateOne({ _id: orderId }, { $set: { month: date } })
                const totalAmount = orderData.totalAmount;
                var options = {
                    amount: totalAmount * 100,
                    currency: "INR",
                    receipt: "" + orderId
                }

                instance.orders.create(options, function (err, order) {
                    console.log(order);
                    res.json({ order });
                })

            }
        } else {
            res.redirect('/checkout');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifypayment = async (req, res) => {

    try {

        const totalPrice = req.body.amount;


        const details = req.body
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', 'onuCaBOE66gpKMvhfMF2YkJP');
        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
        hmac = hmac.digest('hex');
        if (hmac == details.payment.razorpay_signature) {
            await Order.findByIdAndUpdate({ _id: details.order.receipt }, { $set: { status: "placed" } });

            await Order.findByIdAndUpdate({ _id: details.order.receipt }, { $set: { paymentId: details.payment.razorpay_payment_id } });
            await Cart.deleteOne({ userName: req.session.user_id });
            res.json({ success: true });
        } else {
            await Order.findByIdAndRemove({ _id: details.order.receipt });
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error.message);
    }
}



const ordersuccess = async (req, res) => {
    try {

        res.render('order_succes')
    } catch (error) {
        console.log(error.message);
    }
}

const keepshopping = async (req, res) => {
    try {
        res.redirect('/home')
    } catch (error) {
        console.log(error.message);
    }
}
const displayordertableload = async (req, res) => {
    try {
        const orderData = await Order.find({});
        res.render('orderManagement', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}

const loadorderhistory = async (req, res) => {
    try {
        const id = req.session.user_id
        const productData = await Order.find({ userId: req.session.user_id }).populate("products.productId");

        res.render('orderhistory', { productData })
    } catch (error) {
        console.log(error.message);
    }
}

const loaddetailsofproducts = async (req, res) => {
    try {
        const id = req.query.id

        const productDetails = await Order.findOne({ _id: id }).populate("products.productId")
        const productData = productDetails.products


        res.render('orderhistorydetailview', { productData })
    } catch (error) {
        console.log(error.message);
    }
}
const loadsalesreport = async (req, res) => {
    try {
        let from = new Date(req.query.from)
        let to = new Date(req.query.to)

        req.query.from ? from = new Date(req.query.from) : from = 'ALL'
        req.query.to ? to = new Date(req.query.to) : to = 'ALL'
        if (from !== "ALL" && to !== "ALL") {

            const orderdetails = await Order.aggregate([
                {
                    $match: {
                        $and: [{ date: { $gte: from } }, { date: { $lte: to } }]

                    }
                }
            ])
            req.session.Orderdtls = orderdetails
            const products = orderdetails.products

            res.render('salesReport', { orderdetails, from, to })
        } else {
            const orderdetails = await Order.find({ status: { $ne: "cancelled" } })
            req.session.Orderdtls = orderdetails
            res.render('salesReport', { orderdetails, from, to })
        }

    } catch (error) {
        console.log(error.message);
    }
}

// const loadreportpdf = async (req, res) => {
//     try {
//         const from = req.query.from
//         const to = req.query.to

//         const orderdetails = await Order.find({ status: { $ne: "cancelled" } }).populate("products.productId").sort({ Date: -1 })
//         const products = orderdetails.product

//         const data = {
//             report: req.session.Orderdtls

//         }
//         const filepath = path.resolve(__dirname, '../views/admin/salesreportpdf.ejs')
//         const htmlstring = fs.readFileSync(filepath).toString()

//         let option = {
//             format: "A3"
//         }
//         const ejsData = ejs.render(htmlstring, data)
//         pdf.create(ejsData, option).toFile('salesReport.pdf', (err, response) => {
//             if (err) console.log(err);

//             const filepath = path.resolve(__dirname, '../salesReport.pdf')
//             fs.readFile(filepath, (err, file) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send('could not download file')
//                 }
//                 res.setHeader('Content-Type', 'application/pdf')
//                 res.setHeader('Content-Disposition', 'attatchment;filename="Sales Report.pdf"')

//                 res.send(file)

//             })
//         })
//     } catch (error) {

//         console.log(error.message);

//     }
// }
const loadreportexel = async(req,res)=>{
    try {
        const workbook = new exceljs.Workbook()
        const worksheet = workbook.addWorksheet("Orders");
        worksheet.columns = [
            { header:"S no.",key:"s_no" },
            { header:"User",key:"userName" },
            { header:"Payment Method",key:"paymentMethod" },
            { header:"Products",key:"products" },
            { header:"Total Amount",key:"totalAmount" },
            { header:"Date",key:"date" },
            { header:"Status",key:"status" }
        ]
        let counter = 1;
        const orderData = await Order.find({});
        orderData.forEach((order)=>{
            order.s_no = counter;
            worksheet.addRow(order);
            counter++;
        })

        worksheet.getRow(1).eachCell((cell)=>{
            cell.font = { bold:true };
        })

        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition",`attachment;filename=order.xlsx`)

        return workbook.xlsx.write(res).then(()=>{
            res.status(200);
        })
        
    } catch (error) {
        console.log(error.message);
    }
}
const loaddeliverd = async(req,res)=>{
    try {
        const id= req.query.id
        const orderData = await Order.findById({_id:id})
        if(orderData){
           const deliverd = await Order.updateOne({_id:id},{$set:{status:'deliverd'}})
           res.redirect('/admin/orders')
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    placeOrder,
    ordersuccess,
    keepshopping,
    displayordertableload,
    verifypayment,
    loadorderhistory,
    loaddetailsofproducts,
    loadsalesreport,
    // loadreportpdf,
    loaddeliverd,
    loadreportexel

}