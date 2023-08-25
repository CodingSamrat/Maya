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
                if (guildObject.verifyChannelId && guildObject.verifyRoleId){
                    interaction.editReply(`Verification System has been disabled.\nYou can enable this feature by running \`/verify-config\``);
                }else{
                    interaction.editReply(`Verification System has allready been disabled. \nYou can enable this feature by running \`/verify-config\``);
                }

                guildObject.verifyChannelId = null;
                guildObject.verifyRoleId    = null;
                
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                });
                interaction.editReply(`Verification System is not enabled for this server yet.\nYou can enable this feature by running \`/verify-config\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Verification System:', error);
        }
    },

    name: 'verify-disabel',
    description: 'Disable the verification system for new users.',
    permissionsRequired: [PermissionFlagsBits.Administrator]
};