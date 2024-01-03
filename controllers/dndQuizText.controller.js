const DNDQuizTextService = require('../services/dndQuizText.service')

exports.admin_create = async (req, res) => {
    const result = await DNDQuizTextService.admin_create(req.body)
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
}

exports.admin_findAll = async (req, res) => {
    const data = await DNDQuizTextService.admin_findAll(req)
    return res.json({
        data,
        message: 'Success.',
    })
}

exports.admin_findById = async (req, res) => {
    const data = await DNDQuizTextService.admin_findById(req)
    return res.json({
        data,
        message: 'Success.',
    })
}
