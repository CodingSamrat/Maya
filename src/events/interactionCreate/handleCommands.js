const { devs, testserver } = require("../../../cinfig.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    // Finding the command object
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    
    // Command Object found or not
    if (!commandObject) return;


    // If the Command is Only for Developers
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        return interaction.reply({
          content: "This command is only for developers",
          ephemeral: true,
        });
        return;
      }
    };


    // If the Command is only for Development Server or Test Server Only
    if (commandObject.testOnly) {
      if (!(interaction.guildId === testserver)) {
        return interaction.reply({
          content: "This command can only be used in the test server",
          ephemeral: true,
        });
        return;
      }
    };


    // If the user has the required permissions to run the command
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          return interaction.reply({
            content: `You need "${permission}" permission to run this command`,
            ephemeral: true,
          });
          return;
        }
      }
    };

    // If the bot has the required permissions to run the command
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;
        
        if (!bot.permissions.has(permission)) {
          return interaction.reply({
            content: `Sorry, I don't have enough permossion to do this. I need "${permission}" permission to run this command`,
            ephemeral: true,
          });
          return;
        }
      }
    };


    // Finaly running the command
    await commandObject.callback(client, interaction);


  } catch (error) {
    console.log(`There is a error: ${error}`);
  };
};
