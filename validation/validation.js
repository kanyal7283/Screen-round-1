const Joi = require('joi');

module.exports = {
    registerSchema: () => {
        return Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            gender: Joi.string().valid("Male", "Female", "Others").required()
        });
    },
    commentAddSchema: () => {
        return Joi.object().keys({
            userId: Joi.string().required(),
            text: Joi.string().required(),
        });
    },
    replycommentAddSchema: () => {
        return Joi.object().keys({
            userId: Joi.string().required(),
            commentId: Joi.string().required(),
            text: Joi.string().required(),
        });
    },

    commentUpdateSchema: () => {
        return Joi.object().keys({
            commentId: Joi.string().required(),
            text: Joi.string().optional(),
        });
    },

    replycommentUpdateSchema: () => {
        return Joi.object().keys({
            replyId: Joi.string().required(),
            text: Joi.string().optional(),
        });
    },


    commentDeleteSchema: () => {
        return Joi.object().keys({
            commentId: Joi.string().required(),
        });
    },

    replycommentDeleteSchema: () => {
        return Joi.object().keys({
            replyId: Joi.string().required(),
        });
    },

    commentListSchema: () => {
        return Joi.object().keys({
            userId: Joi.string().optional(),
            page: Joi.string().optional(),
            limit: Joi.string().optional(),
            search: Joi.string().optional(),
        });
    }
}