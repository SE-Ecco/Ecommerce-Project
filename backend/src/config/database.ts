// WHAT: Sequelize connection to PostgreSQL
// IMPORTS: sequelize, models/index.ts (to register all models)
// USED BY: server.ts (connectDB function called at startup)
import {Sequelize} from 'sequelize';
import {env} from './env';

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
})
export default sequelize;