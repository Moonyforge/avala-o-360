<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
   <main class="input-box">
    
    <form  onsubmit="return validarLogin()">
        <h1>Login</h1>
       
        <div class="input-box">
            <input id="login" placeholder="Email e matrícula" type="text" required>
            <i class="bx bxs-user"></i>
        </div>
       
        <div class="input-box">
            <input id="senha" placeholder="senha" type="password"   required>
            <i class="bx bxs-lock-alt"></i>
        </div>
       
        <div class="remember-forgot">
            <label>
                <input type="checkbox"> Lembrar a minha senha
            </label>
            <a href="#">Esqueci minha senha</a>
        </div>

        <button type="submit">Entrar</button>
        
        <div class="registrer-link">
            <p>Não tem uma conta? <a href='cadastro.html'>Cadrastre-se</a></p>
        </div>
    </form>
   </main>
   <script src="script.js"></script>
</body>
</html>



