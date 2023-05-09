const Coupon = require('../models/couponModel')

const loadcoupon = async (req, res) => {
    try {
        const couponData = await Coupon.find({})
        res.render('coupon', { couponData })
    } catch (error) {
        console.log(error.message);
    }
}
const loadaddcoupon = async (req, res) => {
    try {
        res.render('addcoupon')
    } catch (error) {
        console.log(error.mesage);
    }
}
const loadeditcoupon = async (req, res) => {
    try {
        id = req.query.id
        const couponData = await Coupon.findOne({ _id: id })
        res.render('editcoupon', { couponData })
    } catch (error) {
        console.log(error.message);
    }
}
const savecoupondetails = async (req, res) => {
    try {
        const coupon1 = req.body.code
        const findcoupon = await Coupon.findOne({ code: coupon1 })
        if (findcoupon) {
            res.redirect('/admin/getcoupon')
        } else {
            const coupon = new Coupon({
                code: req.body.code,
                discountType: req.body.type,
                discountAmount: req.body.damount,
                maxCartAmount: req.body.camount,
                maxDiscountAmount: req.body.mdamount,
                maxUsers: req.body.muser,
                status: req.body.status,
                expiryDate: req.body.edate

            })
            const couponDatas = coupon.save()
            if (couponDatas) {
                res.redirect('/admin/getcoupon')
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}
const saveeditcoupon = async (req, res) => {
    try {
        id = req.body.id
        const couponData = await Coupon.findByIdAndUpdate({ _id: id }, {
            $set: {
                code: req.body.code, discountType: req.body.type, discountAmount: req.body.damount, maxCartAmount: req.body.camount, maxDiscountAmount: req.body.mdamount, maxUsers: req.body.muser, status: req.body.status, expiryDate: req.body.edate
            }
        })
        if (couponData) {
            res.redirect('/admin/getcoupon')
        }



    } catch (error) {
        console.log(error.message);
    }
}

const loadblockcoupon = async (req, res) => {
    try {
        id = req.query.id
        const blockcoupon = await Coupon.findByIdAndUpdate({ _id: id }, { $set: { status: false } })
        if (blockcoupon) {
            res.redirect('/admin/getcoupon')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadunblockcoupon = async (req, res) => {
    try {
        id = req.query.id
        const unblockcoupon = await Coupon.findByIdAndUpdate({ _id: id }, { $set: { status: true } })
        if (unblockcoupon) {
            res.redirect('/admin/getcoupon')
        }

    } catch (error) {
        console.log(error.message);
    }
}
const postcoupon = async (req, res) => {
    try {
        const code = req.body.code;
        const amount = Number(req.body.amount);
        const userExist = await Coupon.findOne({ code: code, user: { $in: [req.session.user_id] } });

        if (userExist) {
            res.json({ user: true });


        } else {
            const couponData = await Coupon.findOne({ code: code });

            if (couponData) {

                if (couponData.maxUsers <= 0) {
                    res.json({ limit: true });

                } else {

                    if (couponData.status == false) {
                        res.json({ status: true })
                    } else {
                        if (couponData.expiryDate <= new Date()) {
                            res.json({ date: true });
                        } else {

                            if (couponData.maxCartAmount >= amount) {
                                res.json({ cartAmount: true });
                            } else {

                                await Coupon.findByIdAndUpdate({ _id: couponData._id }, { $push: { user: req.session.user_id } });
                                await Coupon.findByIdAndUpdate({ _id: couponData._id }, { $inc: { maxUsers: -1 } });
                                if (couponData.discountType == "Fixed") {
                                    const disAmount = couponData.discountAmount;
                                    const disTotal = Math.round(amount - disAmount);
                                    res.json({ amountOkey: true, disAmount, disTotal });
                                } else if (couponData.discountType == "Percentage Type") {
                                    const perAmount = (amount * couponData.discountAmount) / 100;
                                    if (perAmount <= maxDiscountAmount) {
                                        const disAmount = perAmount;
                                        const disTotal = Math.round(amount - disAmount);
                                        res.json({ amountOkey: true, disAmount, disTotal });
                                    }
                                } else {
                                    const disAmount = couponData.maxDiscountAmount;
                                    const disTotal = Math.round(amount - disAmount);
                                    res.json({ amountOkey: true, disAmount, disTotal });
                                }
                            }
                        }
                    }
                }
            } else {
                res.json({ invalid: true });
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadcoupon,
    loadaddcoupon,
    loadeditcoupon,
    savecoupondetails,
    saveeditcoupon,
    loadblockcoupon,
    loadunblockcoupon,
    postcoupon


}