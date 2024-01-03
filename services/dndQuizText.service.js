const DNDQuizTextModel = require('../models/dndQuizText')

exports.admin_create = body => {
    return DNDQuizTextModel.create(body)
}

exports.admin_findAll = async filters => {
    return await DNDQuizTextModel.find(filters)
}

exports.admin_findById = async id => {
    return await DNDQuizTextModel.findById(id)
}
