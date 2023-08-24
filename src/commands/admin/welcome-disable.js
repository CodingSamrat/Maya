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
                if (guildObject.welcomeChannelId){
                    interaction.editReply(`Welcome System has been disabled.\nYou can enable this feature by running \`/welcome-config\``);
                }else{
                    interaction.editReply(`Welcome System has allready been disabled. \nYou can enable this feature by running \`/welcome-config\``);
                }

                guildObject.welcomeChannelId = null;
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                });
                interaction.editReply(`Welcome System is not enabled for this server yet.\nYou can enable this feature by running \`/welcome-config\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Welcome System:', error);
        }
    },

    name: 'welcome-disabel',
    description: 'Disable the Welcome System for new users.',
    permissionsRequired: [PermissionFlagsBits.Administrator]
};