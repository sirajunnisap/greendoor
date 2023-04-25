const mongoose = require('mongoose')
const Category = require('./categoryModel')

const productSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true
    },
    category : {
        type : mongoose.Types.ObjectId,
        ref : Category,
        required : true
    },
    price : {
        type : Number ,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    image : {
        type : Array
    },
    unlist : {
        type : Boolean,
        default : false
    }


})

module.exports = mongoose.model('Product',productSchema)