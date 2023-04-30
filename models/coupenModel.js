const mongoose  = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponCode : {
        type:String,
        required:true
    },
    couponAmountType:{
        type:String,
        required:true
    },
    couponAmount:{
        type:Number,
        required:true
    },
    minCartAmount:{
        type:Number
    },
    minRedeemAmount:{
        type:Number,
        requied:true
    },
    startDate:{
        type:Date
    },
    expiryDate:{
        type:Date
    },
    limit:{
        type:Number,
        required:true
    },
    used:{
        type:Array
    },
    unlist:{
        type:Boolean,
        default:false,
    }
})


module.exports = mongoose.model('Coupon',couponSchema)