const User = require('../models/userModel')
const Order = require('../models/orderModel')
const Product = require('../models/productsModel')
const Coupon = require('../models/coupenModel')
const Category = require('../models/categoryModel')
const Razorpay = require('razorpay')
const Logger = require('nodemon/lib/utils/log')
const crypto = require('crypto');
const randomstring = require('randomstring')
const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose')
const { isReadable } = require('stream')
const { off } = require('process')


const loadCheckout = async(req,res)=>{
    try {
       
        const id = req.session.userId;

        const user = await User.find({ _id: id }).populate("cart.productId");
       
        
    
       
        const category = await Category.find()
          res.render("checkout", { user ,category});
    
      
       

    } catch (error) {

        console.log(error.message);
    }
}


const add_address = async(req,res)=>{
    try {

        const id = req.session.userId

        const address = await User.updateOne({_id : id},{$push : {
            address : {
                name : req.body.name,
                mobile : req.body.mobile,
                address : req.body.address,
                place : req.body.place,
                state : req.body.state,
                pincode : req.body.pincode,
                house_no : req.body.house_no
            }
        }})       
        res.json({status:true})

    } catch (error) {
        console.log(error.message);
    }
}




const couponApply = async (req, res) => {
    try {
        const userId = req.session.userId
        const user = await User.findOne({ _id:userId });
        let cartTotal = user.cartTotalPrice;
    const exist = await Coupon.findOne(
        { couponCode: req.body.code, used: userId },
        { used: { $elemMatch: { $eq: userId } } }
      );
      if (exist) {
        console.log("already used");
        return res.json({ used: true });
      } else {
        const couponData = await Coupon.findOne({ couponCode: req.body.code });
        if (couponData) {
          if (couponData.expiryDate >= new Date()) {
            if (couponData.limit !== 0) {
              if (couponData.minCartAmount <= cartTotal) {
                if (couponData.couponAmountType === "fixed") {
                  let discountValue = couponData.couponAmount;
                  let value = Math.round(cartTotal - couponData.couponAmount);
                  return res.json({
                    amountokey: true,
                    value,
                    discountValue,
                    code: req.body.code,
                  });
                } else if (couponData.couponAmountType === "percentage") {
                  const discountPercentage = (cartTotal * couponData.couponAmount) / 100;
                  if (discountPercentage >= couponData.minRedeemAmount) {
                    let discountValue = discountPercentage;
                    let value = Math.round(cartTotal - discountPercentage);
                    return res.json({
                      amountokey: true,
                      value,
                      discountValue,
                      code: req.body.code,
                    });
                  } else {
                    let discountValue = couponData.minRedeemAmount;
                    let value = Math.round(cartTotal - couponData.minRedeemAmount);
                    return res.json({
                      amountokey: true,
                      value,
                      discountValue,
                      code: req.body.code,
                    });
                  }
                }
              } else {
                res.json({ minimum: true });
              }
            } else {
              res.json({ limit: true });
            }
          } else {
            res.json({ datefailed: true });
          }
        } else {
          res.json({ invalid: true });
        }
      }
    } catch (error) {
        res.render('uses/500')
      console.log(error.message);
    }
};


