import sequelize from "../config/database.js";
import Role from "./role.js";
import Account from "./account.js";
import User from "./user.js";
import Category from "./category.js";
import Note from "./note.js";
import Task from "./task.js";

// --- RELATIONS ---

// 1. Role <-> Account (1:N)
Role.hasMany(Account, { foreignKey: 'role_id' });
Account.belongsTo(Role, { foreignKey: 'role_id' });

// 2. Account <-> User (1:1)
Account.hasOne(User, { foreignKey: 'account_id' });
User.belongsTo(Account, { foreignKey: 'account_id' });

// 3. User <-> Note / Task / Category (1:N)
User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Category, { foreignKey: 'user_id' });
Category.belongsTo(User, { foreignKey: 'user_id' });

// 4. Category <-> Note / Task (1:N)
Category.hasMany(Note, { foreignKey: 'category_id' });
Note.belongsTo(Category, { foreignKey: 'category_id' });

// Une catégorie peut avoir plusieurs tâches
Category.hasMany(Task, { 
    foreignKey: 'category_id',
    as: 'tasks'
});

// Une tâche appartient à une catégorie
Task.belongsTo(Category, { 
    foreignKey: 'category_id', 
    as: 'category' // C'est cet alias qui manquait !
});


export {
  sequelize,
  Role,
  Account,
  User,
  Category,
  Note,
  Task
};