const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        roomNo : {
            type : String,
            requied : true,
        },
        slots : {
            type : Array,
        }
    }
);

const room  = mongoose.model("rooms" , roomSchema);
module.exports = room;
