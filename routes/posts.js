const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verify = require('./verifyToken');

//Get all the Ticket
router.get('/',verify, async (req,res)=>{
    try {
        const allTicket = await Post.find();
        res.status(200).json(allTicket);
    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Post a Ticket
router.post('/', async (req,res)=>{
    const post = new Post({
        title: req.body.title,
        description: req.body.description 
    });

    try {
        const savedTicket = await post.save();
        res.status(200).json(savedTicket);
    } catch (error) {
        res.status(400).json({message: error})
    }

})
// Get Ticket By ID
router.get('/:postID',async (req,res)=>{
    try {
        const specificTicket = await Post.findById(req.params.postID);
        res.status(200).json(specificTicket)
    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})

//Delete Ticket
router.delete('/:postID',async (req,res)=>{
    try {        
        const specificTicket = await Post.findById(req.params.postID);
        const removeTicket = await Post.remove({_id:req.params.postID});
        res.status(200).json({message : `Your Ticket name "${specificTicket.title}" has been deleted.`})
    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})
// Update Ticket 
router.patch('/:postID',async (req,res)=>{
    try {        
        await Post.updateOne({_id:req.params.postID},
            {$set : {
                title:req.body.title,
                description:req.body.description
            }
        })
        res.status(200).json({message : 'Your ticket has been updated'})
    } catch (error) {
        res.status(400).json({message:`This ID (${error.value}) does not exist in our database!`})
    }
})
module.exports = router;