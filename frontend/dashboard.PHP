<?php
include "includes/config.php";

if(!isset($_SESSION['user_id'])){
header("Location: login.php");
}

$stmt=$pdo->prepare("SELECT * FROM notes WHERE user_id=? ORDER BY created_at DESC");
$stmt->execute([$_SESSION['user_id']]);

$notes=$stmt->fetchAll();
?>

<link rel="stylesheet" href="assets/style.css">

<div class="container">

<h1>Mes Notes</h1>

<a href="add_note.php" class="btn">Ajouter</a>
<a href="logout.php" class="btn">Logout</a>

<div class="notes">

<?php foreach($notes as $note): ?>

<div class="note">

<h3><?= $note['title'] ?></h3>

<p><?= $note['content'] ?></p>

<a href="delete_note.php?id=<?= $note['id'] ?>">Supprimer</a>

</div>

<?php endforeach; ?>

</div>

</div>