const place_order = async(req,res)=>{
    try {
        console.log("placeorder");
        const userId = req.session.userId;

        const index = req.body.address;
        console.log(index);

        const totel = req.body.total1
        
        const discount = req.body.couponDiscount;
        const coupon = req.body.couponC;
        const cartData = await User.find({_id : userId}).populate('cart.productId');
        console.log(cartData,"45");
       
        const cart = cartData[0].cart;
       console.log(cart,"cart");

        console.log(cartData[0].address[index],"123");
        const total = cartData[0].cartTotalPrice;
        const payment = req.body.payment;
        let status = (payment === 'COD')?'placed':'pending';

        let orderItems = [];
        let totalamount = total
        cartData[0].cart.forEach(item => {
            const orderItem = {
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image:item.productId.image,
                qty:item.qty,
                productTotalPrice : item.productTotalPrice
            };
           
            totalamount += item.productTotalPrice;
            // const qty = cart.qty
            orderItems.push(orderItem);
        });
        console.log(orderItems,"pr");

        const randomstring = uuidv4().slice(0, 5);
        console.log(randomstring, "random string");

        let orderObj = {
            
            userId : userId,
            address : {
                name: cartData[0].address[index].name,
                address : cartData[0].address[index].address,
                place : cartData[0].address[index].place,
                mobile : cartData[0].address[index].mobile,
                state : cartData[0].address[index].state,
                pincode : cartData[0].address[index].pincode,
                house_no : cartData[0].address[index].house_no
            },
            paymentMethod : payment,
            orderStatus : status,
            items : orderItems, // Include the extracted orderItems array
            totalAmount : total,
            discount : discount,
            orderId: randomstring,
           
        };

        
      await Order.create(orderObj)
      .then(async(data)=>{
        const orderId = data._id.toString()
        console.log(orderId,"56");
        if(payment == 'COD'){
          const userData = await User.findOne({_id : userId})
          const cartData = userData.cart
          for(let i=0; i<cartData.length; i++){
            const productStock = await Product.findById(cartData[i].productId)
            productStock.quantity -= cartData[i].qty
            await productStock.save()
          }
          await User.updateOne({_id : userId},{$set:{cart:[],cartTotalPrice : 0}})
          res.json({status : true})
         

          
        }else if(payment == "wallet"){
        
          const userData = await User.findOne({_id : userId})
          if(userData.wallet >= total){
            const cartData = userData.cart
            console.log(cartData,"cartData");
            for(let i=0; i<cartData.length; i++){
              const productStock = await Product.findById(cartData[i].productId)
              productStock.qty -= cartData
              await productStock.save()
            }
            const walletBalence = userData.wallet - userData.cartTotalPrice;
            console.log(walletBalence,"walletBallence");
            await User.updateOne({_id:userId},{$set:{cart:[],cartTotalPrice:0, wallet:walletBalence}});

            await Order.updateOne({_id:orderId},{$set:{paymentMethod:"wallet",orderStratus:"placed"}});

            
            const wallet = await User.find({_id : userId});
            console.log(wallet,"wallet");
            
            res.json({status : true})
          }else{
            res.json({walletBalence:true})
          }



        }else{
          
          var instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
          });
          let amount = totel;
          instance.orders.create(
            {
              amount: amount * 100,
              currency: "INR",
              receipt: orderId,
            },
            (err, order) => {
              console.log(order, "orderaaaa");
              res.json({ status: false, order });
            }
          );
        }
      })

      
    } catch (error) {
      res.render('500')
      console.log(error.message);
    }
  }


  const verifyPayment = async(req,res)=>{
    try {
      const userId = req.session.userId
      const details = req.body;

    console.log(details.payment);

    let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);

    hmac.update(
      details.payment.razorpay_order_id +
      "|" +
      details.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");

    const orderId = details.order.receipt;

    console.log(orderId);

    if (hmac === details.payment.razorpay_signature) {
        const userData = await User.findOne({_id : userId})
        const cartData = userData.cart
        console.log(cartData);
        for(let i=0; i<cartData.length;i++){
          const productStock = await Product.findById(cartData[i].productId)
          productStock.quantity -= cartData[i].qty
          await productStock.save()
        }
        await User.updateOne({_id : userId},{$set:{cart:[],cartTotalPrice:0}})
        await Order.findByIdAndUpdate(orderId, {$set: { orderStatus: 'placed'}}).then((data)=>{
          res.json({status:true,data})
        }).catch((err)=>{
          console.log(err);
          res.data({status : false ,err})
        })
      }else{
        res.json({status:false})
        console.log('payment failed');
      }
    } catch (error) {
      res.render('500')
      console.log(error.message);
    }
  }


const orderSuccess = async(req,res) => {
    try{
        const user = req.session.userId
        const userId = req.session.userId
        const userData = await User.findOne({_id:userId})
        const catrData  = await User.findOne({_id:userId})
        const orderData = await Order.findOne({userId:userId}).populate({path:'items',populate:{path:'productId',model:'Product'}}).sort({createdAt:-1}).limit(1)
        console.log(orderData.items,"orderSuccess");
      if(orderData){

        res.render('orderSuccess',{orderData,user})
      }
        
    }catch(error){
        res.render('500')
        console.log(error.message);
    }
}


const loadOrder = async(req,res)=>{
  try {
    const orderList = await Order.find({}).sort({createdAt: -1});
    console.log(orderList,"orderlist");
    if(orderList){
      res.render('list-orders',{orderList})
    }
  } catch (error) {
    res.render('500')
    console.log(error);
  }
}


