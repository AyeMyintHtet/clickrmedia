const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
    roleID:{
        type:Number,
        required:true,
        unique:true
    },
    roleName:{
        type:String,
        required:true,
        unique:true
    }

})
module.exports = mongoose.model('userRole', userRoleSchema)