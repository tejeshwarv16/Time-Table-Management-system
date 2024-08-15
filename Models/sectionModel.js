const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
    {
        sectionId : {
            type : String,
            required : true,
        },
        year : {
            type : String,
            required : true,
        },
        semester : {
            type : String,
            required : true,
        },
        roomNo : {
            type : String,
            required : true,
        },
        incharge : {
            type : Object,
            required : true,
        },
        students : {
            type : Array,
            required : true,
        },
        courses : {
            type : Array,
            required : true,
        }
    }
);

const section  = mongoose.model("sections" , sectionSchema);
module.exports = section;
