const express = require('express');
const router = express.Router();

const userRole = require('../models/UserRole');

router.get('/', async(req,res)=>{

    try {
        const allRole = await userRole.find();
        res.status(200).json(allRole);

    } catch (error) {
        res.status(400).json({message:error});
    }
})

router.post('/', async(req,res)=>{

    const userRoles = new userRole({
        roleID : req.body.roleID,
        roleName : req.body.roleName
    })
    
    try {
        const userRolesaved =await  userRoles.save()
        res.status(200).json(userRolesaved);
    } catch (error) {
        res.status(400).json({message : 'Something went wrong'})
    }

})

router.delete('/:roleID', async (req,res)=>{

    try {
        await  userRole.remove({roleID:req.params.roleID})
        res.status(200).json({message:'Role successfully deleted'})

    } catch (error) {
        res.status(400).json({message : error})

    }
})

module.exports = router;