const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const reason       = interaction.options.get('reason')?.value || "No reason provided";
        
        await interaction.deferReply();
        
        
        // Check if the user is valid
        const targetUser   = await interaction.guild.members.fetch(targetUserId);
        
        if (!targetUser) {
            await interaction.editReply("The user you are trying to kick is no longer member of this server.");
            return;
        };

        // Check if the user is the Onwer of the server
        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("The owner of the server cann't be kicked.");
            return;
        }
        
        // Check if the target user's role is lower than the bot role as well as the author's role who is trying to kick
        const targetUserRole    = targetUser.roles.highest.position; // The highest role of the target user
        const requestedUserRole = interaction.member.roles.highest.position; // The highest role of the author who is trying to kick
        const botRole           = interaction.guild.members.me.roles.highest.position; // The highest role of the bot
        
        if (targetUserRole >= requestedUserRole) {
            await interaction.editReply("You cann't kick a user who has a higher role than you.");
            return;
        }

        if (targetUserRole >= botRole) {
            await interaction.editReply("Sorry, I cann't kick a user who has a higher role than me.");
            return;
        }


        // Finally kick the user
        try {
            await targetUser.kick({ reason });
            await interaction.editReply(`${interaction.member} kicked ${targetUser} \nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error while kicking. ${error}`);
        }

    },


    name: 'kick',
    description: 'Kick a member from the server',
    options: [
        {
            name: 'user',
            description: 'The user to kick',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the kicking',
            type: ApplicationCommandOptionType.String,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
    
};