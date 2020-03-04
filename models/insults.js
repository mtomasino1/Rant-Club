'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var Insults = sequelize.define('Insults', {
    text: {
		type: Sequelize.STRING,
		unique: true
	}
  });

  return Insults;
};