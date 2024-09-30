<template>
  <div class="container">
    <header class="reservas-header">
      <h1>Informações da Conta</h1>
      <div class="header-buttons">
        <button @click="goBack" class="reservas-button">Voltar</button>
      </div>
    </header>
    <div id="user-info" class="perfil-info" v-if="user">
      <div class="info-item"><strong>Nome:</strong> {{ user.name }}</div>
      <div class="info-item"><strong>Username:</strong> @{{ user.username }}</div>
      <div class="info-item"><strong>Email:</strong> {{ user.email }}</div>
      <div class="info-item"><strong>User ID:</strong> {{ user.id }}</div>
      <div class="info-item"><strong>Papel:</strong> {{ user.role.name }}</div>
    </div>
    <div v-else>
      <p>Carregando dados do usuário...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const user = ref(null);
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

    const fetchUserData = async () => {
      const token = authStore.token;

      try {
        const response = await axios.get(`http://localhost:8090/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        user.value = response.data.data;
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Houve um problema ao carregar os dados do usuário. Tente novamente mais tarde.');
      }
    };

    const goBack = () => {
      router.push('/usuarios');
    };

    const logout = () => {
      if (confirm("Você tem certeza que deseja sair?")) {
        authStore.clearAuth();
        alert('Logout realizado com sucesso!');
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      goBack,
      logout,
    };
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.reservas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.reservas-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.reservas-button {
  background-color: #ffcb69;
  color: #d00000;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reservas-button:hover {
  background-color: #ffba08;
}

.perfil-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

strong {
  font-size: 16px;
  color: #555;
}

p {
  font-size: 16px;
  color: #777;
  margin: 0;
}

@media (max-width: 600px) {
  .container {
    padding: 15px;
  }
}
</style>
