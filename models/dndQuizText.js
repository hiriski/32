const mongoose = require('mongoose')

const DNDQuizTextSchema = new mongoose.Schema({
    question: String,
    description: String,
    textList: [
        {
            uuid: String,
            label: String,
            width: Number,
            isBlankText: Boolean,
            order: Number,
        },
    ],
    draggableList: [
        {
            uuid: String,
            label: String,
            correctPlaceId: String,
            order: Number,
        },
    ],
    explanation: String,
})

module.exports = mongoose.model('DNDQuizText', DNDQuizTextSchema)
