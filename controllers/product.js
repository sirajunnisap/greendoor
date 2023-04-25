const User = require('../models/userModel');
const Product = require('../models/productsModel') 
const Category = require('../models/categoryModel')
const fs = require('fs')
const path = require('path')
//products




const productList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.admin });
        const product= await Product.find({}).populate('category').exec()
        console.log(product);
        const category = await Category.find()
        if(product.quantity < 0){
            unlist == true
        }
        res.render("list-products", { product, user,category });
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
            image: req.file.filename,
            unlist : false
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
        // if(product){
            res.render('edit-product',{product,category})
        // }else{
        //     res.redirect('/admin/list-products')
        // }
        
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

// const updateProduct = async (req, res) => {
//     try {
//       const { id, name, price, description, quantity } = req.body;
  
//       const product = await Product.findByIdAndUpdate(
//         { _id: id },
//         {
//           $set: {
//             name: name,
//             price: price,
//             description: description,
//             quantity: quantity,
//           },
//         }
//       );
  
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
  
//       return res.status(200).json({ message: "Product updated successfully" });
//     } catch (error) {
//       console.log(error.message);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };
  
const updateImage = async(req,res)=>{
    try {
        const id = req.params.id
        console.log(id,"idparams");
        const proData = await Product.findOne({_id : id})
        const imglength = proData.image.length
        if(imglength <= 4){
            let images = []
            for(file of req.files){
                images.push(file.filename)
            }
            if(imglength+images.length <= 4){
                const updateData = await Product.updateOne({_id:id},{$addToSet:{image:{$each:images}}})
            }else{
                const product = await Product.findOne({_id : id})
                const category = await Category.find()
                res.render("edit-product",{product,category,imgfull:true})
            }
        }else{
            res.redirect('/admin/edit-product')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const deleteImage = async(req,res)=>{
    try {
        const imgid = req.params.imgid
        console.log(imgid,"imgdeleteid");
        const prodid = req.params.prodid
        console.log(prodid,"proddeleteimg");
        fs.unlink(path.join(__dirname,'../public/users/img/product-categories',imgid),()=>{})
        const productImg = await Product.updateOne({_id:prodid},{$pull:{image:imgid}})
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
        const user = req.session.userId
        const product = await Product.findOne({_id:id})
        const category = await Category.find()
       if(product){
        res.render('product-detail',{product,category,user})
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
            const userData = req.session.userId
            const user = req.session.userId
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
            const category = await Category.find()
            const product = await Product.findOne({})
            if(product.unlist == false){
                res.render('products',{categoryData,productData,countProduct,user,category,userData})
            }
            // res.render('products',{categoryData,productData,countProduct,user,category,userData})
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadShopCategory = async (req,res) =>{
    try{

        const userData = req.session.userId
        
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
            const category = await Category.find()
            res.render('categories',{productCate,categoryData,user,countProduct,category,userData})

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
        const category = await Category.find()
       
        res.render('categories',{productCate,categoryData,user,countProduct,category})

        }
        

    }catch(error){

        console.log(error.message);
    }
}
const viewProduct = async (req, res) => {
    try {
      const category = req.query.categoryId;
      const search = req.query.search || "";
      const sort = req.query.sort || "";
      console.log(category + " - " + search + " - " + sort);
      let isRender = false;
  
      if (req.query.isRender) {
        isRender = true;
      }
  
      const searchData = new String(search).trim();
      console.log(searchData);
  
      const query = {
        is_delete: false,
      };
  
      let sortQuery = { price: 1 };
      if (sort == "high-to-low") {
        sortQuery = { price: -1 };
      }
  
      if (search) {
        query["$or"] = [
          { name: { $regex: ".*" + searchData + ".*", $options: "i" } },
          { description: { $regex: searchData, $options: "i" } },
        ];
      }
  
      if (category) {
        query["$or"] = [{ mainCategory: category }];
      }
  
      const product = await Product.find(query).sort(sortQuery);
  
      //console.log(product);
  
      const productsPerPage = 5;
      const page = req.query.page || 1;
      const startIndex = (page - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const pageProducts = product.slice(startIndex, endIndex);
      const totalPages = Math.ceil(product.length / productsPerPage);
  
      // -----------Category finding
      const categoryData = await Category.find({});
  
      // ----------------------
      const user = req.session.userId
      const productData = await Product.find()

      if (isRender == true) {
        res.json({
          pageProducts,
          totalPages,
          currentPage: parseInt(page, 10),
          product,
          user,
          productData,
          cartCount,
          // wishListCount
        });
      } else {
        res.render("productsearch", {
          pageProducts,
          totalPages,
          currentPage: parseInt(page, 10),
          product,
          categoryData,
          user,
          productData
        });
      }
    } catch (error) {
      console.log(error.message);
     
    }
  };





const loadCheckout = async(req,res)=>{
    try {
       
        const userId = req.session.userId
        console.log(userId,"checkout");
        const userData = await User.findOne({_id :userId}).populate('cart.product').exec()
        const cart = await User.find({_id : userId})
       console.log("checkout");

            res.render('checkout')
        
       

    } catch (error) {

        console.log(error.message);
    }
}

const searchProducts = async(req,res)=>{
    try {
        const search = req.body.search
        const productData = await Product.find({"name":{$regex: ".*"+search+".*"}});
        if(productData){
            res.render('products')
        }
    } catch (error) {
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
    loadProducts,
    loadCheckout,
    viewProduct,
    updateImage,
    deleteImage,
    searchProducts,
    

}