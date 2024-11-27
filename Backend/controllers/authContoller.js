const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const Task = require('../models/tasks')
const bcrypt = require('bcrypt')
// import { nanoid } from 'nanoid'

const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')
// const { use } = require('../router/userRoute')
// const nanoid  = require('nanoid')

// const generateUsername =async(email)=>{
//     let username=email.split('@')[0];

//     let isusernameNotunique=await User.exists({"personal_info.username":username}).then((result)=>result)

//     isusernameNotunique ?username+=nanoid().substring(0,5):"";

//     return username

// }

// const formateData=(user)=>{
//        const access_token=jwt.sign({id:user._id},process.env.JWT_SECRET)
//        return {
//         access_token,
//         profile_img:user.profile_img,
//         email:user.email,
//         fullname:user.fullname
//        }
// }
const formateDataforuser=(user)=>{
       const access_token=jwt.sign({id:user._id},process.env.JWT_SECRET)
       return {
        access_token,
        profile_img:user.profile_img,
        email:user.email,
        fullname:user.fullname,
        role:user.role,
        id:user._id
      
       }
}
const formateDataforadmin=(user)=>{
       const access_token=jwt.sign({id:user._id},process.env.JWT_SECRET)
       return {
        access_token,
        profile_img:user.profile_img,
        email:user.email,
        fullname:user.fullname,
        id:user._id,
        role:user.role

       }
}


exports.AdminSignup= async(req,res)=>{
    try{
        let {fullname,email,password}=req.body
    
        if(!email || !password || !fullname){
            return res.status(400).json({
                success:false,
                message:"Please Enter All field"
            })
    
        }
        if(fullname.lenght<3){
            return res.status(401).json({
                success:false,
                message:"Full name must be greater than 3 letter"
            })
    
        }
        let existinguser= await Admin.findOne({"email":email})
        let existinguser2= await User.findOne({"email":email})
        // const existinguser = await User.findOne({email})

        if(existinguser || existinguser2){
            return res.status(400).json({
                success:false,
                message:"This email is already resistured with us please login or use another email"
            })
     
        }

        let hashpassword = await bcrypt.hash(password,10)

        const admin = await new Admin ({
                fullname,email,password:hashpassword
        }).save()

        let sendData=formateDataforadmin(admin)

        return res.status(200).json({
            success:true,
            message:"Admin signup success",
            sendData

        })
    }
    catch(e){
        console.log(e)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating registration",

        })
    }
 
}
exports.createUser= async(req,res)=>{
    try{
        let {fullname,email,password}=req.body
console.log(fullname,email,password)
let adminId=req.user?.id;
console.log(req.user)
console.log(adminId,"tryt")

        if(!email || !password || !fullname){
            return res.status(400).json({
                success:false,
                message:"Please Enter All field"
            })
        }
        if(fullname.lenght<3){
            return res.status(401).json({
                success:false,
                message:"Full name must be greater than 3 letter"
            })
    
        }
        let existinguser= await Admin.findOne({"email":email})
        let existinguser2= await User.findOne({"email":email})
        // const existinguser = await User.findOne({email})

        if(existinguser || existinguser2){
            return res.status(400).json({
                success:false,
                message:"This email is already resistured with us please login or use another email"
            })
     
        }

        let hashpassword = await bcrypt.hash(password,10)
        
        const user = await new User ({
                fullname,email,password:hashpassword
        }).save()
        const admin = await Admin.findByIdAndUpdate(
            adminId, // Assuming the Admin's ID is passed in the request body
            { $push: { allusers: user._id } }, // Push the new task ID into the alltasks array
            { new: true } // Return the updated Admin document
        );
        // let sendData=(admin)

        return res.status(200).json({
            success:true,
            message:"User creation success",
            // sendData

        })
    }
    catch(e){
        console.log(e)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating registration",

        })
    }
 
}

exports.fetchalluserOfAdmin=async(req,res)=>{   
    let adminId=req.user?.id;
try{
    let admin = await Admin.findById(adminId).populate('allusers')
    if(!admin){
        return res.status(404).json({error:"Admin not found"})
    }
    return res.status(200).json({users:admin.allusers})
}
catch(err){
    console.log(err)
    return res.status(500).json({error:"Some error occured while fetching users"})
}
}

    

exports.signIn=async(req,res)=>{
    try{
        const{email,password,role}= req.body;
    
        if(!email || !password || !role){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        let data;
        if(role==="user"){
            data= await User.findOne({"email":email})
            
        }else{
            data= await Admin.findOne({"email":email})

        }

        if(!data){
            return res.status(400).json({
                success:false,
                message:"This user is not registered"
            })

        }

        const match = await bcrypt.compare(password,data.password);
        if(!match){
            return res.status(400).json({
                success:false,
                message:"Password Incorrect"
            })

        }

        //// const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        // const token = await jwt.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn:'7d'})

        // console.log(user)
        
        // user = user.toObject();
        
        // user.password=undefined;
        // console.log(user)
         let sendData;

         if(role=="user"){
             sendData=formateDataforuser(data)
             
            }else{
                
                sendData=formateDataforadmin(data)
         }

        return res.status(200).json({
            success:true,
            message:"User login success",
           sendData
        })

    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error while login"
        })
    }
}
exports.changePassword=async(req,res)=>{
      let {currentPassword,newPassword}=req.body;
    //   console.log(currentPassword,newPassword)
      let userId=req.user.id;
      if(!currentPassword || !newPassword){
        return res.status(403).json({error:"Please fill all field"})
    }

    User.findOne({_id:userId})
    .then((user)=>{
        if(user.google_auth){
            return res.status(403).json({error:"You can't change account password"})
        }

         bcrypt.compare(currentPassword,user.personal_info.password,(err,result)=>{
            if(err){
                return res.status(500).json({error:"Something went wromg while change password"})
            }
            if(!result){
                return res.status(403).json({error:"Incorrect current password"})
            }
            bcrypt.hash(newPassword,10,(err,hashed_password)=>{
              User.findOneAndUpdate({_id:userId},{"personal_info.password":hashed_password})
              .then((u)=>{
                return res.status(200).json({status:"password changed"})
              })
              .catch(err=>{
                return res.status(500).json({error:"Some error occured while saving new password"})
              })
            })
         })

    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:"User not found"})
    })
}


exports.deleteuser=async(req,res)=>{
    try {
        const userId = req.params.id; // Extract user ID from request parameters

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all tasks assigned to the user
        const taskDeletionResult = await Task.deleteMany({ _id: { $in: user.alltasks } });

        // Delete the user
        const userDeletionResult = await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: 'User and associated tasks deleted successfully',
            tasksDeleted: taskDeletionResult.deletedCount,
            userDeleted: !!userDeletionResult,
        });
    } catch (error) {
        console.error('Error deleting user and tasks:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the user and tasks', error });
    }
}

// exports.uploadData=async(req,res)=>{
//     console.log(req.user)
//        res.send(req.body)
// }