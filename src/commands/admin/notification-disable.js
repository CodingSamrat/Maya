const {
    Client,
    Interaction,
    PermissionFlagsBits,
  } = require("discord.js");

  const Guild = require("../../Models/Guild");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }
        
        try {
            await interaction.deferReply();

            let guildObject = await Guild.findOne({ guildId: interaction.guild.id });

            if (guildObject) {
                if (guildObject.notificationChannilId){
                    interaction.editReply(`Notification System has been disabled.\nYou can enable this feature by running \`/notification-config\``);
                }else{
                    interaction.editReply(`Notification System has allready been disabled. \nYou can enable this feature by running \`/notification-config\``);
                }

                guildObject.notificationChannilId = null;
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                });
                interaction.editReply(`Notification System is not enabled for this server yet.\nYou can enable this feature by running \`/notification-config\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Notification System:', error);
        }
    },

    name: 'notification-disabel',
    description: 'Disable the Notification System. You will not get any notifications from me after disabling this',
    permissionsRequired: [PermissionFlagsBits.Administrator]
};