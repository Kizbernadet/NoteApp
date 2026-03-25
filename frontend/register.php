<?php
include "includes/config.php";

if(isset($_POST['register'])){

$name=$_POST['name'];
$email=$_POST['email'];
$password=password_hash($_POST['password'],PASSWORD_DEFAULT);

$sql=$pdo->prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)");
$sql->execute([$name,$email,$password]);

header("Location: login.php");
}
?>

<form method="POST">
<h2>Inscription</h2>

<input type="text" name="name" placeholder="Nom" required>

<input type="email" name="email" placeholder="Email" required>

<input type="password" name="password" placeholder="Mot de passe" required>

<button name="register">S'inscrire</button>

<a href="login.php">Connexion</a>

</form>