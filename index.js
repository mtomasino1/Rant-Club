const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

//This loads all data models at once
const models = require('./models');

//Load our handlers
const editHandler = require('./handlers/edit')(models);
const commandHandler = require('./handlers/commands')(models);

client.login(process.env.BOT_TOKEN);

client.once('ready', async () => {
    await models.sequelize.sync();
    console.log('Ready!');
});

client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (newMsg.channel.name == process.env.CHANNEL_NAME && newMsg.author.id != client.user.id)
    {
        await editHandler.deleteAndInsult(newMsg);
    }
});

client.on('message', async msg => {
    if(msg.channel.name == process.env.CHANNEL_NAME && msg.author.id != client.user.id) {
        var user = await models.Stamps.findOne({where: { username: msg.author.id }});
        var firstTime = false;
        if(!user) {
            user = await models.Stamps.create({username: msg.author.id, timestamp: msg.createdTimestamp + parseInt(process.env.DEFAULT_COOLDOWN)})
            firstTime = true;
            console.log("New user created. Msg timestamp and wait timestamp are");
            console.log(msg.createdTimestamp);
            console.log(user.timestamp);
        }
        if (!firstTime && msg.createdTimestamp < user.timestamp) {
            await msg.delete();
        } else {
            user.timestamp = msg.createdTimestamp + user.cooldown;
            user.save()
            

            var date = new Date(msg.createdTimestamp);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            console.log(formattedTime + ' ' + msg.author.id + ": " + msg.content);

            if (msg.content.startsWith(process.env.COMMAND_PREFIX)) {
                const input = msg.content.slice(process.env.COMMAND_PREFIX.length).split(' ');
                const command = input.shift();
                const commandArgs = input.join(' ');
                
                //This is the block to add your new commands
                switch(command){
                    case 'setCooldown':
                        await commandHandler.setCooldown(user, msg, commandArgs);
                        break;
                    case 'addInsult' :
                        await commandHandler.addInsult(msg, commandArgs);
                        break;
                }
            }
        }
    }
});