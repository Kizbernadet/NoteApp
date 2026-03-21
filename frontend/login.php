<?php
include "includes/config.php";

if(isset($_POST['login'])){

$email=$_POST['email'];
$password=$_POST['password'];

$sql=$pdo->prepare("SELECT * FROM users WHERE email=?");
$sql->execute([$email]);

$user=$sql->fetch();

if($user && password_verify($password,$user['password'])){
$_SESSION['user_id']=$user['id'];
header("Location: dashboard.php");
}else{
echo "Email ou mot de passe incorrect";
}

}
?>

<form method="POST">
<h2>Connexion</h2>

<input type="email" name="email" placeholder="Email" required>

<input type="password" name="password" placeholder="Mot de passe" required>

<button name="login">Connexion</button>

<a href="register.php">Créer compte</a>

</form>