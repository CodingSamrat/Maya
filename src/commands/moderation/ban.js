const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const targetUserId = interaction.options.get('user').value;
        const reasonOfBan  = interaction.options.get('reason')?.value || "No reason provided";
        
        const targetUser   = await interaction.guild.members.fetch(targetUserId);
        
        
        // Check if the user is valid
        if (!targetUser) {
            await interaction.editReply("The user you are trying to ban is no longer member of this server.");
            return;
        };

        // Check if the user is the Onwer of the server
        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("The owner of the server cann't be banned.");
            return;
        }
        
        // Check if the target user's role is lower than the bot role as well as the author's role who is trying to ban
        const targetUserRole    = targetUser.roles.highest.position; // The highest role of the target user
        const requestedUserRole = interaction.member.roles.highest.position; // The highest role of the author who is trying to ban
        const botRole           = interaction.guild.members.me.roles.highest.position; // The highest role of the bot
        
        if (targetUserRole >= requestedUserRole) {
            await interaction.editReply("You cann't ban a user who has a higher role than you.");
            return;
        }

        if (targetUserRole >= botRole) {
            await interaction.editReply("Sorry, I cann't ban a user who has a higher role than me.");
            return;
        }


        // Finally ban the user
        try {
            await targetUser.ban({ reason: reasonOfBan });
            await interaction.editReply(`${interaction.member} banned ${targetUser} \nReason: ${reasonOfBan}`);
        } catch (error) {
            console.log(`There was an error while banning. ${error}`);
        }

    },


    name: 'ban',
    description: 'Ban a member from the server',
    options: [
        {
            name: 'user',
            description: 'The user to ban',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the banning',
            type: ApplicationCommandOptionType.String,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    
};