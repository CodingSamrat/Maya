const {
  Client,
  Interaction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const Guild = require("../../Models/Guild");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = {
  callback: async (client, interaction) => {
    try {
      let guildObject = await Guild.findOne({ guildId: interaction.guild.id });
      if (!guildObject) return;
    
      // Check for valid channel and role
      
      
      if (!guildObject.verifyRoleId) {
        interaction.reply({
          content: `❌  This server does not have a verification system set up. Enjoy your stay!✌️`,
          ephemeral: true,
        });
        return;
      }

      if (
        guildObject.verifyChannelId &&
        interaction.channel.id !== guildObject.verifyChannelId
      ) {
        interaction.reply({
          content: `❌  You are not allowed to use this command here. Please visit ${interaction.guild.channels.cache.get(
            guildObject.verifyChannelId
          )} channel for verification.`,
          ephemeral: true,
        });
        return;
      }
      if (interaction.member.roles.cache.has(guildObject.verifyRoleId)) {
        interaction.reply({
          content: `✅  You are already verified.`,
          ephemeral: true,
        });
        return;
      }
      

      const verifyButton = new ButtonBuilder()
        .setLabel("verify")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success)
        .setCustomId("verify-button");

      const verifyButtonRow = new ActionRowBuilder().addComponents(
        verifyButton
      );

      const reply = await interaction.reply({
        content: `Click the button below to verify yourself`,
        components: [verifyButtonRow],
      });

      const filter = (i) => i.user.id === interaction.user.id;

      const controller = await reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter,
      });

      controller.on("collect", async (interaction) => {
        if (interaction.customId === "verify-button") {
          await interaction.deferUpdate();
          await interaction.member.roles.add(guildObject.verifyRoleId);
          await interaction.channel.send(`You have been verified!`);
        }
      });
    } catch (error) {
      console.log("Error creating verify button: ", error);
    }
  },

  name: "verify",
  description: "Verify yourself to get access to the server.",
};
