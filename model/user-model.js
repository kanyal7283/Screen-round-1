const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true
    },
    email: {
        type: String,
        default: "",
        required: true

    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'others'],
        required: true
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model("users", UserSchema);