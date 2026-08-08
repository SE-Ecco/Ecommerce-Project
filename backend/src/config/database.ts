import { Sequelize } from 'sequelize';
import { env } from './env';

const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;