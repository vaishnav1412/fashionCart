const User = require('../models/userModel')
const Address = require('../models/addressModel1');
const { default: mongoose } = require('mongoose');

const addAddress = async (req, res) => {
    try {
        const userName = await User.findOne({ _id: req.session.user_id });
        if (req.session.user_id) {
            let customer = true;
            res.render('addAddress', { customer, userName });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}
const insertAddress = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id });
        const addressDetails = await Address.findOne({ userId: req.session.user_id });
        if (addressDetails) {
            const updatedOne = await Address.updateOne({ userId: req.session.user_id }, {
                $push: {
                    addresses: {
                        userName: req.body.userName,
                        mobile: req.body.mobile,
                        alternativeMob: req.body.alterMobile,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        landmark: req.body.landmark
                    }
                }
            })
            if (updatedOne) {
                res.redirect('/checkout');
            } else {
                res.redirect('/checkout');
            }
        } else {
            const address = new Address({
                userId: userData._id,
                addresses: [{
                    userName: req.body.userName,
                    mobile: req.body.mobile,
                    alternativeMob: req.body.alterMobile,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    landmark: req.body.landmark
                }]
            });
            const addressData = await address.save();
            if (addressData) {
                res.redirect('/checkout')
            } else {
                res.redirect('/checkout');
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadaddprofileaddress = async (req, res) => {
    try {
        res.render('profileaddaddress')
    } catch (error) {
        console.log(error.message);
    }
}



const loadeditprofileaddress = async (req, res) => {
    try {
        const id = req.query.id
        const index = req.query.index
        const user = await User.findOne({ _id: req.session.user_id })
        const userid = req.session.user_id
        const editData = await Address.findOne({ userId: userid })
        const value = editData.addresses[index]

        res.render('profileeditaddress', { userId: user.name, value, index })
    } catch (error) {
        console.log(error.message);
    }
}
const loadeditcheckoutaddress = async (req, res) => {
    try {
        const id = req.query.id
        const index = req.query.index
        const user = await User.findOne({ _id: req.session.user_id })
        const userid = req.session.user_id
        const editData = await Address.findOne({ userId: userid })
        const value = editData.addresses[index]

        res.render('profileeditaddress', { userId: user.name, value, index })
    } catch (error) {
        console.log(error.message);
    }
}
const loadremoveprofileaddress = async (req, res) => {
    try {

        const address = await Address.updateOne({ userId: req.session.user_id }, { $pull: { addresses: { _id: req.query.id } } })

        res.redirect("/myaccount")


    } catch (error) {
        console.log(error.message);
    }
}
const loaddeleatecheckoutadress = async (req, res) => {
    try {
        const address = await Address.updateOne({ userId: req.session.user_id }, { $pull: { addresses: { _id: req.query.id } } })

        res.redirect("/checkout")

    } catch (error) {
        console.log(error.message);
    }
}
const addprofileaddress = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id });

        const addressDetails = await Address.findOne({ userId: req.session.user_id });
        if (addressDetails) {
            const updatedOne = await Address.updateOne({ userId: req.session.user_id }, {
                $push: {
                    addresses: {
                        userName: req.body.userName,
                        mobile: req.body.mobile,
                        alternativeMob: req.body.alterMobile,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        landmark: req.body.landmark
                    }
                }
            })
            if (updatedOne) {
                res.redirect('/myaccount');
            } else {
                res.redirect('/myaccount');
            }
        } else {
            const address = new Address({
                userId: userData._id,
                addresses: [{
                    userName: req.body.userName,
                    mobile: req.body.mobile,
                    alternativeMob: req.body.alterMobile,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode,
                    landmark: req.body.landmark
                }]
            });
            const addressData = await address.save();
            if (addressData) {
                res.redirect('/myaccount')
            } else {
                res.redirect('/myaccountt');
            }
        }
        res.redirect('/myaccount')
    } catch (error) {
        console.log(error.message);
    }
}
const editprofileaddress = async (req, res) => {
    try {
        const index = req.body.index
        const editData = await Address.findOne({ userId: req.session.user_id })
        if (editData) {
            const update = await Address.updateOne({
                userId: req.session.user_id
            }, {
                $set: {
                    [`addresses.${index}`]: {
                        userName: req.body.userName,
                        mobile: req.body.mobile,
                        alternativeMob: req.body.alterMobile,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        landmark: req.body.landmark
                    }
                }
            }
            )
            if (update) {
                res.redirect('/myaccount')
            }
        }


    }
    catch (error) {
        console.log(error.message);
    }
}

const editcheckoutaddress = async (req, res) => {
    try {
        const index = req.body.index
        const editData = await Address.findOne({ userId: req.session.user_id })
        if (editData) {
            const update = await Address.updateOne({
                userId: req.session.user_id
            }, {
                $set: {
                    [`addresses.${index}`]: {
                        userName: req.body.userName,
                        mobile: req.body.mobile,
                        alternativeMob: req.body.alterMobile,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        landmark: req.body.landmark
                    }
                }
            }
            )
            if (update) {
                res.redirect('/checkout')
            }
        }


    }
    catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    addAddress,
    insertAddress,
    loadaddprofileaddress,
    loadeditprofileaddress,
    addprofileaddress,
    editprofileaddress,
    loadremoveprofileaddress,
    loaddeleatecheckoutadress,
    loadeditcheckoutaddress,
    editcheckoutaddress

}