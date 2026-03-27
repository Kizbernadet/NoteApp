import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    }, 
    name: {
        type: DataTypes.STRING(100), 
        allowNull: false, 
        validate: {notEmpty: true}
    }, 
    color: {
        type: DataTypes.STRING(10), 
        allowNull: false, 
        defaultValue: "#fff", 
        validate: {
            isIn : [['#fff', '#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#64748B']]
        } 
    }, 
    user_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        onDelete: 'CASCADE', 
        references: {
            model: 'users', 
            key: 'id'
        }
    }
}, {
    tableName: 'categories', 
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
    underscored: true, 
    indexes: [
        {
            unique: true,
            fields: ['name', 'user_id'] // On lie les deux colonnes ensemble
        }
    ]
});

export default Category;