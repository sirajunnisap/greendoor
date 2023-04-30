const express = require('express')
const admin_route = express()

const session = require('express-session');
const config = require('../config/config')

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');


const path = require('path');
const multer = require('multer');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/users/img/product-categories'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }

});

const upload = multer({storage:storage})


const auth = require('../middleware/adminauth');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const couponController = require('../controllers/coupon');
const orderController = require('../controllers/orders');
const bannerController = require('../controllers/banner');

//Login
admin_route.get('/login',auth.isLogout,adminController.loadLogin)
admin_route.post('/login',adminController.verifyLogin);


//Dashboard
admin_route.get('/dashboard',auth.isLogin,adminController.loadDashboard);


//User Management
// admin_route.get('/userdetails',auth.isLogin,adminController.loadUserdetails);
admin_route.get('/list-users',auth.isLogin,adminController.user_details)
admin_route.get('/block-user',auth.isLogin,adminController.blockUser);


//categorymanagement
admin_route.get('/list-categories',auth.isLogin,categoryController.listcategories);
admin_route.get('/add-category',auth.isLogin,categoryController.loadAddCategories)
admin_route.post('/add-category',upload.single('image'),categoryController.addCategories);
admin_route.get('/edit-category',auth.isLogin,categoryController.editCategories);
admin_route.post('/edit-category/:id',categoryController.updateCategory);
admin_route.get('/unlist-category',auth.isLogin,categoryController.unlistCategory);



//Product Management
admin_route.get('/list-products',auth.isLogin,productController.productList);
admin_route.get('/add-products',productController.loadAddProduct);
admin_route.post('/add-products',upload.single('image'),productController.addproducts);
admin_route.get('/edit-product',auth.isLogin,productController.editProducts);
admin_route.post('/edit-product/:id',productController.updateProduct);
admin_route.get('/unlist-product',auth.isLogin,productController.unlistProduct);
admin_route.post('/edit-image/:id',upload.array('image',4),productController.updateImage)
admin_route.get('/delete-product-image/:imgid/:bnrId',productController.deleteImage)


admin_route.get('/coupon',couponController.loadCoupon);
admin_route.post('/add-coupon',couponController.addCoupon);
admin_route.get('/editCoupon',couponController.editCoupon);
admin_route.post('/editCoupon',couponController.updateCoupon);
admin_route.get('/unlist-coupon',couponController.unlistcoupon)



//order Management
admin_route.get('/orders',orderController.loadOrder)
admin_route.get('/order-status-placed',orderController.orderPlaced)
admin_route.get('/order-status-shipped',orderController.orderShipped)
admin_route.get('/order-status-delivered',orderController.orderDelivered)
admin_route.get('/order-status-rejectReturn',orderController.rejectReturn)
admin_route.get('/order-status-acceptReturn',orderController.acceptReturn)
// admin_route.get('/orderPreview',orderController.orderView)
admin_route.get('/orderPreview',orderController.orderedProducts)


admin_route.get('/list-banner', bannerController.loadbanner)
admin_route.get('/add-banner',bannerController.loadAddBanner)
admin_route.post('/add-banner',upload.single('bannerimage'),bannerController.addBanner)
admin_route.get('/edit-banner',  bannerController.loadeditBanner)
admin_route.post('/edit-banner',upload.single('bannerimage'),  bannerController.editBanner)
admin_route.get('/unlist-banner',bannerController.unlistBanner);
// admin_route.post('/edit-image/:id',upload.array('image',4),bannerController.updateImage)
// admin_route.get('/delete-banner-image/:imgid/:bnrId',bannerController.deleteImage)

admin_route.get('/sales-report',orderController.loadSales)
admin_route.post('/show-salesreprot', orderController.listSalesReport)

module.exports = admin_route ;
