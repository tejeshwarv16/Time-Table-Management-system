const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
    {
        staffId : {
            type : String,
            required : true,
        },
        staffName : {
            type : String,
            required : true,
        },
        eMail : {
            type : String,
            required : true,
        },
        mobileNo : {
            type : String,
            required : true,
        },
        courses : {
            type : Array,
        }
    }
);

const staff  = mongoose.model("staffs" , staffSchema);
module.exports = staff;
