const mongoose = require('mongoose');

const stausSchema = mongoose.Schema({
    statusID:{
        type:Number,
        required:true,
        unique:true
    },
    statusName:{
        type:String,
        required:true,
        unique:true
    }
})
module.exports =mongoose.model('TicketStatus',stausSchema)