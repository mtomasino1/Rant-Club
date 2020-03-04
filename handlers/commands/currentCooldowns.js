const commandBase = require("./commandBase");

class currentCooldowns extends commandBase
{
    constructor(models) {
        super(models);
        this.descriptionText = "Lists all users with their current cooldowns"
        this.helpText = "Usage: `!currentCooldowns` | That's really all there is to it.";
        this.name = "currentCooldowns"
    }

    async execute(user, msg, args) {
        var statusMsg = "```Username   |   Current cooldown |  Cooldown value\n";
        const cooldowns = await this.models.Stamps.findAll();
        cooldowns.forEach(cooldown => {
            const currentCD = cooldown.timestamp - msg.createdTimestamp;
            statusMsg += cooldown.tag + " | " + (currentCD > 0 ? Math.floor(currentCD/1000) + " s" : "N/A") + " | " + cooldown.cooldown/1000 + " s\n"
        });
        statusMsg += "```";
        msg.channel.send(statusMsg);
    }
}

module.exports = currentCooldowns;