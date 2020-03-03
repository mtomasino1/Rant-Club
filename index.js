const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();

const defaultCooldown = 10000;
const PREFIX = '!';

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Stamps = sequelize.define('stamps', {
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
	timestamp: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    },
    cooldown: {
        type: Sequelize.INTEGER,
		defaultValue: defaultCooldown,
		allowNull: false,
    }
});

client.once('ready', () => {
    console.log('Ready!');
    Stamps.sync()
});

client.login('Njc3MjUyMjY2Njg3ODU2NzE4.XkR1mQ.y3Mal7RU120-mwjSaYmhJTtlonY');

client.on('message', async msg => {
    if(msg.channel.name == 'bot-test') {
        const user = await Stamps.findOne({where: { username: msg.author.id }});
        if(!user) {
            await Stamps.create({username: msg.author.id, timestamp: msg.createdTimestamp + defaultCooldown, cooldown: defaultCooldown })
        } else {
            if (msg.createdTimestamp < user.timestamp) {
                await msg.delete();
            } else {
                user.timestamp = msg.createdTimestamp + user.cooldown;
                

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

                if (msg.content.startsWith(PREFIX)) {
                    const input = msg.content.slice(PREFIX.length).split(' ');
                    const command = input.shift();
                    const commandArgs = input.join(' ');
                    
                    if (command === 'setCooldown') {
                        const splitArgs = commandArgs.split(' ');
                        const newCooldown = splitArgs.shift()
                        const userID = splitArgs.join(' ');
                        if(userID === '') {
                            user.cooldown = newCooldown;
                            console.log('Cooldown for ' + msg.author.username + ' set to ' + user.cooldown);
                        } else {
                            var IDRegex = /<@!(.+)>/g;
                            var IDArray = IDRegex.exec(userID);
                            if(IDArray[1] != undefined) {
                                const targetUser = await Stamps.findOne({where: { username: IDArray[1] }});
                                if(targetUser != null) {
                                    targetUser.cooldown = newCooldown
                                    targetUser.save();
                                    console.log('Cooldown for ' + targetUser.username + ' set to ' + targetUser.cooldown);
                                } else {
                                    console.log('User not found');
                                }
                            }
                        }
                    }
                }
                user.save()
            }
        }
    }
});