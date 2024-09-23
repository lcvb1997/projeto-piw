<template>
    <div class="editar-reserva-container">
      <h2>Editar Perfil</h2>
  
      <!-- Exibir informações do usuário -->
      <div class="user-info">
        <p><strong>Usuário:</strong> {{ userData.username }} ({{ userData.name }})</p>
      </div>
  
      <form @submit.prevent="updateProfile">
        <div>
          <label for="name">Nome:</label>
          <input type="text" v-model="userData.name" required />
        </div>
        <div>
          <label for="username">Usuário:</label>
          <input type="text" v-model="userData.username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="userData.email" required />
        </div>
        <button type="submit">Atualizar Perfil</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    setup() {
      const userData = ref({
        name: '',
        username: '',
        email: '',
      });
      
      const router = useRouter();
      const userId = localStorage.getItem('userId'); // Assumindo que o ID do usuário está armazenado no localStorage
  
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8090/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          userData.value = response.data.data; // Preenche os dados do usuário
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error.response ? error.response.data : error.message);
        }
      };
  
      const updateProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:8090/users/${userId}`, userData.value, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // Atualiza os dados no localStorage
          localStorage.setItem('name', userData.value.name);
          localStorage.setItem('username', userData.value.username);
          localStorage.setItem('email', userData.value.email);
  
          router.push('/perfil'); // Redireciona após a atualização
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error.response ? error.response.data : error.message);
        }
      };
  
      onMounted(fetchUserData); // Busca os dados do usuário ao montar o componente
  
      return {
        userData,
        updateProfile,
      };
    },
  };
  </script>
  
  <style scoped>
  .editar-reserva-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 5px;
  }
  
  input {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 10px 15px;
    background-color: #ffcb69;
    color: #d00000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #ffba08;
  }
  </style>
  