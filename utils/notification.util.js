const admin = require('firebase-admin')

const sendNotification = async ({ token, title, body, data }) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid FCM token provided')
        }
        const message = {
            notification: {
                title: title,
                body: body,
            },
            data: data || {},
            android: {
                notification: {
                    sound: 'Default',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'Default',
                    },
                },
            },
            token: token,
        }
        const response = await admin.messaging().send(message)
        return response
    } catch (error) {
        console.error('Error sending message:', error.message)
        throw error
    }
}
module.exports = { sendNotification }
