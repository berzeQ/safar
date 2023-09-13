const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const uploadImage = async (req, res) => {
res.json({
  msg: "image uploaded"
})
}
const registerNewUser = async (req, res) => {

    const userExist = await User.exists({phoneNumber:req.body.phoneNumber})
    if(userExist){
        res.status(409).json({msg: "Phone Number already exists"})
    }else{

        const hashPass = await bcrypt.hash(req.body.password, saltRounds)
        req.body.password= hashPass
        req.body.role ='User'

        const data = await User.create(req.body)
        if(data){
         res.json({msg: "User registered successfully"})
        }
    }
   
    }

  




    const loginUser=  async (req, res) => {
  // 1. phonenumber exist
        const data = await User.findOne({phoneNumber:req.body.phoneNumber})
        console.log(data)
        if(!data){
             return res.status(404).json({msg: "user not found"})
            }else{
                  // 2. password matches
              const isMatched = await bcrypt.compare( req.body.password,data.password )
              if(isMatched){
                const token = jwt.sign({ phoneNumber: req.body.phoneNumber }, process.env.SECRET_KEY);
                res.json({isLoggedIn : true, msg: "Login successful",token, userInfo:data}) 
              }else{
                res.status(401).json({msg : "creds error"}) 
          }
      }
    }


    

const updateUserDetailsById=  async (req, res) => {
  console.log(req.body)
   const data= await User.findByIdAndUpdate(req.params.id, req.body)
   if(data){
     res.json({
       msg: "User details edited"
     })
   }
   }

   const deleteUserById =  async (req, res) => {
    await User.findByIdAndDelete(req.params.id, req.body)
     }

    const getUserById = async (req, res) => {
    const data=  await User.findById(req.params.id)
    if(data){
      res.json({userDetails:data})
    }
  
    }

module.exports = {loginUser, uploadImage,registerNewUser,updateUserDetailsById,deleteUserById,getUserById}