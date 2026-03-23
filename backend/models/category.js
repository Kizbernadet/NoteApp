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
        allowNull: false
    }, 
    color: {
        type: DataTypes.STRING(10), 
        allowNull: false, 
        defaultValue: "#fff"
    }, 
    user_id:{
        type: DataTypes.INTEGER, 
        allowNull: false, 
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
    underscored: true
});

export default Category;