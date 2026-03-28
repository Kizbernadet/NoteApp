
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
- [x] Modifier une note
- [x] Supprimer une note
- [ ] Filter par catégorie / priorité
- [x] Mettre une note comme favori


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



📋 TASKLY - ÉTAT D'AVANCEMENT DU PROJET
1. SYSTÈME D'AUTHENTIFICATION & SÉCURITÉ
[x] Architecture Double-Modèle : Séparation stricte entre Account (Auth) et User (Profil).

[x] Inscription Sécurisée : Logique de transaction SQL pour garantir l'intégrité des données.

[x] Protection des Mots de Passe : Hachage via Bcrypt.

[x] Gestion des Sessions : Authentification par JWT (JSON Web Token).

[x] Déconnexion : Suppression du cookie de session.

[ ] Vérification de Session (Initial Check) : Route /auth/me pour le Frontend. (Priorité : Critique)

[ ] Contrôle d'Accès Admin : Middleware isAdmin pour restreindre les routes sensibles. (Priorité : Haute)

[ ] Sécurité Applicative : Mise en place de Helmet et Rate-Limiting. (Priorité : Haute)

2. GESTION DES DONNÉES (NOTES & TÂCHES)
[x] CRUD Complet (Notes) : Création, lecture, modification, suppression.

[x] CRUD Complet (Tâches) : Gestion des statuts (pending/completed) et priorités.

[x] Actions de Masse (Bulk) : Mise à jour et suppression groupée sécurisée par ID utilisateur.

[x] Organisation (Catégories) : Création de catégories personnalisées et gestion du fallback "Général".

[ ] Moteur de Recherche : Filtrage par mots-clés, catégories et priorités sur les listes. (Priorité : Moyenne)

[ ] Archivage (Soft Delete) : Système de corbeille pour éviter les suppressions définitives accidentelles. (Priorité : Basse)

3. ADMINISTRATION & MAINTENANCE
[ ] Tableau de Bord Admin : Statistiques globales sur l'utilisation de la plateforme. (Priorité : Moyenne)

[ ] Modération : Possibilité d'activer ou désactiver un compte utilisateur (is_active). (Priorité : Basse)

[ ] Nettoyage de Base de Données : Logique de transfert des notes lors de la suppression d'une catégorie. (Priorité : Moyenne)

🔐 COMPTES DE TEST ET RÉFÉRENCES
Profil Administrateur
Identifiant : admin@taskly.com

Rôle attendu : admin

Usage : Test des verrous de sécurité et des routes de statistiques.

Profil Utilisateur Standard
Identifiant : test@taskly.com

Rôle attendu : user

Usage : Validation de la séparation des données (un utilisateur ne voit pas les notes d'un autre).

🛠️ STACK TECHNIQUE ACTUELLE
Runtime : Node.js / Express

Persistence : PostgreSQL via Sequelize ORM

Sécurité : JWT, Cookies HttpOnly, Bcrypt

Qualité Code : Validation manuelle des types d'ID (Integer) et des contenus obligatoires.

Pourquoi ces ajouts ? (Justifications)
Route /auth/me : Sans elle, ton Frontend ne sait pas qui est connecté quand on rafraîchit la page. C'est le pont indispensable pour la navigation.

Soft Delete : Supprimer définitivement une donnée est risqué. L'archivage est une norme dans les apps de productivité.

Validation de Schéma (Zod) : Pour éviter que ton serveur ne plante si quelqu'un envoie du texte à la place d'un nombre ou un email mal formé.