
const User = require('../models/userModel');
const Product = require('../models/productsModel');
const { productDetail } = require('./product');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')
// const mongoose = require('mongoose')


const showCart = async (req, res) => {
    try {
        console.log("showing cart");
        const userId = req.session.userId
        console.log(userId);
        const usersir = await User.findOne({ _id: userId })
        console.log(usersir);
        const userTemp = req.session.userId
        console.log(userTemp);
        const usercart = await User.aggregate([{ $match: { _id: new ObjectId(userTemp) } }, { $unwind: '$cart' }, { $group: { _id: null, totalcart: { $sum: '$cart.productTotalPrice' } } }])
        console.log(usercart);
        if (usercart.length > 0) {
            const cartTotal = usercart[0].totalcart
            console.log(cartTotal, "9");
            const cartTotalUpdate = await User.updateOne({ _id: userId }, { $set: { cartTotalPrice: cartTotal } })
            console.log(cartTotalUpdate);
            const userData = await User.findOne({ _id: userId }).populate('cart.productId').exec()
            console.log(userData);
            res.render('cart', { userData })
        } else {
            const userData = await User.findOne({ userId })
            res.render('cart', { userData })
        }
        // const product = await Product.find()
        // res.render('cart',{product})
    } catch (error) {
        console.log(error.message);
    }
}

const addToCart = async (req, res) => {
    try {

        const productId = req.body.productId
        const _id = req.session.userId
        let exist = await User.findOne({ _id: req.session.userId, 'cart.productId': productId })
        if (exist) {
            res.json({ exist: true })
        } else {
            const product = await Product.findOne({ _id: req.body.productId })
            const userData = await User.findOne({ _id })
            const cartItem = {
                productId: product._id,
                qty: 1,
                price: product.price,
                productTotalPrice: product.price
            }
            const result = await User.updateOne({ _id }, { $push: { cart: cartItem } })
            if (result) {
                res.json({ success: true })
            } else {
                console.log('not added to cart')
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}


const change_quantity = async(req,res)=>{
    try {
        const {user,product,count,quantity,pdtprice} = req.body
        const pdttemp = new ObjectId(product)
        const usertemp = new ObjectId(user)
        const updateQty = await User.findOneAndUpdate({_id: usertemp, 'cart.productId': pdttemp},{$inc:{'cart.$.qty':count}})
        const currentqty = await User.findOne({_id: usertemp,'cart.productId': pdttemp},{_id:0,'cart.qty.$':1})
        const qty = currentqty.cart[0].qty
        const productSinglePrice = pdtprice*qty
        await User.updateOne({_id:usertemp,'cart.productId':pdttemp},{$set:{'cart.$.productTotalPrice':productSinglePrice}})
        const cart = await User.findOne({_id:usertemp})
        let sum = 0
        for(let i=0 ; i<cart.cart.length ; i++){
            sum=sum+cart.cart[i].productTotalPrice
        }
        const update = await User.updateOne({_id:usertemp},{$set:{cartTotalPrice:sum}})
        .then(async(response)=>{
            res.json({response:true,productSinglePrice,sum})
        })


    } catch (error) {
        console.log(error.message);
    }
}


const deleteCartProduct = async(req,res) => { 
    try{
        const userId = req.body.userId
        const deleteProId = req.body.deleteProId
        const userData = await User.findByIdAndUpdate({_id:userId},{$pull:{cart:{productId:deleteProId}}})
        if(userData){
            res.json({success:true})
        }
    }catch(error){
        console.log(error.message);
        
    }
}

module.exports = {
    showCart,
    addToCart,
    change_quantity,
    deleteCartProduct
   
}