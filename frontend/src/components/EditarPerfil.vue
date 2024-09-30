<template>
  <div class="editar-reserva-container">
    <div class="header-buttons">
      <router-link to="/perfil">
        <button class="perfil-button">Voltar</button>
      </router-link>
      <button @click="logout" class="perfil-button">Logout</button>
    </div>
    <h2>Editar Perfil</h2>

    <div class="user-info">
      <p><strong>Usuário:</strong> {{ userData.username }} ({{ userData.name }})</p>
    </div>

    <div v-if="isAlertVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAlert">&times;</span>
        <p>{{ alertMessage }}</p>
      </div>
    </div>

    <form @submit.prevent="updateProfile">
      <div>
        <label for="name">Nome:</label>
        <input type="text" v-model="userData.name" />
      </div>
      <div>
        <label for="username">Usuário:</label>
        <input type="text" v-model="userData.username" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="userData.email" />
      </div>
      <button type="submit">Atualizar Perfil</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const userData = ref({ name: '', username: '', email: '', role: '' });
    const router = useRouter();
    const authStore = useAuthStore();
    const alertMessage = ref('');
    const isAlertVisible = ref(false);
    const userId = router.currentRoute.value.params.id;

    const fetchUserData = async () => {
      const token = authStore.token;
      const currentUserId = authStore.userData.id; // ID do usuário logado

      if (!userId || isNaN(userId)) {
        router.push({ name: 'idNotfound' });
        return;
      }

      // Verifica se o usuário está tentando editar seu próprio perfil
      if (Number(userId) !== Number(currentUserId)) {
        router.push({ name: 'idNotfound' });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8090/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Verifica se o usuário foi encontrado
        if (!response.data.data) {
          router.push({ name: 'idNotfound' }); // Redireciona se o usuário não for encontrado
          return;
        }

        userData.value = { ...response.data.data };
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        router.push({ name: 'idNotfound' }); // redireciona em caso de erro
      }
    };

    const updateProfile = async () => {
      alertMessage.value = '';
      isAlertVisible.value = false;

      // verifica se os campos estão vazios
      if (!userData.value.name.trim() || !userData.value.username.trim()) {
        alertMessage.value = 'Nome e Usuário são obrigatórios.';
        isAlertVisible.value = true;
        return; 
      }

      try {
        const token = authStore.token;

        const dataToUpdate = {
          name: userData.value.name,
          username: userData.value.username,
          email: userData.value.email,
          role: userData.value.role, // apenas para referência
        };

        const response = await axios.put(`http://localhost:8090/users/${userId}`, dataToUpdate, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualize a store com os dados do usuário atualizado
        authStore.setUser(response.data.data);

        router.push('/perfil');
      } catch (error) {
        alertMessage.value = error.response ? error.response.data.error.message : 'Erro ao atualizar perfil.';
        isAlertVisible.value = true;
        console.error('Erro ao atualizar perfil:', error.response ? error.response.data : error.message);
      }
    };

    const closeAlert = () => {
      isAlertVisible.value = false;
    };

    const logout = () => {
      if (confirm("Você tem certeza que deseja sair?")) {
        authStore.clearAuth();
        router.push('/login');
        alert('Logout realizado com sucesso!');
      }
    };

    onMounted(fetchUserData);

    return {
      userData,
      alertMessage,
      isAlertVisible,
      updateProfile,
      closeAlert,
      logout,
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

.header-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
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
  margin-left: 10px;
}

button:hover {
  background-color: #ffba08;
}

/* Estilos do modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
}
</style>
