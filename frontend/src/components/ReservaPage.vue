<template>
  <div>
    <header class="reservas-header">
      <h1>Reservas de Mesas</h1>
      <div class="header-buttons">
        <router-link to="/perfil" class="perfil-button">Perfil</router-link>
        <router-link v-if="isAdmin" to="/usuarios" class="reservas-button">Usuários</router-link>
        <button @click="logout" class="reservas-button">Logout</button>
      </div>
    </header>
    <div class="reservas-container">
      <button v-if="isAdmin" @click="adicionarMesa" class="reservas-button">Adicionar Mesa</button>
      <div class="reservas-tabela">
        <div class="tabela-header">
          <span>Mesa</span>
          <span>Assentos</span>
          <span>Status</span>
          <span>Ação</span>
        </div>
        <div v-for="table in tables" :key="table.id" class="tabela-row">
          <span class="mesa">{{ table.number }}</span>
          <span class="assentos">{{ table.capacity }}</span>
          <span class="horario">{{ table.isBooked ? "Reservada" : "Disponível" }}</span>
          <div class="acao-container">
            <button :disabled="table.isBooked" @click="reservarMesa(table.id)"
              class="reservas-button">
              {{ table.isBooked ? "Reservada" : "Reservar" }}
            </button>
            <button v-if="table.isBooked && isAdmin" @click="excluirReserva(table.id)" class="reservas-button">
              Excluir Reserva
            </button>
            <button v-if="isAdmin" @click="confirmarExcluirMesa(table.id, table.isBooked)" class="reservas-button">
              Excluir Mesa
            </button>
          </div>
        </div>
      </div>
      <div class="role-info" v-if="isAdmin">
        <p>Você está logado como: <strong>Admin</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const tables = ref([]);
    const isAdmin = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const fetchTables = async () => {
      try {
        const token = authStore.token;
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        const response = await axios.get('http://localhost:8090/tables', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        tables.value = response.data.data.sort((a, b) => a.number - b.number);
      } catch (error) {
        console.error('Erro ao buscar as mesas:', error.response ? error.response.data : error.message);
      }
    };

    const adicionarMesa = async () => {
      try {
        const token = authStore.token;
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        const existingNumbers = tables.value.map(table => table.number);
        let newNumber = 1;
        while (existingNumbers.includes(newNumber)) {
          newNumber++;
        }

        const newTable = {
          number: newNumber,
          capacity: 4,
          isBooked: false,
        };

        await axios.post('http://localhost:8090/tables', newTable, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchTables();
        alert('Mesa adicionada com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar a mesa:', error.response ? error.response.data : error.message);
      }
    };

    const confirmarExcluirMesa = (tableId, isBooked) => {
      if (isBooked) {
        const confirmDelete = confirm("Você deseja excluir a mesa? Ela possui uma reserva.");
        if (!confirmDelete) {
          return;
        }
      }
      excluirMesa(tableId);
    };

    const excluirMesa = async (tableId) => {
      try {
        const token = authStore.token;
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        await axios.delete(`http://localhost:8090/tables/${tableId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchTables();
        alert('Mesa excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir a mesa:', error.response ? error.response.data : error.message);
      }
    };

    const excluirReserva = async (tableId) => {
      try {
        const token = authStore.token;
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        await axios.delete(`http://localhost:8090/reservas/${tableId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchTables();
        alert('Reserva excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir a reserva:', error.response ? error.response.data : error.message);
      }
    };

    const reservarMesa = async (tableId) => {
      try {
        const token = authStore.token;
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        await axios.put(`http://localhost:8090/tables/${tableId}`, {
          isBooked: true,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchTables();
        alert('Mesa reservada com sucesso!');
      } catch (error) {
        console.error('Erro ao reservar a mesa:', error.response ? error.response.data : error.message);
      }
    };

    const checkUserRole = () => {
      const role = authStore.userData.role;
      isAdmin.value = role && role.name === 'admin';
    };

    const logout = () => {
      authStore.clearAuth();
      alert('Logout concluído com sucesso!');
      router.push('/login');
    };

    onMounted(async () => {
      await fetchTables();
      checkUserRole();
    });

    return {
      tables,
      reservarMesa,
      excluirMesa,
      excluirReserva,
      adicionarMesa,
      confirmarExcluirMesa,
      isAdmin,
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
  font-family: 'Arial', sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.header-buttons {
  display: flex;
  gap: 10px;
}

.reservas-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.perfil-button {
  background-color: #ffcb69;
  color: #d00000;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.perfil-button:hover {
  background-color: #ffba08;
}

.reservas-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
  margin: 40px auto;
}

.reservas-tabela {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tabela-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

.tabela-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
}

.reservas-button {
  background-color: #ffcb69;
  color: #d00000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.reservas-button:hover {
  background-color: #ffba08;
}

.reservas-button[disabled] {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
</style>
