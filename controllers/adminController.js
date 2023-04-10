
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
    try {
        
        const passwordMatch = await bcrypt.hash(password,10);
        return passwordMatch;

    } catch (error) {
        console.log(error.message);
    }
}

//login

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
        const password =req.body.password;

        const userData = await User.findOne({email : email});

        if(userData){
            
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('login',{message:"Email and Password is incorrect ,not an admin"});
                }else{
                    req.session.admin = userData._id;

                    res.redirect('/admin/dashboard')
                }
            }else{
                res.render('login',{message:"Email and Password is incorrect"})
            }
        }else{
            res.render('login',{message:"Please provide your Email and Password "})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


//dashboard

const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id : req.session.admin});
        res.render('dashboard',{admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}


//users

// const loadUserdetails = async(req,res)=>{
//     try { 
//         const userData = await User.find({is_admin:0});
//         res.render('list-users',{users : userData});
//     } catch (error) {
//         console.log(error.message);
//     }
// }


const user_details = async (req,res) => {

    try {
        const userData = await User.find({is_admin:0})
        res.render('list-users',{users :userData });
        
    } catch (error) {

        console.log(error.message);
    }
}


const blockUser = async(req,res)=>{
    try {
        const userId = req.query.id
        const userData = await User.findOne({_id : userId})
        if(userData.block == false){
            const block = await User.updateOne({_id : userId},{$set : {block : true}})
            req.session.user_id = false
            res.redirect('/admin/list-users')
        }else{
            const unblock = await User.updateOne({_id : userId},{$set :{block : false}})
            req.session.user_id = true
            res.redirect('/admin/list-users')
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}












module.exports = {
    loadDashboard,
    loadLogin,
    verifyLogin,
    user_details,
    blockUser
}