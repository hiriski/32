const NotificationService = require('../services/notification.service')

exports.sendNotifications = async (req, res, next) => {
    const result = await NotificationService.sendAndSaveNotification({
        userId: req.user._id,
        title: req.body.title,
        body: req.body.body,
        type: req.body.type,
        dataId: req.body.dataId,
    })

    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to send notification' })
}

exports.getNotifications = async (req, res, next) => {
    const result = await NotificationService.getNotificationList({
        userId: req.user._id,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to get notification' })
}

// admin get notifee user
exports.admin_getNotifeeUsers = async (req, res, next) => {
    const result = await NotificationService.admin_getNotifeeUsers()

    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed get users' })
}

// admin send general notification
exports.admin_sendGeneralNotification = async (req, res, next) => {
    const result = await NotificationService.admin_sendGeneralNotification({
        users: req.body.users || [],
        title: req.body.title || '',
        body: req.body.body || '',
        imageUrl: req.body.imageUrl || null,
    })
    if (result) {
        return res.json({
            message: 'Success',
            data: result,
        })
    }
    return res.status(400).json({ message: 'Failed to send notification' })
}