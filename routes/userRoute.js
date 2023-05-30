const express = require('express');
const user_route = express();


const session = require('express-session');
const nocache = require('nocache');


const config = require('../config/config')
 


user_route.use(session({
    secret : config.sessionSecret,
    saveUninitialized : true,
    resave : false,
    cookie : {maxAge : 500000*100000} 
}));

user_route.use(nocache());

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({exteded : true}))

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/images'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }

});

const upload = multer({storage:storage})

const auth = require('../middleware/auth')
const userController = require('../controllers/userController');
const cartController = require('../controllers/cart');
const productController = require('../controllers/product');
const profileController = require('../controllers/profile');
const orderController = require('../controllers/orders');
const wishlistController = require('../controllers/wishlist');

user_route.get('/register',userController.loadRegister);
user_route.post('/register',upload.single('image'),userController.insertUser);


//home
user_route.get('/',userController.landingPage);
user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/mobileverification',auth.isLogout,userController.loadMobileVerification);
user_route.post('/mobileverification',userController.mobileVerification);

user_route.get('/otp',auth.isLogout,userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);


user_route.get('/login',auth.isLogout,userController.loadLogin);
user_route.post('/login',userController.verifyLogin);

user_route.get('/logout',userController.loadLogout)

//Search.....
user_route.post('/getProducts',userController.searchProducts)




//product

user_route.get('/products',productController.loadProducts)
user_route.get('/productDetails/:id',productController.productDetail);
user_route.get('/shopCategory/:id',productController.loadShopCategory);
// user_route.get('/products',productController.viewProduct);
// user_route.get('/products',productController.loadShop)

//wishlist
user_route.get('/wishlist',wishlistController.loadWishlist);
user_route.post('/addToWishlist',wishlistController.addToWishlist);
user_route.post('/deleteWishlist',wishlistController.deleteWishlistPdct);


// //cart
user_route.get('/cart',auth.isLogin,cartController.showCart);
user_route.post('/addtocart',cartController.addToCart)
user_route.post('/change-quantity',cartController.change_quantity);
user_route.post('/delete-cart-product',cartController.deleteCartProduct)


// //profile
user_route.get('/profile',auth.isLogin,profileController.showProfile);
user_route.post('/updateUserData',auth.isLogin,profileController.updateUserData)




user_route.get('/address',profileController.showAddress);
user_route.post('/add_Address',profileController.add_address);
user_route.post('/delete_address',profileController.deleteAddress);
user_route.post('/edit-address',profileController.edit_address);


user_route.get('/checkout',orderController.loadCheckout);
user_route.post('/add_address',orderController.add_address);
user_route.post('/coupon-apply',orderController.couponApply);
user_route.post('/place_order',orderController.place_order);
user_route.post('/verify-payment',orderController.verifyPayment)
user_route.get('/ordersuccess',orderController.orderSuccess);
user_route.get('/orderHistory',orderController.orderHistory);
user_route.get('/returnRequested',orderController.returnRequest)
user_route.get('/cancelreturnRequested',orderController.cancelReturnRequest)
user_route.get('/cancelRequest',orderController.cancelRequest)


user_route.post('/search',productController.searchProducts)
user_route.get('/sort', productController.sort);


// user_route.get('*', (req,res)=>{
//     res.render('404-page',{message : "this page is not found"})
// })

module.exports = user_route;