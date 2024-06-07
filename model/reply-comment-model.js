const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentReplySchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
},
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "comments",
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
    commentDate: {
        type: Date,
        default: Date.now()
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model("comment_replies", CommentReplySchema);