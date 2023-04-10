const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    
    name : {
        type : String,
        unique : true,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    unlist : {
        type : Boolean,
        default : true
    }
})


module.exports = mongoose.model('Category',categorySchema)