import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    }, 
    title: {
        type: DataTypes.STRING(100), 
        allowNull: false
    }, 
    content: {
        type: DataTypes.TEXT, 
        allowNull: false, 
    }, 
    is_favorite: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false, 
        allowNull: false
    }, 
    is_archived: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false, 
        allowNull: false
    }, 
    user_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'users', 
            key: 'id'
        }
    }, 
    category_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'categories', 
            key: 'id'
        }
    }
},{
    tableName: 'notes', 
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
})

export default Note; 