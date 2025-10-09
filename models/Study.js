const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Study = db.define('Study',{
 subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

module.exports = Study;