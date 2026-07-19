// WHAT: Sequelize CLI connection config — reads from .env
// USED BY: Sequelize CLI when running db:migrate and db:seed
// HOW: copy .env.example → .env → fill your PostgreSQL values
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // <-- حتى يندل مكان الملف بالملي

module.exports = {
  development: {
    username: process.env.DB_USERNAME, // <-- تم التعديل هنا ليطابق ملف الـ .env مالتك
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST || '127.0.0.1',
    port:     process.env.DB_PORT || 5432,
    dialect:  'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
}