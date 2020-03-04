'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var Stamps = sequelize.define('Stamps', {
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
		defaultValue: parseInt(process.env.DEFAULT_COOLDOWN),
		allowNull: false,
    }
  });

  return Stamps;
};