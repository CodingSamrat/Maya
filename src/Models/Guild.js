const {Schema, model} = require('mongoose');

const schema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: '!',
    },
    notificationChannelId: {
        type: String,
        default: null,
    },
    welcomeChannelId: {
        type: String,
        default: null,
    },
    autoRoleId: {
        type: String,
        default: null,
    },
    birthdayChannelId: {
        type: String,
        default: null,
    },
});


module.exports = model('Guild', schema);