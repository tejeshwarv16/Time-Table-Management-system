const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        studentId : {
            type : Object,
            required : true,
        },
        studentName : {
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
        sections : {
            type : Array,
        }
    }
);

const student  = mongoose.model("students" , studentSchema);
module.exports = student;
