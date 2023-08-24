const { Client, Interaction } = require("discord.js");
const Economy = require("../../Models/Economy");

const dailyReward = 108;

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      // quiry to retrieve the economyObj
      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let economyObj = await Economy.findOne(query);
      // check if the user is valid
      if (economyObj) {
        if (economyObj.lastDaily) {
          const lastDailyDate = economyObj.lastDaily.toDateString();
          const currentDate = new Date().toDateString();

          if (lastDailyDate === currentDate) {
            interaction.editReply(
              "You have already collected your dailies today. Come back tomorrow!"
            );
            return;
          }
        }

        economyObj.lastDaily = new Date();
      } else {
        economyObj = new Economy({
          ...query,
          lastDaily: new Date(),
        });
      }

      economyObj.balance += dailyReward;
      await economyObj.save();

      interaction.editReply(
        `${dailyReward} was added to your balance. Your new balance is ${economyObj.balance}`
      );
    } catch (error) {
      console.log(`Error to claim daily reward: ${error}`);
    }
  },

  name: "daily",
  description: "Claim your daily reward.",
};
