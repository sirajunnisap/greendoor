
 const Banner = require('../models/bannerModel')
 const fs = require('fs')
 const path = require('path')
const bannerModel = require('../models/bannerModel')

 const loadbanner = async(req,res)=>{
    try {
        const bannerData = await Banner.find({})
        if(bannerData){
            res.render('list-banner',{bannerData})
        }
    } catch (error) {
        console.log(error.message);
    }
 }

 const loadAddBanner = async(req,res)=>{
    try {
        res.render('add-Banner')
    } catch (error) {
        console.log(error.message);
    }
 }

 const addBanner= async (req, res) => {
    try {

        // const Images = []
        // for (file of req.files) {
        //     Images.push(file.filename)
        // }
        
        const bannerData = new Banner({
            bannerImage:req.file.filename,
            offerName:req.body.offername,
            subTitle:req.body.subTitle,
            description:req.body.description,
        })

        const result = await bannerData.save();

        if (result) {
            res.redirect("/admin/list-banner");
        } 
        
       
    } catch (error) {
        console.log(error.message);
    }
}

const loadeditBanner = async(req,res)=>{
    try {
        const Id = req.query.id
        console.log(Id);

        const banner = await Banner.findOne({_id:Id})
        console.log(banner);

      
            res.render('edit-banner',{banner})
      
    } catch (error) {
        console.log(error.nessage);
    }
}

const editBanner = async(req,res)=>{
    try {
        
        const bannerId = req.query.id
        const filename=req.file.filename
        const bannerData = await Banner.updateOne({_id:bannerId},{$set:{
            offerName:req.body.offername,
            subTitle:req.body.subTitle,
            description:req.body.description,
            bannerImage:filename,
        }})
            
        
        //  res.render('edit-Banner',{Banner,message:"success"})
    
           res.redirect('/admin/list-banner')
        
    } catch (error) {
        console.log(error.message);
    }
}
// const updateImage = async(req,res)=>{
//     try {
//         const id = req.params.id
//         console.log(id,"idparams");
//         const bannerData = await Banner.findOne({_id : id})
//         const imglength = bannerData.image.length
//         if(imglength <= 4){
//             let images = []
//             for(file of req.files){
//                 images.push(file.filename)
//             }
//             if(imglength+images.length <= 4){
//                 const updateData = await Banner.updateOne({_id:id},{$addToSet:{image:{$each:images}}})
//             }else{
//                 const Banner = await Banner.findOne({_id : id})
//                 res.render("edit-banner",{Banner,imgfull:true})
//             }
//         }else{
//             res.redirect('/admin/edit-banner')
//         }

//     } catch (error) {
//         console.log(error.message);
//     }
// }

// const deleteImage = async(req,res)=>{
//     try {
//         const imgid = req.params.imgid
//         console.log(imgid,"imgdeleteid");
//         const bnrId = req.params.bnrId
//         console.log(bnrId,"bannerimg");
//         fs.unlink(path.join(__dirname,'../public/users/img/product-categories',imgid),()=>{})
//         const BannerImg = await Banner.updateOne({_id:bnrId},{$pull:{image:imgid}})
//     } catch (error) {
//         console.log(error.message);
//     }
// }



const unlistBanner = async(req,res)=>{
    try {
        const id = req.query.id
        const bannerData = await Banner.findOne({_id : id})
        if(bannerData.unlist == false){
            const unlist = await Banner.updateOne({_id : id},{$set : {unlist : true}})
            res.redirect('/admin/list-banner')
        }else{
            const list = await Banner.updateOne({_id : id},{$set :{unlist : false}})
            res.redirect('/admin/list-banner')
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}



 module.exports = {
    loadbanner,
    loadAddBanner,
    addBanner,
    loadeditBanner,
    editBanner,
    // updateImage,
    // deleteImage,
    unlistBanner
 }