const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseId : {
            type : String,
            required : true,
        },
        courseName : {
            type : String,
            required : true,
        },
        courseSlot : {
            type : String,
            required : true,
        },
        courseCredit : {
            type : String,
            required : true,
        },
    }
);

const course  = mongoose.model("courses" , courseSchema);
module.exports = course;
