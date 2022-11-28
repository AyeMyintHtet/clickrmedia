const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const UserRole = require('../models/UserRole');
const {registerValidation, loginValidation}  = require('../validation');


router.get('/',async (req,res)=>{
    try {
        const allUser =await User.find();
        res.status(200).json(allUser);
    } catch (error) {
        res.status(400).json({message : 'Error Occured when fetching all User'})
    }
})

//router
router.post('/register', async (req,res)=>{
    //validate the data
    
    // console.log('req.body.userrole', req.body.userrole);
    const {error} =await registerValidation(req.body);
    if(error) return res.status(400).json({message:error.details[0].message});
    //check user already in database
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).json({message:'Email alredy exist'});
    // Hash the password 
    const  salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    const roleCheck = await UserRole.findOne({roleID : req.body.userrole});
    if(!roleCheck) return res.status(400).json({messagae:"role does not exist"})
    
    //create new User
    const user = new User({
        name: req.body.name,
        email:req.body.email,
        userrole:roleCheck.roleName,
        password:hashPassword
    })
    try {
        const savedUser = await user.save();
        res.status(200).send(savedUser);
    } catch (error) {
        res.status(400).json({message : error})
    }
})

router.post('/login',async (req,res)=>{
    const {error} =await loginValidation(req.body);
    if(error) return res.status(400).json({message:error.details[0].message});
    //check mail
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).json('Email or Password was wrong');
    //password correct 
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).json('Email or Password was wrong');
    //create assign token 
    const token = jwt.sign({_id : user._id}, process.env.TOKEN_SEC);
    res.header('auth-token',token).json({'auth-token':token,user,'status':'success'});

})

module.exports = router;