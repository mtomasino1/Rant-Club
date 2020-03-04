const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

//This loads all data models at once
const models = require('./models');

//Load our edit handler
const editHandler = require('./handlers/edit')(models);

//Pull in all command handlers at once
const handlers = require('./handlers/commands')(models).handlerList;

client.login(process.env.BOT_TOKEN);

client.once('ready', async () => {
    await models.sequelize.sync();
    console.log('Ready!');
    client.channels.find(x => x.name === process.env.CHANNEL_NAME).send("Who's afraid of being banned?");
});

client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (newMsg.channel.name == process.env.CHANNEL_NAME && newMsg.author.id != client.user.id && oldMsg.cleanContent != newMsg.cleanContent)    //cleanContent check should prevent deletes caused by discord embedding an image
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
        }
        if (!firstTime && msg.createdTimestamp < user.timestamp) {
            await msg.author.send("Your message was deleted. You need to wait " + ((user.timestamp - msg.createdTimestamp)/1000).toString() + " more seconds.\n > " + msg.content);
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
                
                if (command.toLowerCase() == 'help'){
                    if (commandArgs == "") {
                        helpMessage = "Here are all of the ranting commands I accept. You call them via `![commandName] [arguments]`. To get more info, type `!help [commandName]`\n";
                        handlers.forEach( handler => {
                            helpMessage += handler.description() + "\n";
                        });
                        await msg.channel.send(helpMessage);
                    } else {
                        helpMessage = ""
                        handlers.forEach(handler => {
                            if (handler.name.toLowerCase() == commandArgs.toLowerCase())
                                helpMessage = handler.help();
                        });
                        if (helpMessage != "")
                            await msg.channel.send(helpMessage);
                        else
                            await msg.channel.send("\"" + commandArgs + "\" does not match any of the commands I know");
                    }
                } else {
                    handlerFound = false;
                    await Promise.all(handlers.map( async (handler) => {
                        if (handler.name.toLowerCase() == command.toLowerCase()){
                            await handler.execute(user, msg, commandArgs);
                            handlerFound = true;
                        }
                    }));
                    if (!handlerFound)
                        await msg.channel.send("\"" + command + "\" does not match any of the commands I know");
                }
            }
        }
    }
});