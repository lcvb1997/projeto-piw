<template>
  <div>
    <header class="reservas-header">
      <h1>Perfil do Usuário</h1>
      <div class="header-buttons">
        <router-link to="/reserva">
          <button class="reservas-button">Voltar</button>
        </router-link>
        <router-link v-if="profile.id" :to="{ name: 'EditarPerfil', params: { id: profile.id } }">
          <button class="reservas-button">Editar Perfil</button>
        </router-link>
        <button @click="logout" class="reservas-button">Logout</button>
      </div>
    </header>

    <div class="perfil-container">
      <div class="perfil-header">
        <img class="profile-picture" src="@/assets/default.jpg" alt="Foto de Perfil" />
        <h2>{{ profile.name }}</h2>
        <p class="username">@{{ profile.username }}</p>
      </div>

      <div class="perfil-info">
        <div class="info-item">
          <strong>Email:</strong>
          <p>{{ profile.email }}</p>
        </div>
        <div class="info-item">
          <strong>User ID:</strong>
          <p>{{ profile.id }}</p>
        </div>
        <div class="info-item">
          <strong>Role:</strong>
          <p>{{ profile.role.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useAuthStore } from '@/stores/auth'; // Importando a store corretamente
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore(); // Instanciando a store
    const router = useRouter();

    const profile = computed(() => ({
      name: authStore.userData.name || "Nome não encontrado",
      username: authStore.userData.username || "Username não encontrado",
      email: authStore.userData.email || "Email não encontrado",
      id: authStore.userData.id || "ID não encontrado",
      role: authStore.userData.role || { id: '', name: 'Role não encontrada' },
    }));

    const fetchUserData = async () => {
      const token = authStore.token;
      const userId = authStore.userData.id;

      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8090/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          authStore.setUser(response.data.data);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          alert('Houve um problema ao carregar seus dados. Tente novamente mais tarde.');
        }
      }
    };

    const logout = () => {
      if (confirm("Você tem certeza que deseja sair?")) {
        authStore.clearAuth();
        router.push('/login');
        alert('Logout realizado com sucesso!');
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      profile,
      logout,
    };
  },
};
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.reservas-header {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
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

.perfil-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
  margin: 80px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.perfil-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.username {
  font-size: 16px;
  color: #888;
  margin-bottom: 10px;
  font-style: italic;
}

.perfil-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
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
  .perfil-container {
    padding: 15px;
  }

  .perfil-header {
    text-align: center;
  }

  .reservas-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
