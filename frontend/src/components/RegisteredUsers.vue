<template>
    <div>
        <header class="usuarios-header">
            <h2>Usuários Cadastrados</h2>
            <div class="header-buttons">
                <router-link to="/reserva" class="reservas-button">Voltar</router-link>
                <button @click="logout" class="reservas-button">Logout</button>
            </div>
        </header>

        <div class="reservas-container">
            <button @click="abrirModal" class="reservas-button">Buscar usuário por ID</button>

            <div class="usuarios-tabela">
                <div class="tabela-header">
                    <span>ID</span>
                    <span>Nome</span>
                    <span>Username</span>
                    <span>Email</span>
                    <span>Papel</span>
                    <span>Ação</span>
                </div>
                <div v-for="user in users" :key="user.id" class="tabela-row">
                    <span class="id">{{ user.id }}</span>
                    <span class="nome">{{ user.name }}</span>
                    <span class="username">{{ user.username }}</span>
                    <span class="email">{{ user.email }}</span>
                    <span class="papel">{{ user.role.name }}</span>
                    <div class="acao-container">
                        <button @click="editarUsuario(user.id)" class="reservas-button">Editar</button>
                        <button v-if="user.id !== authStore.userData.id" @click="excluirUsuario(user.id)" class="reservas-button">Excluir</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal-content">
                <h2>Buscar Usuário por ID</h2>
                <input v-model="searchId" type="text" placeholder="Digite o ID do usuário" />
                <div class="modal-buttons">
                    <button @click="buscarUsuarioPorId" class="reservas-button">Buscar</button>
                    <button @click="fecharModal" class="reservas-button">Cancelar</button>
                </div>
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
        const users = ref([]);
        const searchId = ref('');
        const isModalOpen = ref(false);
        const authStore = useAuthStore();
        const router = useRouter();

        const fetchUsers = async () => {
            try {
                const token = authStore.token;
                if (!token) {
                    alert('Token não encontrado. Faça login novamente.');
                    return;
                }

                const response = await axios.get('http://localhost:8090/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                users.value = response.data.data;
            } catch (error) {
                alert('Erro ao buscar usuários: ' + (error.response ? error.response.data.message : error.message));
            }
        };

        const buscarUsuarioPorId = async () => {
            if (!searchId.value) {
                alert('Por favor, digite um ID.');
                return;
            }

            try {
                const token = authStore.token;
                const response = await axios.get(`http://localhost:8090/users/${searchId.value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // redireciona para a página de perfil do usuário usando o ID encontrado
                router.push({ name: 'UserPage', params: { id: response.data.data.id } });
                fecharModal();
            } catch (error) {
                // redireciona para a página de ID não encontrado
                router.push('/id-not-found');
            }
        };

        const abrirModal = () => {
            isModalOpen.value = true;
        };

        const fecharModal = () => {
            isModalOpen.value = false;
            searchId.value = '';
        };

        const editarUsuario = (userId) => {
            router.push({ name: 'EditAdmin', params: { id: userId } });
        };

        const excluirUsuario = async (userId) => {
            if (confirm("Você realmente deseja excluir este usuário? Caso ele possua uma mesa reservada, a mesa também será excluída.")) {
                try {
                    const token = authStore.token;
                    await axios.delete(`http://localhost:8090/users/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    await fetchUsers();
                    alert('Usuário excluído com sucesso!');
                } catch (error) {
                    alert('Erro ao excluir usuário: ' + (error.response ? error.response.data.message : error.message));
                }
            }
        };

        const logout = () => {
            authStore.clearAuth();
            alert('Logout concluído com sucesso!');
            router.push('/login');
        };

        onMounted(fetchUsers);

        return {
            users,
            searchId,
            isModalOpen,
            buscarUsuarioPorId,
            abrirModal,
            fecharModal,
            editarUsuario,
            excluirUsuario,
            logout,
            authStore,
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

.usuarios-header {
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

.usuarios-tabela {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tabela-header,
.tabela-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 150px;
    padding: 15px;
    border-radius: 5px;
    align-items: center;
}

.tabela-header {
    background-color: #e0e0e0;
    font-weight: bold;
}

.tabela-row {
    background-color: #f9f9f9;
    margin-bottom: 10px;
}

.tabela-header span,
.tabela-row span {
    padding: 0 10px;
    white-space: nowrap;
}

.acao-container {
    display: flex;
    gap: 10px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
    width: 300px;
    text-align: center;
}

.modal-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}

.modal-content input {
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>
