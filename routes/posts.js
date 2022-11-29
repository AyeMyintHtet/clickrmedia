const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const TicketStatus = require('../models/TicketStatus'); 

const verify = require('./verifyToken');


//Post a Ticket
router.post('/', verify,async (req,res)=>{
    //validation
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).json({message: 'UserID does not exist on our Database'});
    
    const statusID = req.body.statusID || 4;
    
    const status = await TicketStatus.findOne({statusID: statusID});
    
    if(!status) return res.status(400).json({message : 'Ticket status does not exists'});
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        email: req.body.email,
        statusName: status.statusName
    });
    
    try {
        const savedTicket = await post.save();
        res.status(200).json(savedTicket);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Get Ticket By ID
router.get('/:usermail',verify,async (req,res)=>{
    
    try {
        const user = await User.find({email:req.params.usermail});
    
        if(user[0].userrole === 'Leader'){
            const specificTicketForUser = await Post.find({statusName:'Pending'});
            res.status(200).json(specificTicketForUser); 
        
        }else if(user[0].userrole === 'SuperVisor'){
            const specificTicketForUser = await Post.find({statusName:'Unseen'});
            res.status(200).json(specificTicketForUser); 
        
        }else{
            const specificTicketForUser = await Post.find({email:req.params.usermail});
           res.status(200).json(specificTicketForUser);
        }

    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})

//Get all the Ticket
router.get('/',verify, async (req,res)=>{

    try {
        const allTicket = await Post.find();
        res.status(200).json(allTicket);

    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Delete Ticket
router.delete('/:postID',verify,async (req,res)=>{

    try {        
        const specificTicket = await Post.findById(req.params.postID);
    
        await Post.remove({_id:req.params.postID});
        res.status(200).json({message : `Your Ticket name "${specificTicket.title}" has been deleted.`})
    
    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})
// Update Ticket 
router.patch('/:postID',verify,async (req,res)=>{

    try {        

        const status = await TicketStatus.findOne({statusID: req.body.statusID||4});
        if(!status) return res.status(400).json({message : 'Ticket status does not exists'});

        await Post.updateOne({_id:req.params.postID},
            {$set : {
                title:req.body.title,
                description:req.body.description,
                statusName: status.statusName
            }
        })
        res.status(200).json({message : 'Your ticket has been updated'})

    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})
module.exports = router;