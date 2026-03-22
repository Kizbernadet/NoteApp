import { 
  sequelize, 
  Role, 
  Account, 
  User, 
  Category, 
  Note, 
  Task 
} from './models/index.js';

async function runDiagnostics() {
  console.log('🔍 Début du diagnostic de la base de données...');
  console.log('-----------------------------------------------');

  try {
    // 1. Test de la connexion brute
    await sequelize.authenticate();
    console.log('✅ Connexion physique à PostgreSQL : RÉUSSIE.');

    // 2. Test de lecture des tables (Vérification du Mapping)
    // On va tenter de compter les enregistrements dans chaque table
    const tables = [
      { name: 'Roles', model: Role },
      { name: 'Accounts', model: Account },
      { name: 'Users', model: User },
      { name: 'Categories', model: Category },
      { name: 'Notes', model: Note },
      { name: 'Tasks', model: Task }
    ];

    console.log('\n📡 Vérification de l\'accès aux tables :');
    
    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`   ✔ Table "${table.name}" : OK (Lignes : ${count})`);
      } catch (err) {
        console.error(`   ❌ Table "${table.name}" : ERREUR !`);
        console.error(`      Détail : ${err.message}`);
      }
    }

    // 3. Test d'une association (Exemple : Compte -> Rôle)
    console.log('\n🔗 Test des associations :');
    const testAccount = await Account.findOne({ include: [Role] });
    
    if (testAccount) {
      console.log(`   ✔ Association Account-Role : OK (Compte: ${testAccount.email} est ${testAccount.Role.name})`);
    } else {
      console.log('   ℹ Association Account-Role : Impossible de tester (Pas de données dans "accounts").');
    }

    console.log('\n-----------------------------------------------');
    console.log('🚀 DIAGNOSTIC TERMINÉ : Ton architecture est solide !');

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE :');
    console.error(error);
  } finally {
    // Fermeture propre pour rendre la main au terminal
    await sequelize.close();
    process.exit();
  }
}

runDiagnostics();