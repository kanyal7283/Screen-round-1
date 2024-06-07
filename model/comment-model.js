const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
},
    text: {
        type: String,
        default: "",
        required: true

    },
    status: {
        type: Boolean,
        default: true
    },
    commentDate:{
        type:Date,
        default:Date.now()
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model("comments", CommentSchema);