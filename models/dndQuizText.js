const mongoose = require('mongoose')

const DNDQuizTextSchema = new mongoose.Schema({
    question: String,
    description: String,
    textList: [
        {
            uuid: String,
            label: String,
            width: Number,
            isAnswer: Boolean,
            order: Number,
        },
    ],
    draggableList: [
        {
            uuid: String,
            label: String,
            correctPlace: String,
            order: Number,
        },
    ],
    explanation: String,
})

module.exports = mongoose.model('DNDQuizText', DNDQuizTextSchema)
