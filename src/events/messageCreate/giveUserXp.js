const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const LevelXp = require("../../models/LevelXp");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(5, 15);

  const quiry = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const levelXpObject = await LevelXp.findOne(quiry);
    
    if (levelXpObject) {
      levelXpObject.xp += xpToGive;

      // Check if the user has enough xp to level up
      if (levelXpObject.xp >= calculateLevelXp(levelXpObject.level)) {
          levelXpObject.xp = 0;
          levelXpObject.level += 1;
          
        message.channel.send(`🥳 Congratulations ${message.member}! \nYou have leveled up to **level ${levelXpObject.level}**.`);
      }

      // Save the updated level
      await levelXpObject.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });

      // Add cooldown
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);

    }
    // if (!levelXpObject)
    else {
      // If the user is new in the guild.  Create new LevelXp for this user
      const newLevelXp = await LevelXp.create({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevelXp.save();

      // Add cooldown
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
  } catch (error) {
    console.log(`Error to give XP: ${error}`);
  }
};
