const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const LevelXp = require("../../models/LevelXp");
const canvacord = require("canvacord");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    // Check if the command is being run inside a guild
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    await interaction.deferReply();

    // Getting the target user
    const targetUserId = interaction.options.get("user")?.value;
    const targetUser = targetUserId
      ? await interaction.guild.members.fetch(targetUserId)
      : interaction.member;

    // Check if the user is a bot
    if (targetUser.user.bot) {
      interaction.editReply("Bots doesn't support level system.");
      return;
    }

    // quiry to retrieve the levelXpObject
    const quiry = {
      userId: targetUser.id,
      guildId: interaction.guild.id,
    };

    try {
      const levelXpObject = await LevelXp.findOne(quiry);

      // check if the user has any levels
      if (!levelXpObject) {
        interaction.editReply(
          targetUserId
            ? `**${targetUser.user.tag}** doesn't have any levels yet. Try again when they chat a little more.`
            : "You don't have any levels yet. Chat a little more and try again."
        );
        return;
      }

      // Get Rank
      const allLevelXpObjects = await LevelXp.find({
        guildId: interaction.guild.id,
      });

      //sort the array in descending order
      allLevelXpObjects.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });

      let currentRank = allLevelXpObjects.findIndex((lvl) => lvl.userId === targetUser.id) + 1;

      // Create rank card
      const rankData = new canvacord.Rank()
        .setAvatar(targetUser.user.displayAvatarURL({ size: 256 }))
        .setRank(currentRank)
        .setLevel(levelXpObject.level)
        .setCurrentXP(levelXpObject.xp)
        .setRequiredXP(calculateLevelXp(levelXpObject.level))
        .setStatus(targetUser.presence.status)
        .setProgressBar("#FFC300", "COLOR")
        .setUsername(targetUser.user.username)
        .setDiscriminator(targetUser.user.discriminator);

      const rank = await rankData.build();              //build the rank card
      const attachment = new AttachmentBuilder(rank);   //create an attachment
      interaction.editReply({ files: [attachment] });   //send the attachment

    } catch (error) {
      console.log(`Error retrieving level: ${error}`);
      interaction.editReply(
        "An error occurred while retrieving the level. Please try again later."
      );
    }
  },

  name: "level",
  description: "Shows the level of a user!",

  options: [
    {
      name: "user",
      description: "The user you want to see the level of!",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
