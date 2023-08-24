const { query } = require('express');
const User = require('../../Models/User');

module.exports = async (client, member) => {
    // if (member.user.bot) return;

    const query = {
        userId: member.id,
        guildId: member.guild.id
    }

    try{
        let user = await User.findOne(query);
        if(user) return;
        // Create new user
        user = new User({
            userId: member.id,
            guildId: member.guild.id
        })
        await user.save();

    }
    catch(error){
        console.log('Error creating new user: ', error)
    }
    
}