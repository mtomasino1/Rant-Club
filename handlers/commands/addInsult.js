const commandBase = require("./commandBase");

class addInsult extends commandBase
{
    constructor(models) {
        super(models);
        this.descriptionText = "Lets the user add insults to the database"
        this.helpText = "Usage: `!addInsult [insult to add]` | Allows other bot operations to randomly use this insult going forward.\n**Phrase your input as self-contained. Like \"is dumb\" or \"wet their pants\". Unless it's a verb, single words won't make sense.**";
        this.name = "addInsult"
    }

    async execute(user, msg, args) {
        if (args == ""){
            await msg.channel.send("Include an insult after your command");
            return;
        }
        try {
            await this.models.Insults.create({text : args});
            await msg.channel.send("**" + args + "** has been added as an insult for future offenders");
        } catch (e) {
            await msg.channel.send("There was a problem adding that insult");
        }
    }
}

module.exports = addInsult;