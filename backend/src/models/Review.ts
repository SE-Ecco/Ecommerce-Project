import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Review extends Model {
    declare id: number;
    declare user_id: number;
    declare product_id: number;
    declare shop_id: number;
    declare order_id: number | null;
    declare rating: number;
    declare comment: string | null;
    declare created_at: Date;
}

Review.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true  // 🔧 Fix 1: matches declaration
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false,
    underscored: true
});

export default Review;
