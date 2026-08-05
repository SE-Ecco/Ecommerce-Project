import { Model, DataTypes}  from 'sequelize';
import sequelize from '../config/database';

// ── REVIEW ───────────────────────────────────────────────────
class Review extends Model {
    declare id: number;
    declare user_id: number;        // which user wrote this review
    declare product_id: number;
    declare shop_id: number;        // which shop this review belongs to
    declare order_id: number | null;      // which order this review belongs to (nullable)
    declare rating: number;         // 1-5 stars
    declare comment: string | null; // optional text comment
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
        allowNull: false
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