const express = require('express');
const router = express.Router();
const TicketStatus = require('../models/TicketStatus');

//get All
router.get('/', async (req,res)=>{
    try {

        const allStatus = await TicketStatus.find()
        res.status(200).json(allStatus);
    } catch (error) {
        res.status(400).json({message : error})
    }
})

router.post('/', async (req,res)=>{

    const ticketPost = new TicketStatus({
        statusID : req.body.statusID,
        statusName : req.body.statusName
    })
    
    try {
        const savedTicket =await  ticketPost.save()
        res.status(200).json(savedTicket);

    } catch (error) {
        res.status(400).json({message : 'Something went wrong'})
    }
})

router.delete('/:ticketID', async (req,res)=>{
    try {
        await  TicketStatus.remove({statusID:req.params.ticketID})
        res.status(200).json({message:'Ticket successfully deleted'})

    } catch (error) {
        res.status(400).json({message : error})
    }
})

module.exports = router;