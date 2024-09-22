<template>
    <body>
      <div class="container">
        <h1>Cadastro</h1>
        <form id="register-form" @submit.prevent="() => { console.log('Formulário enviado'); register(); }">
          <div class="input-group">
            <label for="register-name">Nome:</label>
            <input type="text" v-model="name" id="register-name" name="name" required>
          </div>
          <div class="input-group">
            <label for="register-username">Nome de usuário:</label>
            <input type="text" v-model="username" id="register-username" name="username" required>
          </div>
          <div class="input-group">
            <label for="register-email">Email:</label>
            <input type="email" v-model="email" id="register-email" name="email" required>
          </div>
          <div class="input-group">
            <label for="register-password">Senha:</label>
            <input type="password" v-model="password" id="register-password" name="password" required>
          </div>
          <div class="input-group">
            <label for="register-role">Role:</label>
            <input type="text" v-model="role" id="register-role" name="role" required>
          </div>
          <button type="submit" class="button">Registrar</button>
        </form>
        <button id="go-to-login" class="button" @click="goToLogin">Login</button>
      </div>
    </body>
  </template>
  
  <script>
  
  </script>
  
  
  <style scoped>
  body, html {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #fff;
  }
  
  .container {
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 400px;
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .button {
    background-color: #ffcb69; /* Amarelo pastel */
    color: #d00000; /* Vermelho pastel */
    border: none;
    border-radius: 5px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .button:hover {
    background-color: #ffba08; /* Amarelo um pouco mais escuro */
  }
  
  /* Outros estilos... */
  </style>
  