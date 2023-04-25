const User = require('../models/userModel')

const showProfile = async(req,res)=>{
    try {
        
         const user = req.session.userId
         console.log(user);
            const userData = await User.findOne({_id : user})
           console.log(userData);
            res.render('profile',{userData,user})
            
       
    } catch (error) {
        console.log(error.message);
    }
}

const updateUserData = async(req,res) => { 
    try{
        const userId = req.session.userId
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile
        const updateUser = await User.findByIdAndUpdate({_id:userId},{$set:{name:name,email:email,mobile:mobile}})
        res.redirect('/profile')

    }catch(error){ 
       
        console.log(error.message);
    }
}

const showAddress = async(req,res)=>{
    try {
        
        const userId = req.session.userId
        console.log(userId,"id");
        const user = await User.findOne({_id : userId})
        console.log(user,"data");

        res.render('address',{user})
    } catch (error) {
       console.log(error.message); 
    }
}

const add_address = async (req, res) => {

    try {

        const id = req.session.userId
        if(req.body.name.trim()!= "" && req.body.mobile.trim() !="" && 
        req.body.pincode.trim() !="" &&  req.body.state.trim() !="" && 
        req.body.place.trim() !=""   && req.body.address.trim() !="" && 
         req.body.house_no.trim() !=""  
        ){
            const address = await User.updateOne({ _id: id }, {
                $push: {
                    address : {
                        name: req.body.name,
                        mobile: req.body.mobile,
                        pincode: req.body.pincode,
                        state: req.body.state,
                        place: req.body.place,
                        house_no: req.body.house_no,
                        address: req.body.address
                       
    
    
                    }
                }
            })
        }
       
        res.redirect('/address')



    } catch (error) {
        res.render('500');
    console.log(error.message);
    }
}


const edit_address = async(req,res)=>{
    try {
        const id = req.session.userId
        const address_id = req.body.id
        console.log(address_id);
        const name = req.body.name
        console.log(name);
        const mobile = req.body.mobile
        console.log(mobile);
        const address = req.body.address
        console.log(address);
        const pincode = req.body.pincode
        console.log(pincode);
        const place = req.body.place
        console.log(place);
        const state = req.body.state
        console.log(state);
        const house_no = req.body.house_no
        console.log(house_no);
        

        
        const data =  await User.updateOne({_id : id, 'address._id': address_id },{
                $set:

                 {
                         "address.$.name": name,
                         "address.$.mobile": mobile,
                         "address.$.address": address,
                         "address.$.place": place,
                         "address.$.state": state,
                         "address.$.pincode": pincode,
                         "address.$.house_no": house_no

                }})
                // .then((res)=>{
                //     res.json({success:true})
                // })


               
                // return res.json({success:true});// Send response with res.json()
                     return  res.redirect('/address')
    } catch (error) {
        console.log(error.message);
        //Handle error response
        res.json({success:false,message:error.message})
    }
}

const deleteAddress = async(req,res)=>{
    try {
        const id = req.session.userId
        const address = req.body.address
        const data = await User.updateOne({_id :id},{$pull:{address : { _id : address}}})
        res.json({success : true})

    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    showProfile,
    updateUserData,
    showAddress,
    add_address,
    deleteAddress,
    edit_address
    
   
   
   

}