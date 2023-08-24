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
    notificationChannilId: {
        type: String,
        default: null,
    },
    welcomeChannilId: {
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