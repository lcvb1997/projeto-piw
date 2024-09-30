<template>
  <body>
    <div class="container">
      <h1>Cadastro</h1>
      <form id="register-form" @submit.prevent="register" novalidate>
        <div class="input-group">
          <label for="register-name">Nome:</label>
          <input type="text" v-model="name" id="register-name" name="name">
        </div>
        <div class="input-group">
          <label for="register-username">Nome de usuário:</label>
          <input type="text" v-model="username" id="register-username" name="username">
        </div>
        <div class="input-group">
          <label for="register-email">Email:</label>
          <input type="email" v-model="email" id="register-email" name="email">
        </div>
        <div class="input-group">
          <label for="register-password">Senha:</label>
          <input type="password" v-model="password" id="register-password" name="password">
        </div>
        <div class="input-group">
          <label for="register-role">Role:</label>
          <select v-model="role" id="register-role" name="role">
            <option value="" disabled selected>Selecione uma opção</option>
            <option value="admin">Admin</option>
            <option value="usuário">Usuário</option>
          </select>
        </div>
        <button type="submit" class="button">Registrar</button>
      </form>
      <button id="go-to-login" class="button" @click="goToLogin">Login</button>
    </div>
  </body>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const name = ref('');
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('');

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validate = () => {
      if (!name.value) {
        alert('Por favor, preencha o campo Nome.');
        return false;
      }

      if (!username.value) {
        alert('Por favor, preencha o campo Nome de usuário.');
        return false;
      }

      if (!email.value) {
        alert('Por favor, preencha o campo Email.');
        return false;
      } else if (!validateEmail(email.value)) {
        alert('Por favor, insira um email válido no formato completo (exemplo@example.com).');
        return false;
      }

      if (!password.value) {
        alert('Por favor, preencha o campo Senha.');
        return false;
      }

      if (!role.value) {
        alert('Por favor, selecione um papel.');
        return false;
      }

      return true; // validação bem-sucedida
    };

    const register = async () => {
      if (!validate()) {
        return; // não prossegue caso a validação falhar
      }

      try {
        const response = await axios.post('http://localhost:8090/users', {
          name: name.value,
          username: username.value,
          email: email.value,
          password: password.value,
          role: role.value
        });

        if (response && response.data) {
          alert('Usuário cadastrado com sucesso!');
          router.push('/login');
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) { // Conflito: caso email ou username já estejam cadastrados
            alert('Esse email ou nome de usuário já está cadastrado. Por favor, use outro.');
          } else if (error.response.data.error) {
            alert(error.response.data.error.message);
          } else {
            alert('Erro ao tentar cadastrar o usuário. Tente novamente.');
          }
        }
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };

    return {
      register,
      goToLogin,
      authStore,
      name,
      username,
      email,
      password,
      role
    };
  }
};
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
  text-align: left;
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
  text-align: left;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  box-sizing: border-box;
}

.button {
  background-color: #ffcb69;
  color: #d00000;
  border: none;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #ffba08;
}
</style>
