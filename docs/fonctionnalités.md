Toutes les fonctionnallités 


Fonctionnalités Terminées


Fonctionnalités en cours 


Tests Accomplis 

Comptes tests créés 


# 🚀 Taskly - Suivi des Fonctionnalités

## 📂 1. Authentification & Comptes
- [x] Modèle de données double (Accounts & Users)
- [x] Inscription (Signup) avec **Transaction SQL** (Account + User)
- [x] Hachage des mots de passe (bcrypt)
- [x] Connexion (Login) avec génération de Token **JWT**
- [] Gestion des rôles (Admin/User) - *Rôle 'user' par défaut ok*
- [x] Déconnexion (Logout)
- [x] Profil utilisateur (GET /me)

## 🏷️ 2. Gestion des Catégories
- [x] Création de catégorie (POST) - **[EN COURS]** *(Bloqué par ID user)*
- [x] Liste des catégories (GET)
- [] Modification de catégorie (PUT)
- [] Suppression de catégorie (DELETE)

## 📝 3. Gestion des Tâches (Tasks)
- [x] Création de tâche (POST) - **[PRÊT À TESTER]** *(Logique validée)*
- [x] Liste des tâches (GET) - **[À CORRIGER]** *(Passer de .id à .accountId)*
- [x] Modification de tâche (PUT/PATCH) - *Changement de statut, titre, etc.*
- [x] Suppression de tâche (DELETE)
- [ ] Filtrage par catégorie / priorité

## 📓 4. Gestion des Notes (Bonus)
- [x] Afficher toutes les notes
- [x] Créer une nouvelle note
- [ ] Modifier une note
- [ ] Supprimer une note
- [ ] Filter par catégorie / priorité


---

## 🛠️ État du Backend (Technique)
- **Base de données** : PostgreSQL (Sequelize ORM)
- **Serveur** : Node.js / Express
- **Sécurité** : Middleware d'authentification JWT (injecte `req.user.accountId`)
- **Stabilité** : Utilisation de Transactions pour les créations liées


## Comptes tests 
## Compte Admin 
{
    "email": "admin@taskly.com",
    "password": "admin_password_123", 
    "firstname": "admin", 
    "lastname": "taskly"
}

## Comptes Utilisateurs Créés
{
    "email": "test@taskly.com",
    "password": "password123",
    "first_name": "Jean",
    "last_name": "Test"
}