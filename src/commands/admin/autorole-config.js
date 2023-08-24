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

        const targetRoleId = interaction.options.getRole('role').id;
        const newRole = interaction.guild.roles.cache.get(targetRoleId);

        
        try {
            await interaction.deferReply();

            let guildObject = await Guild.findOne({ guildId: interaction.guild.id });

            if (guildObject) {
                if (guildObject.autoRoleId){

                    if (guildObject.autoRoleId === targetRoleId) {
                        interaction.editReply(`Auto role has already been configured for ${newRole} role. To disable run \`/autorole-disable\``);
                        return;
                    }
                    
                    const oldRole = interaction.guild.roles.cache.get(guildObject.autoRoleId);
                    interaction.editReply(`Auto role has been updated from ${oldRole} to ${newRole}\nYou can disable this feature by running \`/autorole-disable\``);

                }else{
                    interaction.editReply(`Auto role has been configured to ${newRole}\nYou can disable this feature by running \`/autorole-disable\``);
                }

                guildObject.autoRoleId = targetRoleId;
            } else {
                guildObject = new Guild({
                    guildId: interaction.guild.id,
                    autoRoleId: targetRoleId,
                });
                interaction.editReply(`Auto role has been configured to ${newRole}\nYou can disable this feature by running \`/autorole-disable\``);
            }

            await guildObject.save();
        } catch (error) {
            console.log('Error Configuring Auto Role:', error);
        }
    },

    name: 'autorole-config',
    description: 'Configure the autorole feature',
    options: [
        {
            name: 'role',
            description: 'The role to give to new members',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],
};