const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    bannerImage:{
        type:String,
        require:true
    },
    subTitle:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    offerName:{
        type:String,
        require:true
    },
    unlist : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Banner',bannerSchema)