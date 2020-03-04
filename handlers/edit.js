const Sequelize = require('sequelize');
module.exports = function(models) {
    async function deleteAndInsult(msg) {
        var insult = await models.Insults.findOne({order: [Sequelize.fn( 'RANDOM' )]});
        await msg.channel.send("**<@!" + msg.author.id + ">** is " + (insult == null ? "dumb" : insult.text) + " and tried editing their message. It has been destroyed \n > " + msg.content);
        await msg.delete();
    }
    return {
        deleteAndInsult : deleteAndInsult
    }
}