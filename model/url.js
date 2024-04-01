const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
    fullurl:{
        type : String,
        required : true
    },
    shorturl : {
        type:String,
        required : true,
        unique : true
    },
    clicks : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('Url',createSchema) ;