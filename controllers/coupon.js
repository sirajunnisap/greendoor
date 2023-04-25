const Coupon = require('../models/coupenModel')


const loadCoupon = async(req,res)=>{
 try {

    const couponsData = await Coupon.find({disable : false})
    res.render('coupon',{couponsData})
    
 } catch (error) {
    console.log(error.message);
 }
}

const addCoupon = async(req,res) => { 
    try{
        const couponData = {...req.body}
        const couponAdd = new Coupon({
            couponCode: couponData.coupon_code,
            couponAmountType: couponData.fixedandpercentage,
            couponAmount: couponData.couponamount,
            minRedeemAmount: couponData.radeemamount,
            minCartAmount: couponData.cartamount,
            startDate:couponData.startdate,
            expiryDate: couponData.expirydate,
            limit: couponData.usagelimit,
        })
        const insert  = await couponAdd.save()
        res.redirect('/admin/coupon')

    }catch(error){
       
        console.log(error.message);
    }
}

const editCoupon = async(req,res) => { 
    try{
        const couponId = req.query.id
        const couponData = await Coupon.findOne({_id:couponId})
        res.render('editCoupon',{couponData})

    }catch(error){
        
        console.log(error.message);
    }
}
const updateCoupon = async(req,res) => { 
    try{
        const couponId = req.query.id
        const update = await Coupon.updateOne({_id:couponId},{$set:{
            couponCode: req.body.coupon_code,
            couponAmountType: req.body.fixedandpercentage,
            couponAmount: req.body.couponamount,
            minRedeemAmount: req.body.radeemamount,
            minCartAmount: req.body.cartamount,
            startDate:req.body.startdate,
            expiryDate: req.body.expirydate,
            limit: req.body.usagelimit,
        }})
        res.redirect('/admin/coupon')
        

    }catch(error){
        
        console.log(error.message);
    }
}
const deleteCoupon = async(req,res) => { 
    try{
        const couponId = req.query.id
        const update = await Coupon.updateOne({_id:couponId},{$set:{disable:true}})
        res.redirect('/admin/coupon')

    }catch(error){
        
        console.log(error.message);
    }
}
module.exports = {
    loadCoupon,
    addCoupon,
    editCoupon,
    updateCoupon,
    deleteCoupon
}