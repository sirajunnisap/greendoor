const User = require('../models/userModel')
const Product = require('../models/productsModel')
const Category = require('../models/categoryModel')

const loadWishlist = async(req,res)=>{
    try {
        const category = await Category.find({})

        const id = req.session.userId

        const user =  await User.findOne({_id : id })
        const userData = await User.findOne({_id:id})
        console.log(user+'sfdsdf');

        const product = await User.findById({ _id: id }).populate('wishlist.productId').exec()

        let wishlist = product.wishlist
        console.log(wishlist,"679");
//         const user=await User.findOne({ _id: id })
//   .populate('wishlist')
 

    console.log(user);
        res.render('wishlist',{user,userData,product,wishlist,category} )

    } catch (error) {
        console.log(error.message);
    }
}

const addToWishlist = async(req,res)=>{
    try {
        const productId = req.body.productId
        const _id = req.session.userId
        let exist = await User.findOne({ _id: req.session.userId, 'wishlist.productId': productId })
        if(exist){
            res.json({exist : true})
        } else {
            const product = await Product.findOne({_id :req.body.productId})
            const userData = await User.findOne({_id})
            const wishlistItem ={
                productId : product._id,
                qty:1,
                price:product.price,
                productTotalPrice:product.price
            }
            const result = await User.updateOne({ _id }, { $push: { wishlist: wishlistItem } })
            console.log(result,"addwishlit");
            if (result) {
                res.json({ success: true })
            } else {
                console.log('not added to wishlist')
            }
        }
       
    } catch (error) {
        console.log(error.message);
    }
}


const deleteWishlistPdct = async(req,res)=>{
    try {
        const userId = req.body.userId
        const deleteProId = req.body.deleteProId
        const userData = await User.findByIdAndUpdate({_id:userId},{$pull:{wishlist:{productId:deleteProId}}})
        if(userData){
            res.json({success:true})
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadWishlist,
    addToWishlist,
    deleteWishlistPdct
}