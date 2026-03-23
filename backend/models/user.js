import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Ajout du .js

const User = sequelize.define('User', {
  // Pas besoin de déclarer ID si tu suis la convention, 
  // mais c'est mieux de le mettre pour être explicite :
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: false
  }, 
  account_id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
        model: 'accounts', 
        key: 'id'
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  // Si tes colonnes SQL s'appellent exactement created_at (avec underscore)
  // on ajoute ces deux lignes :
  createdAt: 'created_at',
  updatedAt: 'updated_at', 
  underscored: true
});

export default User;