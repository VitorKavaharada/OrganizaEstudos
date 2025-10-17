const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relacionamento one-to-many=> Um usuário tem muitos estudos e um estudo pertence a um unico usuário
User.hasMany(db.models.Study, { foreignKey: 'userId' });
db.models.Study.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;