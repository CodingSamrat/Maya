const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    // Check if the user is valid
    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply(
        "The user you are trying to kick is no longer member of this server."
      );
      return;
    }

    // Check if the target user is a bot
    if (targetUser.user.bot) {
      await interaction.editReply("Sorry, I cann't timeout a bot.");
      return;
    }

    // Get the timeout duration in milliseconds
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid duration.");
      return;
    }

    // check if the duration is in valid range
    // 5 sec   => 5 * 1000 ms
    // 28 days => 28 * 24 * 60 * 60 * 1000 ms => 2.419e+9 ms
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration must be greater than 5 minutes and less than 28 days."
      );
      return;
    }

    // Check if the target user's role is lower than the bot role as well as the author's role who is trying to timeout
    const targetUserRole = targetUser.roles.highest.position; // The highest role of the target user
    const requestedUserRole = interaction.member.roles.highest.position; // The highest role of the author who is trying to timeout
    const botRole = interaction.guild.members.me.roles.highest.position; // The highest role of the bot

    if (targetUserRole >= requestedUserRole) {
      await interaction.editReply(
        "You cann't timeout a user who has a higher role than you."
      );
      return;
    }

    if (targetUserRole >= botRole) {
      await interaction.editReply(
        "Sorry, I cann't timeout a user who has a higher role than me."
      );
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {verbose: true,})}\nReason: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, {verbose: true,})}.\nReason: ${reason}`);
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: "timeout",
  description: "Timeout a user",
  options: [
    {
      name: "user",
      description: "The user to timeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout period (1m, 1h, 1day, 1week)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
