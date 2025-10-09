const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB.PASS,{
        hots: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
)

try {
  sequelize.authenticate();
  console.log('Conectado ao banco ' + process.env.DB_NAME);
} catch (error) {
  console.log(`Não foi possível conectar ao banco de dados: ${error}`);
}

module.exports = sequelize;