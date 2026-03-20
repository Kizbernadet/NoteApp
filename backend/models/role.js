import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // N'oubliez pas l'extension .js si vous utilisez les modules ES

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100), // On peut préciser la longueur pour correspondre au VARCHAR(100)
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'roles', // Force le nom de la table en minuscules
    timestamps: false   // À mettre sur false si vous n'avez pas de colonnes de dates dans cette table précise
});

export default Role;