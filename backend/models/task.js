import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define('Task', {
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
    description: {
        type: DataTypes.STRING(100), 
        allowNull: true
    }, 
    status: {
        type: DataTypes.STRING(50), 
        defaultValue: 'pending', 
        allowNull: false
    }, 
    priority: {
        type: DataTypes.STRING(50), 
        defaultValue: 'medium', 
        allowNull: false
    }, 
    dueDate: {
        type: DataTypes.DATEONLY, 
        allowNull: true
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
    tableName: 'tasks', 
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
})

export default Task; 