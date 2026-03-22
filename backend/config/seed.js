import bcrypt from 'bcrypt';
import { Role, Account, User, sequelize } from '../models/index.js';

async function seed() {
  console.log('🌱 Début du remplissage de la base de données...');

  try {
    // 1. Hachage du mot de passe
    const plainPassword = 'admin_password_123'; // Change-le !
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // 2. Création du Rôle Admin
    // On utilise findOrCreate pour éviter de créer des doublons si tu relances le script
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'admin' }
    });
    console.log('✅ Rôle Admin : Prêt.');

    // 3. Création du Compte (Account)
    const [newAccount] = await Account.findOrCreate({
      where: { email: 'admin@taskly.com' },
      defaults: {
        password_hash: hashedPassword, // On stocke le hash !
        role_id: adminRole.id
      }
    });
    console.log('✅ Compte Admin : Prêt.');

    // 4. Création du Profil (User)
    await User.findOrCreate({
      where: { account_id: newAccount.id },
      defaults: {
        firstname: 'Admin',
        lastname: 'Taskly'
      }
    });
    console.log('✅ Profil Utilisateur : Prêt.');

    console.log('\n🚀 Base de données initialisée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

seed();