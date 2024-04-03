const mongoose = require("mongoose");

const result_according_to_sem = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    semester:{
        type:String,
        required:true,
    },
    sgpa:{
        type:String,
        required:true,
    }
}
);

const sem_result_all = mongoose.model("result_according_to_sem", result_according_to_sem);
module.exports = sem_result_all;

