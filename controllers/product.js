const User = require('../models/userModel');
const Product = require('../models/productsModel') 
const Category = require('../models/categoryModel')

//products




const productList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.admin });
        const product= await Product.find({}).populate('category').exec()
        console.log(product);
        res.render("list-products", { product, user });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};

const loadAddProduct = async (req, res) => {
    try {
        const user = req.session.admin;
        const category = await Category.find();

        res.render("add-product", { category, user });
    } catch (error) {

        res.render('500');
        console.log(error.message);
    }
};
const addproducts = async (req, res) => {
    try {
        if(req.body.name.trim()!= "" && req.body.category.trim()!= "" && req.body.price > 0 && req.body.quantity > 0 && req.body.description.trim()!= ""){
        //     const image = [];
        // for (file of req.files) {
        //     image.push(file.filename);
        // }
        
        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            image: req.file.filename
        });

        const result = await product.save();

        if (result) {
            res.redirect("/admin/list-products");
        } 
        }else{
     
        }
        
    } catch (error) {

        console.log(error.message);
    }
};


const editProducts = async(req,res)=>{
    try {
        const id = req.query.id
        const product = await Product.findOne({_id:id}).populate('category')
        const category = await Category.find()
        if(product){
            res.render('edit-product',{product,category})
        }else{
            res.redirect('/admin/list-products')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const updateProduct = async(req,res)=>{
    try {

        
           
        
        
            const product = await Product.findByIdAndUpdate({_id : req.body.id},
                {$set:{
    
                    name:req.body.name,
                    price:req.body.price,
                    description:req.body.description,
                    quantity:req.body.quantity
                }}) 
        
            
        
        //  res.render('edit-product',{product,message:"success"})
    
           res.redirect('/admin/list-products')
        
    } catch (error) {
        console.log(error.message);
    }
}

const unlistProduct = async(req,res)=>{
    try {
        const id = req.query.id
        const pdtData = await Product.findOne({_id : id})
        if(pdtData.unlist == false){
            const unlist = await Product.updateOne({_id : id},{$set : {unlist : true}})
            res.redirect('/admin/list-products')
        }else{
            const list = await Product.updateOne({_id : id},{$set :{unlist : false}})
            res.redirect('/admin/list-products')
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}


const productDetail = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.findOne({_id:id})
       if(product){
        res.render('product-detail',{product})
       }
        
    } catch (error) {
        console.log(error.message);
    }
}



// const product_view = async(req,res)=>{
//     try {
//         const category =await Category.find()
//         const product = await Product.find()

        
           
//         res.render('products',{product,category})
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadProducts = async(req,res)=>{
    try {
        if(req.session.userId){
            const user = true
            let page = 1
            if(req.query.page){
                page = req.query.page
            }
            let limit = 3

            const categoryData = await Category.find()
            const productData = await Product.find()
                .limit(limit*1)
                .skip((page-1)*limit)
                .exec()
            
            const productCount = await Product.find().countDocuments()
            let countProduct = Math.ceil(productCount/limit)
            
            res.render('products',{categoryData,productData,countProduct,user})
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadShopCategory = async (req,res) =>{
    try{
        if(req.session.userId){
            const user = true
            const catId=req.params.id
                let page = 1
            if(req.query.page){
                page = req.query.page
            }
            let limit = 3

            
            const productCate = await Product.find({category:catId})
                .limit(limit*1)
                .skip((page - 1)* limit)
                .exec()
            const productCount = await Product.find({category:catId}).countDocuments()
            let countProduct = Math.ceil(productCount/limit)
            const categoryData = await Category.find()
            res.render('categories',{productCate,categoryData,user,countProduct})

        }else{
            const user = false
            const catId=req.params.id
            let page = 1
            if(req.query.page){
                page = req.query.page
            }
            let limit = 3

            
            const productCate = await Product.find({category:catId})
                .limit(limit*1)
                .skip((page - 1)* limit)
                .exec()
            const productCount = await Product.find({category:catId}).countDocuments()
            let countProduct = Math.ceil(productCount/limit)
        const categoryData = await Category.find()
       
        res.render('categories',{productCate,categoryData,user,countProduct})

        }
        

    }catch(error){

        console.log(error.message);
    }
}
module.exports = {
    loadAddProduct,
    productList,
    // product_view,
    addproducts,
    editProducts,
    updateProduct,
    unlistProduct,
    productDetail,
    loadShopCategory,
    loadProducts
}