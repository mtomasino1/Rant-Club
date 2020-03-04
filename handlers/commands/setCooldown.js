const commandBase = require("./commandBase");

class setCooldown extends commandBase
{
    constructor(models) {
        super(models);
        this.descriptionText = "Lets the user set his own cooldown"
        this.helpText = "Usage: `!setCooldown [cooldown in seconds] [userID (optional)]` | Lets a user set his own cooldown by default or set another's for him"
        this.name = "setCooldown"
    }

    async execute(user, msg, args) {
        const splitArgs = args.split(' ');
        const newCooldown = splitArgs.shift()
        const userID = splitArgs.join(' ');
        if (newCooldown == ""){
            await msg.channel.send("You need to include a cooldown in your command");
            return;
        } else if (parseInt(newCooldown) < process.env.MIN_COOLDOWN)
        {
            await msg.channel.send("Cooldown must be >= " + process.env.MIN_COOLDOWN);
            return;
        }
        if(userID === '') {
            user.cooldown = parseInt(newCooldown)*1000;
            await user.save()
            await msg.channel.send("Your cooldown has been updated!");
            console.log('Cooldown for ' + msg.author.username + ' set to ' + user.cooldown);
        } else {
            var IDRegex = /<@!(.+)>/g;
            var IDArray = IDRegex.exec(userID);
            if(IDArray[1] != undefined) {
                const targetUser = await this.models.Stamps.findOne({where: { username: IDArray[1] }});
                if(targetUser != null) {
                    targetUser.cooldown = parseInt(newCooldown)*1000;
                    await targetUser.save();
                    await msg.channel.send("<@!" + targetUser.username+ "> has an updated cooldown");
                    console.log('Cooldown for ' + targetUser.username + ' set to ' + targetUser.cooldown);
                } else {
                    console.log('User not found');
                    await msg.channel.send("User not found");
                }
            }
        }
    }
}

module.exports = setCooldown;