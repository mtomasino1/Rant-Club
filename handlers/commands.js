const Sequelize = require('sequelize');
module.exports = function(models) {
    async function setCooldown(user, msg, args) {
        const splitArgs = args.split(' ');
        const newCooldown = splitArgs.shift()
        const userID = splitArgs.join(' ');
        if(userID === '') {
            user.cooldown = newCooldown;
            await user.save();
            console.log('Cooldown for ' + msg.author.username + ' set to ' + user.cooldown);
        } else {
            var IDRegex = /<@!(.+)>/g;
            var IDArray = IDRegex.exec(userID);
            if(IDArray[1] != undefined) {
                const targetUser = await models.Stamps.findOne({where: { username: IDArray[1] }});
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
    async function addInsult(msg, args) {
        try {
            await models.Insults.create({text : args});
            await msg.channel.send("**" + args + "** has been added as an insult for future offendors");
        } catch (e) {
            await msg.channel.send("There was a problem adding that insult");
        }
    }
    return {
        setCooldown : setCooldown,
        addInsult : addInsult
    }
}