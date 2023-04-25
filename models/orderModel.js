const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({

    orderId: {
        type: String
    },
    
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    address : {
        name : {
            type : String,
            required : true
        },
        mobile : {
            type : Number,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        place : {
            type : String,
            required : true
        },  
        pincode : {
            type : Number,
            required : true
        },
        house_no : {
            type : String,
            required : true
        }
    },
    items : {
        type : Array
    },
  
    date : {
        type : Date,
        default  : Date.now
    },
    paymentMethod : {
        type : String
    },
    orderStatus : {
        type : String
    },
    totalAmount : {
        type : Number
    },
    discount : {
        type : Number
    },
    expireStatus: {
        type:String,
        default:"not expired"
    }

},{timestamps : true})

module.exports = mongoose.model('Order',orderSchema)