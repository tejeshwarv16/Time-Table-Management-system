const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        eMail : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true,
        },
        role : {
            type : String,
        },
        type :{
            type : String,
            required : true,
        }
    }
);

const account  = mongoose.model("accounts" , accountSchema);
module.exports = account;
