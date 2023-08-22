module.exports = {
    name: 'ping',
    description: 'Replies with Bot & websocket Ping!',
    category: 'misc',

    callback: async (client, interaction) => {
        await interaction.deferReply(); // This will acknowledge the command, and the client will stop thinking.

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;


        interaction.editReply(`Pong...! The Bot ping is: ${ping} || The Websocket ping is: ${client.ws.ping} ms`);
    }
};