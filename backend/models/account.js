import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Account = sequelize.define('Account', {
    // L'ID est géré automatiquement par Sequelize (SERIAL)
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validation automatique du format email
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    created_at: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.timestamps
    }, 
    updated_at: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.timestamps
    }
}, {
    tableName: 'accounts', // On force le nom de la table exacte
    timestamps: true       // Active la gestion auto de created_at et updated_at
});

export default Account;