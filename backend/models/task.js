import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define('Task', {
    // N'oublie pas de garder l'ID et le Title ici
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    }, 
    status: {
        type: DataTypes.STRING(50), 
        defaultValue: 'pending', 
        allowNull: false,
        validate: {
            isIn: [['pending', 'completed']]
        }
    }, 
    priority: {
        type: DataTypes.STRING(50), 
        defaultValue: 'medium', 
        allowNull: false,
        validate: {
            isIn: [['low', 'medium', 'high']]
        }
    }, 
    deadline: {
        type: DataTypes.DATE, 
        allowNull: true, // On laisse vide si pas de date prévue
    }, 
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Une tâche doit forcément appartenir à quelqu'un
        references: {
            model: 'users', 
            key: 'id'
        },
        onDelete: 'CASCADE'
    }, 
    category_id: {
        type: DataTypes.INTEGER, 
        allowNull: true, // Optionnel, comme on l'a dit !
        defaultValue: null, 
        references: {
            model: 'categories', 
            key: 'id'
        }, 
        onDelete: 'SET NULL'
    }
},{
    tableName: 'tasks', 
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Task;