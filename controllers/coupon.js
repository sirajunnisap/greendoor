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

        // Convert ISO date to Date object
        const startDate = new Date(couponData.startDate);

        const expiryDate = new Date(couponData.expiryDate);

        // Format the date as "YYYY-MM-DD" (e.g. "2023-04-30")
        const formattedDate1 = startDate.toISOString().slice(0, 10);

        const formattedDate2 = expiryDate.toISOString().slice(0, 10);

        res.render('editCoupon', {
            couponData,
            formattedDate1,
            formattedDate2
             // pass the formatted date as a variable to the view
        });

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



const unlistcoupon = async(req,res)=>{
    try {
        const id = req.query.id
        const couponData = await Coupon.findOne({_id : id})
        if(couponData.unlist == false){
            const unlist = await Coupon.updateOne({_id : id},{$set : {unlist : true}})
            res.redirect('/admin/coupon')
        }else{
            const list = await Coupon.updateOne({_id : id},{$set :{unlist : false}})
            res.redirect('/admin/coupon')
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}
module.exports = {
    loadCoupon,
    addCoupon,
    editCoupon,
    updateCoupon,
    unlistcoupon
}