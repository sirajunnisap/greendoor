const Category = require('../models/categoryModel');
const User = require('../models/userModel')


//category 


const listcategories = async(req,res)=>{
    try {
        const category = await Category.find()
        res.render('list-categories',{category})
    } catch (error) {
        console.log(error.message);
    }
}
const loadAddCategories = async(req,res)=>{
    try {

        const user= await User.findOne({_id : req.session.admin})
        res.render('add-category',{user})
    } catch (error) {
        console.log(error.message);
    }
}


const addCategories = async (req,res)=>{
    try{
        if(req.body.name=='' || req.body.description==''){
            res.render('add-category',{message:'fill all field'})

        }else{
        const cat = req.body.name
        const catUP = cat.toUpperCase()
        let exist = await Category.findOne({name:catUP})
        if(exist){
            res.render('add-category',{message:'This Category already Exist'})
            exist=null
        }else{
            const category = new Category({
                name:catUP,
                description:req.body.description,
                image:req.file.filename
            })
            const categoryData = await category.save()
            if(categoryData){
                res.render('add-category',{message2:'category insert successfully'})
            }else{
                res.render('add-category',{message:'category did not inserted'})
            }
        }
    }
    }catch(error){
        res.render('admin/500')
        console.log(error.message);
    }
}



const listCategories = async(req,res)=>{
    try {
        const user = await User.findOne({_id : req.session.admin})
        const category = await Category.find();
        res.render('categories',{category,user})
    } catch (error) {
        console.log(error.message);
    }
}

const editCategories = async(req,res)=>{
    try {
        const user = await User.find({_id : req.session.admin})
         const id = req.query.id
        const category = await Category.findOne({_id:id})
        if(category){
            res.render('edit-category',{category,user})
        }else{
            res.redirect('/admin/list-categories')
        }
       
        
    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async(req,res)=>{
    try {
        const category = await Category.findByIdAndUpdate({_id : req.body.id},
            {$set:{
                name: req.body.name , 
                description : req.body.description , 
                image: req.body.imag 
            
            }});

        // res.render('edit-category',{category,message:"success"})
        res.redirect('/admin/list-categories')

    } catch (error) {
        console.log(error.message);
    }
}



// const deleteCatagories = async(req,res)=>{
//     try {
//         const id = req.query.id;
        
//         await Category.deleteOne({_id : id});
        
//         res.redirect('/admin/list-categories')

      
//     } catch (error) {
//         console.log(error.message);
//     }
// }


const unlistCategory = async(req,res)=>{
    try {
        const id = req.query.id
        const ctyData = await Category.findOne({_id : id})
        if(ctyData.unlist == false){
            const unlist = await Category.updateOne({_id : id},{$set : {unlist : true}})
            res.redirect('/admin/list-categories')
        }else{
            const list = await Category.updateOne({_id : id},{$set :{unlist : false}})
            res.redirect('/admin/list-categories')
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}


module.exports = {
    listCategories,
    loadAddCategories,
    addCategories,
    editCategories,
    updateCategory,
    unlistCategory,
    listcategories
}