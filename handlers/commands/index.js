const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

module.exports = function(models) {
    handlerList = [];
    modules = [];

    fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file != "commandBase.js") && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        modules.push(require("./"+file));
    });

    commandNames = [];

    modules.forEach(commandModule => {
        handlerList.push(new commandModule(models));
    });

    handlerList.forEach(handler => {
        if (!commandNames.includes(handler.name.toLowerCase()))
            commandNames.push(handler.name.toLowerCase());
        else
            throw (handler.name + " was detected as a duplicate command");
    });

    return {
        handlerList : handlerList
    }
}