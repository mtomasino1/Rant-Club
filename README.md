"# Rant-Club" 

# Example .env file
```env
BOT_TOKEN=token
DEFAULT_COOLDOWN=10000
CHANNEL_NAME=bot-test
COMMAND_PREFIX=!
```

# How to add command handlers
New commands that respond to ! messages are added by creating a new class and putting it in the `handlers/commands` directory. This class needs to extend the commandBase class. To make it work correctly, you need to take care of the following things:
* Create a constructor that accepts `models` an argument and sets the `description`, `helpText`, and `name` properties. These are essential for proper running and showing help information. Example for the addInsult command:
```
constructor(models) {
    super(models);
    this.description = "Lets the user add insults to the database"
    this.helpText = "Usage: `!addInsult [insult to add]` | Allows other bot operations to randomly use this insult going forward."
    this.name = "addInsult"
}
```
* Create an async function called execute that accepts `user`, `msg`, and `args` arguments. Those arguments represent the user object in our db, the entire discord message object that triggered the command, and the arguments that came after the !keyword. Example below
```
async execute(user, msg, args) {
    try {
        //...
        //await some stuff here
        //...
        await msg.channel.send("Feedback for the user letting them know the command worked");
    } catch (e) {
        await msg.channel.send("Useful error message for the user here.");
    }
}
```
* The `name` property needs to be unique across the system (case insensitve). If there is a conflict between two commands, the bot won't run at all.

## Notes
If you have a command idea that requires more information than the `user, msg, args`, you'll need to add that argument to the root `index.js` and also **add it to the execute function of all existing commands**
