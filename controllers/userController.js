const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const Product = require('../models/productsModel')
const Category = require('../models/categoryModel')
const Banner = require('../models/bannerModel')

// const {TWILIO_SERVICE_SID,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN} = process.env
// const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{
//     lazyLoading:true
// })

const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash
        
    } catch (error) {
        console.log(error.message);
    }
}

//resistration

const loadRegister = async(req,res)=>{
    try {
        res.render('login-register')
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try {
        if(req.body.name.trim() != "" && req.body.email.trim() != "" && req.body.mobile.trim() != "" && req.body.password.trim() != ""){
            const email = await User.findOne({email : req.body.email});
            if(!email){

                const spassword = await securePassword(req.body.password)

       const user = new User ({
        name : req.body.name,
        email : req.body.email,
        mobile : req.body.mobile,
        // image : req.file.filename,
        password : spassword,
        is_admin : 0,
        block : false
       })

       const userData = await user.save();

       if(userData){

        res.redirect('/login');
       }else{
        res.render('login-register',{message : "Your Registration has failed."})
       }

            }else{
                res.render('login-register',{message: " This Email already taken"})
            }
        }else{
            res.render('login-register',{message: "Please fill your form"})
        }
       

    } catch (error) {
        console.log(error.message);
    }
}

//login methor for users

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
            if(userData.block == false){
                const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                
                
                req.session.userId = userData._id;
                console.log(req.session.userId);
                res.redirect('/home')
            }else{

                res.render('login',{message:"email and password is incorrect"});
                }
            }else{
                res.render('login',{message:"sorry,you are blocked"})
            }
            
            
        }else{
           res.render('login',{message:"please provide your Email and Password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogout = async (req,res) => { 
    try{
        req.session.userId = null
        res.redirect('/')
    }catch(error){
        console.log(error.message);

    }
}

//mobileVerification

const loadMobileVerification = async(req,res)=>{
    try {
        res.render('loginMobile')
    } catch (error) {
        console.log(error.message);
    }
}

const mobileVerification = async(req,res)=>{
    try {
        const mobile = req.body.mobile;
        console.log(mobile);
        const check = await User.findOne({mobile:mobile})

        if(check){
            const otpResponse  = await client.verify.
                v2.services(TWILIO_SERVICE_SID)
                .verifications.create({
                    to:`+91${mobile}`,
                    channel:"sms"
                })
               
            res.render('otp',{message : mobile})

        }else{
            res.render('loginMobile',{message:"Did not register this mobile number"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//OTPVerification

const loadOtp = async(req,res)=>{
    try {
        res.render('otp',{message:9995218415})
    } catch (error) {
        console.log(error.message);
    }
}
const verifyOtp = async(req,res)=>{
    try{
        const num = req.body.mno
        const otp = req.body.otp
        const otpCode = otp.join('');
        console.log(otpCode);
        // console.log(otp);
        // console.log(otp+""+num);
        const verifiedResponse = await client.verify.
            v2.services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to:`+91${num}`,
                code:otpCode,
            })
                if(verifiedResponse.status=='approved'){
                    const num = req.body.mno
                    const userDetails =await User.findOne({mobile:num})
                    req.session.user = userDetails
                    console.log(req.session.user);
                    res.redirect('/home')
                    console.log("true otp");
                }else{
                    res.render('loginOtp',{message2:'incorect otp',message:num})
                    console.log("false otp");
                }
    }catch(error){
        console.log(error.message);
        console.log("veriftotp section");
    }
}

const landingPage = async(req,res) => {
    try{

        
        const category = await Category.find({})
        console.log(category);
        const product = await Product.find({unlist:false})
        const user = false
       
        const bannerData = await Banner.find({unlist:false})
       
        res.render('home',{user,product,category,bannerData,})
    
    }catch(error){
        console.log(error.message);
    }
}
//home

const loadHome = async(req,res)=>{
    try {
        if(req.session.userId){
            const userId = req.session.userId
            const userData = await User.findOne({_id : userId})
            const category = await Category.find({})
            console.log(category);
            const product = await Product.find({unlist:false})
            const user = true
           
            const bannerData = await Banner.find({unlist:false})
           
            res.render('home',{userData,user,product,category,bannerData,})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadProducts = async(req,res)=>{
    try {
        const category = await Category.find()
        res.render('products',{category})
    } catch (error) {
        console.log(error.message);
    }
}


const loadProduct_single = async(req,res)=>{
    try{
        const category = await Category.find()
        res.render('product-detail',{category})
    }catch(error){
        console.log(error.message);
    }
}


// const loadCategories = async(req,res)=>{
//     try {
//         const category = await Category.find({})
//         res.render('categories',{category})
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// const findCategoryProduct = async(req,res)=>{
//     try {
//         const ctryId = req.query.categoryId
//         const ctrypdt = await Category.find({category:ctryId});
//         console.log(ctrypdt);
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }



const loadPasswordRecovery = async(req,res)=>{
    try {
        res.render('account-password-recovery')
        
    } catch (error) {
        console.log(error.message);
    }
} 

const searchProducts = async(req,res)=>{
    try {

        let payload = req.body.payload.trim()
        console.log("gate4 = " +payload)

        let search =await Product.find({name:{$regex:new RegExp('^'+payload+'.*','i')}}).exec()
        console.log(search);
        search=search.slice(0,10)
        res.send({search})


    } catch (error) {
        console.log(error.message);
    }
}


const loadShop = async (req, res) => {
    try {
      const category = req.query.categoryId;
      const search = req.query.search || "";
      const sort = req.query.sort || "";
      console.log(category + " - " + search + " - " + sort);
      let isRender = false;
      let user = false
      if(req.session.userId){
        user=true
      }
      if (req.query.isRender) {
        isRender = true;
      }
  
      const searchData = new String(search).trim();
  
      const query = {
        is_delete: false,
      };
  
      let sortQuery = { price: 1 };
      if (sort == "high-to-low") {
        sortQuery = { price: -1 };
      }
  
      if (search) {
        query["$or"] = [
          { product_name: { $regex: ".*" + searchData + ".*", $options: "i" } },
        //   { description: { $regex: searchData, $options: "i" } },
        ];
      }
      console.log(category);
      if (category) {
 
            query["$or"] = [{ category: category }];
        
      }
  
      const product = await Product.find(query).sort(sortQuery);
  
      //console.log(product);
  
      const productsPerPage = 3;
      const page = req.query.page || 1;
      const startIndex = (page - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const pageProducts = product.slice(startIndex, endIndex);
      const totalPages = Math.ceil(product.length / productsPerPage);
      
      // -----------Category finding
      const categoryData = await Category.find({});
      
  
      // ----------------------
  
      if (isRender == true) {
        res.json({
          pageProducts,
          totalPages,
          currentPage: parseInt(page, 10),
          product,
          user,
          // cartCount,
          // wishListCount
        });
      } else {
        res.render("/shop", {
          pageProducts,
          totalPages,
          currentPage: parseInt(page, 10),
          product,
          categoryData,
          user,
        });
      }
    } catch (error) {
        res.render('users/500')
      console.log(error.message);
      console.log("------------------Product Page Section-----------");
    }
  };


module.exports={
    loadHome,
    loadProduct_single,
    loadLogin,
    loadRegister,
    verifyLogin,
    insertUser,
    loadOtp,
    loadMobileVerification,
    mobileVerification,
    verifyOtp ,
    // loadCategories,
    loadProducts,
    loadPasswordRecovery,
    landingPage,
    loadLogout,
    searchProducts,
    loadShop
    // findCategoryProduct
}



