const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
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

        const targetChannelId = interaction.options.get('channel').value;
        const newChannle = interaction.guild.channels.cache.get(targetChannelId);

        
        try {
            await interaction.deferReply();

            let guildObject = await Guild.findOne({ guildId: interaction.guild.id });

            if (guildObject) {
                if (guildObject.notificationChannilId){

                    if (guildObject.notificationChannilId === targetChannelId) {
                        interaction.editReply(`Notification Channel has already been configured for ${newChannle} role. To disable run \`/notification-disable\``);
                        return;
                    }
                    
                    const oldChannel = interaction.guild.roles.cache.get(guildObject.notificationChannilId);
                    interaction.editReply(`Notification Channel has been updated from ${oldChannel} to ${newChannle}\nYou can disable this feature by running \`/notification-disable\``);

                }else{
                    interaction.editReply(`${newChannle} has been configured as Notification Channel \nYou can disable this feature by running \`/notification-disable\``);
                }

                guildObject.notificationChannilId = targetChannelId;
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                    notificationChannilId: targetChannelId,
                });
                interaction.editReply(`${newChannle} has been configured as Notification Channel\nYou can disable this feature by running \`/notification-disable\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Notification Channel:', error);
        }
    },

    name: 'notification-config',
    description: 'Configure the Notification Channel to get server notifications',
    options: [
        {
            name: 'channel',
            description: 'The channel to get server notifications',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages],
};