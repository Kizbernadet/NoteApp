```javascript
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * STRUCTURE DE RÉFÉRENCE - MODÈLE SEQUELIZE
 * * Nom du modèle (PascalCase) : 'Account'
 */
const Account = sequelize.define('Account', {

  // 1. LA CLÉ PRIMAIRE (PRIMARY KEY)
  // Toujours explicitement déclarée pour correspondre à ton SERIAL PostgreSQL
  id: {
    type: DataTypes.INTEGER,    // Type numérique pour les ID
    primaryKey: true,           // Définit cette colonne comme clé primaire
    autoIncrement: true,        // Sequelize sait qu'il ne doit pas envoyer de valeur (Postgres gère le SERIAL)
    allowNull: false            // Ne peut jamais être vide
  },

  // 2. ATTRIBUTS STANDARDS (Colonnes de données)
  email: {
    type: DataTypes.STRING(255), // VARCHAR(255) en SQL
    allowNull: false,            // NOT NULL
    unique: true,                // Contrainte d'unicité (index unique en SQL)
    validate: {
      isEmail: true              // Validation native Sequelize (optionnel mais recommandé)
    }
  },

  password: {
    type: DataTypes.TEXT,        // TEXT en SQL (pour les mots de passe hachés longs)
    allowNull: false
  },

  // 3. LA CLÉ ÉTRANGÈRE (FOREIGN KEY)
  // C'est ici qu'on déclare physiquement la colonne qui lie les tables
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',            // NOM DE LA TABLE de destination (en minuscule comme dans Postgres)
      key: 'id'                  // COLONNE de destination
    }
  }

}, {
  // 4. LES OPTIONS DE CONFIGURATION
  
  // Définit le nom exact de la table dans PostgreSQL
  // Sans cela, Sequelize chercherait 'Accounts' (avec un S et Majuscule)
  tableName: 'accounts',

  // Active la gestion automatique des dates
  timestamps: true,

  // MAPPING DES DATES
  // Par défaut Sequelize cherche 'createdAt'. 
  // On lui dit ici : "Utilise ma colonne SQL 'created_at' à la place"
  createdAt: 'created_at',
  updatedAt: 'updated_at',

  // Optionnel : underscore: true
  // Si tu ne veux pas mapper chaque date à la main, cette option tente de transformer automatiquement le camelCase en snake_case pour tout le modèle.
  underscored: true 
});

export default Account;
```

---

### Explications détaillées des sections

#### La Clé Primaire (`id`)
En SQL, le `SERIAL` est un type spécial qui crée une séquence. En Sequelize, on utilise `INTEGER` avec `autoIncrement: true`. Cela indique à Node.js : *"Laisse PostgreSQL générer ce numéro tout seul lors de l'insertion"*.

#### Le Bloc des Options (`{ tableName, ... }`)
C'est le cerveau du modèle.
* **`tableName`** : C'est le lien direct avec ton `CREATE TABLE accounts`. Si tu fais une faute de frappe ici, Sequelize dira "Table non trouvée".
* **`timestamps`** : Si ton SQL a des colonnes `created_at` et `updated_at`, mets-le à `true`. Si tu n'en as pas (comme dans la table `roles` par exemple), mets-le à `false`.

#### Placement des attributs spécifiques
* **Validation côté Code** : On place les `validate` (comme `isEmail`) dans le premier bloc. C'est une sécurité avant même que la donnée ne touche la base de données.
* **Mapping Nom de Colonne** : Si ton nom de propriété JS (ex: `firstName`) est différent du nom SQL (ex: `first_name`), tu peux ajouter `field: 'first_name'` à l'intérieur de l'attribut.



---

**C'est cette structure que tu dois suivre pour tous tes fichiers dans `/models`. Est-ce que tu te sens prêt à l'appliquer pour créer ton fichier `Account.js` et faire ton push sur ta branche ?**