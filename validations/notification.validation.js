const Joi = require('joi')

module.exports = {
    sendGeneralNotification: Joi.object()
        .keys({
            title: Joi.string(),
            body: Joi.string(),
            imageUrl: Joi.string().allow(null),
            // userIds: Joi.array(Joi.string()).required(),
            users: Joi.array()
                .items({
                    userId: Joi.string().required(),
                    email: Joi.string().required(),
                    displayName: Joi.string().required(),
                })
                .required()
                .min(1),
        })
        .options({ allowUnknown: true }),

    sendNotification: Joi.object()
        .keys({
            token: Joi.string().required(),
            title: Joi.string().required(),
            body: Joi.string().required(),
        })
        .options({ allowUnknown: true }),
}