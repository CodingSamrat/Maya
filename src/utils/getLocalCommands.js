const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const cmmandObject = require(commandFile);

      if(exceptions.includes(cmmandObject.name)){
        continue;
      }

      localCommands.push(cmmandObject);
    }
  }

  return localCommands;
};
