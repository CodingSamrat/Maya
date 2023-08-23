const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Economy = require("../../Models/Economy");
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
    const economyObj = await Economy.findOne(quiry);
    
    if (economyObj) {
      economyObj.xp += xpToGive;

      // Check if the user has enough xp to level up
      if (economyObj.xp >= calculateLevelXp(economyObj.level)) {
          economyObj.xp = 0;
          economyObj.level += 1;
          
        message.channel.send(`🥳 Congratulations ${message.member}! \nYou have leveled up to **level ${economyObj.level}**.`);
      }

      // Save the updated level
      await economyObj.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });

      // Add cooldown
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);

    }
    // if (!economyObj)
    else {
      // If the user is new in the guild.  Create new LevelXp for this user
      const newLevelXp = await Economy.create({
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
