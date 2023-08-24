const Guild = require("../Models/Guild");

module.exports =  async (notification, arg)  => {
    const guildId = arg.guild.id;
    let guildObject = await Guild.findOne({ guildId: arg.guild.id });
    
    if (!guildObject || !guildObject.notificationChannilId) return;

    const notificationChannel = arg.guild.channels.cache.get(guildObject.notificationChannilId);

    if (!notificationChannel) return;
    notificationChannel.send(notification);
    
}
