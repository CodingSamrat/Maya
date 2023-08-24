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
            interaction.reply('You can only run tnotificationChannilIdhis command inside a server.');
            return;
        }

        const targetChannelId = interaction.options.get('channel').value;
        const newChannle = interaction.guild.channels.cache.get(targetChannelId);

        
        try {
            await interaction.deferReply();

            let guildObject = await Guild.findOne({ guildId: interaction.guild.id });

            if (guildObject) {
                if (guildObject.welcomeChannelId){

                    if (guildObject.welcomeChannelId === targetChannelId) {
                        interaction.editReply(`${newChannle} has already been configured for Welcome Channel. To disable run \`/welcome-disable\``);
                        return;
                    }
                    
                    const oldChannel = interaction.guild.channels.cache.get(guildObject.welcomeChannelId);
                    interaction.editReply(`Welcome Channel has been updated from ${oldChannel} to ${newChannle}\nYou can disable this feature by running \`/welcome-disable\``);

                }else{
                    interaction.editReply(`${newChannle} has been configured as Welcome Channel \nYou can disable this feature by running \`/welcome-disable\``);
                }

                guildObject.welcomeChannelId = targetChannelId;
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                    welcomeChannelId: targetChannelId,
                });
                interaction.editReply(`${newChannle} has been configured as Welcome Channel\nYou can disable this feature by running \`/welcome-disable\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Welcome Channel:', error);
        }
    },

    name: 'welcome-config',
    description: 'Configure the Welcome Channel to greet new members',
    options: [
        {
            name: 'channel',
            description: 'The channel to greet new members in',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages],
};