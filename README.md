# Rant-Club
Here's the bot code that puts admins in line. To get this running on your machine, you should be able to just run `npm install` and make sure you have a .env file that covers the values below.

## Example .env file
```env
BOT_TOKEN=token
DEFAULT_COOLDOWN=10000
CHANNEL_NAME=bot-test
COMMAND_PREFIX=!
```

# How to add command handlers
New commands that respond to ! messages are added by creating a new class and putting it in the `handlers/commands` directory. You shouldn't need to touch any existing files. Your new class needs to extend the commandBase class. To make it work correctly, you need to take care of the following things:
* Create a constructor that accepts `models` as an argument and sets the `descriptionText`, `helpText`, and `name` properties. These are essential for proper running and showing help information. You also need to call `super(models)` if your command will be accessing the database models. Example for the addInsult command:
```
constructor(models) {
    super(models);
    this.descriptionText = "Lets the user add insults to the database"
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
* The `name` property needs to be unique across the system (case insensitve). If there is a conflict between two commands, the bot won't run at all and throws an exception

## Notes
If you have a command idea that requires more information than the `user, msg, args`, you'll need to add that argument to the root `index.js` and also **add it to the execute function of all existing commands**
