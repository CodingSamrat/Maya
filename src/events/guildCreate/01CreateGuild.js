const guildModel = require('../../Models/Guild');
const {Client ,Guild} = require('discord.js')

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 */
module.exports = async (client, guild) => {
    try{
        let guildObject = await guildModel.findOne({guildId: guild.id});
        if(guildObject) return;
        
        // Create new  Guild if it doesn't exist
        guildObject = new guildModel({
            guildId: guild.id
        })

        // Save the new Guild to the database
        await guildObject.save();

        
    }
    catch(error){
        console.log('Error creating new Guild: ', error)
    }
}