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

    modules.forEach(commandModule => {
        handlerList.push(new commandModule(models))
    });

    return {
        handlerList : handlerList
    }
}