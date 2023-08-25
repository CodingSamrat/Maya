const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
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
      interaction.reply(
        "You can only run tnotificationChannilIdhis command inside a server."
      );
      return;
    }

    const targetRoleId = interaction.options.get("role").value;
    const targetChannelId = interaction.options.get("channel")?.value;

    const newChannle = interaction.guild.channels.cache.get(targetChannelId);
    const newRole = interaction.guild.roles.cache.get(targetRoleId);

    try {
      await interaction.deferReply();

      let guildObject = await Guild.findOne({ guildId: interaction.guild.id });

      const embed = new EmbedBuilder()
        .setTitle("Success!   🎉")
        .setDescription(`Verification system has configured.\n`)
        .setColor("Random")
        .setTimestamp()
        .addFields(
            {
                name: "Role",
                value: `${newRole}`,
                inline: true,
            },
            {
                name: "Channel",
                value: `${newChannle?newChannle:"Not Set"}`,
                inline: true,
            },
            {
                name: "Note",
                value: `Now you can ask your members to run \`/verify\` command to verify themselves. If you set any specific channel, then they can only run this command in that channel only, otherwise they can run this command anywhere.
                \nTo disable this Verification System, run \`/verify-disable\` command`,
            }

        )
        


      if (guildObject) {
        guildObject.verifyChannelId = targetChannelId;
        guildObject.verifyRoleId = targetRoleId;
      } else {
        guildObject = new Guild({
          guildId: interaction.guild.id,
          verifyChannelId: targetChannelId,
          verifyRoleId: targetRoleId,
        });
      }
      interaction.editReply({ embeds: [embed] });

      await guildObject.save();
    } catch (error) {
      console.log("Error Configuring Verification system:", error);
    }
  },

  name: "verify-config",
  description: "Configure the verification system for new members",
  options: [
    {
      name: "role",
      description: "The role to give new verified members",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "channel",
      description: "The channel to greet new members in",
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
