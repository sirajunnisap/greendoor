const express = require('express');
const user_route = express();


const session = require('express-session');
const nocache = require('nocache');


const config = require('../config/config')
 


user_route.use(session({
    secret : config.sessionSecret,
    saveUninitialized : true,
    resave : false,
    cookie : {maxAge : 500000} 
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
const profileController = require('../controllers/profile')

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



// //categotyManagement

// user_route.get('/categories',userController.loadCategories)
// user_route.get('/ctrypdt',userController.findCategoryProduct);

//product
// user_route.get('/products',productController.product_view);
user_route.get('/products',productController.loadProducts)
user_route.get('/productDetails/:id',productController.productDetail);
user_route.get('/shopCategory/:id',productController.loadShopCategory);

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


user_route.get('/checkout',)

// user_route.get('*', (req,res)=>{
//     res.render('404-page',{message : "this page is not found"})
// })

module.exports = user_route;