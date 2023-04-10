const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    mobile : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    is_admin : {
        type : Number,
        required : true
    },
    is_verified : {
        type : Boolean,
        default : true
    },
    block : {
        type : Boolean,
        default : false
        
    },
    cart : [{
        productId : {
            type : mongoose.Types.ObjectId,
            ref : 'Product',
            required : true
        },
        price : {
            type : Number
        },
        qty : {
            type : Number,
            required:true,
            default : 0
        },
        productTotalPrice : {
            type : Number,
            required : true
        }
    }],
    cartTotalPrice:{
        type:Number,
        // default:0
    },
    address : [{
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
        },
        default_address : {
            type : Boolean,
            required : true
        }
    }]
    
})



module.exports=mongoose.model('User',userSchema);


