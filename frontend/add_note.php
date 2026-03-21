<?php
include "includes/config.php";

if(isset($_POST['save'])){

$title=$_POST['title'];
$content=$_POST['content'];

$sql=$pdo->prepare("INSERT INTO notes(title,content,user_id) VALUES(?,?,?)");
$sql->execute([$title,$content,$_SESSION['user_id']]);

header("Location: dashboard.php");
}
?>

<form method="POST">

<h2>Nouvelle note</h2>

<input type="text" name="title" placeholder="Titre">

<textarea name="content" placeholder="Votre note"></textarea>

<button name="save">Enregistrer</button>

</form>