const orderPlaced = async(req,res)=>{
  try {
    id = req.query.id
    const changeStatus = await Order.findByIdAndUpdate({_id:id},{$set:{orderStatus : "placed"}})
    if(changeStatus){
      res.redirect('/admin/orders')
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const orderShipped = async(req,res)=>{
  try {
    id = req.query.id
    const changeStatus = await Order.findByIdAndUpdate({_id:id},{$set:{orderStatus : "shipped"}})
    if(changeStatus){
      res.redirect('/admin/orders')
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const orderDelivered = async(req,res)=>{
  try {
    id = req.query.id
    const changeStatus = await Order.findByIdAndUpdate({_id:id},{$set:{orderStatus : "delivered"}})
    if(changeStatus){
      res.redirect('/admin/orders')
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const rejectReturn = async(req,res)=>{
  try {
    id = req.query.id
    const changeStatus = await Order.findByIdAndUpdate({_id:id},{$set:{orderStatus : "Return rejected"}})
    if(changeStatus){
      res.redirect('/admin/orders')
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}



const acceptReturn = async(req,res)=>{
  try {
    id = req.query.id
    const changeStatus = await Order.findByIdAndUpdate({_id: id},{$set:{orderStatus : "Return Accepted"}})
    const orderData = await Order.findOne({_id : id})
    if(orderData.paymentMethod == 'card'){
      const refund = await User.updateOne({_id: orderData.userId},{$inc: {wallet: orderData.totalAmount}})
    }
    const quantity = orderData.items
    
    for(i=0; i<quantity.length; i++){
      const productStock = await Product.updateOne({_id: quantity[i].productId },{$inc: {qty: quantity[i].qty}})
      res.redirect('/admin/orders');
    }

  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}



const orderHistory = async(req,res)=>{
  try {

    id = req.session.userId
    const orderedData = await Order.find({userId :id}).sort({createdAt: -1});
    console.log(orderedData ,"ordereddata");
    if(orderedData){
      res.render('orderHistory',{orderedData})

    }
    
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}

const returnRequest = async(req,res)=>{
  try {
    Id = req.query.id
    const Datee = await Order.findOne({ _id: Id })
    if (Datee) {
        const orderDate = Datee.date
        const orderDateObj = new Date(orderDate);
        const currentDateObj = new Date();
        const timeDiff = currentDateObj.getTime() - orderDateObj.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (daysDiff <= 30) {
            const returnOrder = await Order.updateOne({ _id: Id }, { $set: { orderStatus: "return requested" } })

            res.redirect("/orderHistory")
            console.log("return requested");
        } else {
            const expiredOrder = await Order.updateOne({ _id: Id }, { $set: { expireStatus: "expired" } })
            res.redirect("/orderHistory")
            console.log("else return requested");
        }

    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const cancelRequest = async(req,res)=>{
  try {
    const orderId = req.query.id
    const order = await Order.findById(orderId)
    if(order.paymentMethod == "card" && order.orderStatus == 'placed'){
      const refund = await User.findOneAndUpdate({_id:order.userId},{$inc:{wallet:order.totalAmount}})
      order.orderStatus = 'Cancelled'
      order.save()
      res.redirect('/profile')
    }else{
      order.orderStatus = 'Cancelled'
      order.save()
      res.redirect('/profile')
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const cancelReturnRequest = async(req,res)=>{
  id = req.session.id
  const cancelreq = await Order.findByIdAndUpdate({_id:id},{$set:{orderStatus : 'delivered'}})
  if(cancelreq){
    req.redirect('/orderHistory')
  }
}



const orderedProducts = async(req,res) => { 
   try{
      const orderId  =req.query.id
      const orders = await Order.findOne({_id:orderId}).populate({path:'items',populate:{path:'productId',model:'Product'}})

      console.log(orders.items,"orderedproducts");
      res.render('orderView',{orders})

   }catch(error){
    res.render('500')
      console.log(error.message);
   }
}


const loadSales = async(req,res)=>{
  try {
    const saleData = await Order.find({
      orderStatus:'delivered'
    })
    .populate({path:'items',populate:{path:'productId',model:'Product'}})
    .sort({date: -1}); 
    
    res.render('salesReport',{saleData})
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


const listSalesReport = async(req,res)=>{
  try {
    const currentDate = new Date(req.body.to)
    console.log(currentDate);
    const newDate = new Date(currentDate)
    console.log(newDate);
    newDate.setDate(currentDate.getDate()+1)
   
    if(req.body.from.trim() == '' || req.body.to.trim() == ''){
      res.render('salesReport',{message:'all field required'})
    }else{
      const saleData = await Order.find({
        orderStatus:'delivered',
        date:{$gte : new Date(req.body.from),$lte:new Date(newDate)}
      })
      .populate({path:'items',populate:{path:'productId',model:'Product'}})
      .sort({date: -1}); 
      res.render('listSalesReport',{saleData})
    }
  } catch (error) {
    res.render('500')
    console.log(error.message);
  }
}


module.exports = {
    loadCheckout,
    add_address,
    place_order,
    couponApply,
    verifyPayment,
    orderSuccess,
    loadOrder,
    orderPlaced,
    orderShipped,
    orderDelivered,
    rejectReturn,
    acceptReturn,
    orderHistory,
    returnRequest,
    cancelRequest,
    cancelReturnRequest,
    orderedProducts,
    loadSales,
    listSalesReport
    
}