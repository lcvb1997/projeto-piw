<template>

    <body>
        <header class="reservas-header">
            <h1>Reservas de Mesas</h1>
            <router-link to="/perfil" class="perfil-button">Perfil</router-link>
        </header>
        <div class="reservas-container">
            <div class="reservas-tabela">
                <div class="tabela-header">
                    <span>Mesa</span>
                    <span>Assentos</span>
                    <span>Status</span>
                    <span>Ação</span>
                </div>
                <!-- Renderizar dinamicamente as mesas -->
                <div v-for="table in tables" :key="table.id" class="tabela-row">
                    <span class="mesa">{{ table.number }}</span>
                    <span class="assentos">{{ table.capacity }}</span>
                    <span class="horario">{{ table.isBooked ? "Reservada" : "Disponível" }}</span>
                    <div class="acao-container">
                        <button :disabled="table.isBooked || userHasReservation" @click="reservarMesa(table.id)"
                            class="reservas-button">
                            {{ table.isBooked ? "Reservada" : "Reservar" }}
                        </button>
                        <!-- Exibir o botão "Excluir Reserva" apenas se o usuário for admin -->
                        <button v-if="table.isBooked && isAdmin" @click="excluirReserva(table.id)"
                            class="reservas-button">
                            Excluir Reserva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const tables = ref([]);
        const userHasReservation = ref(false);
        const isAdmin = ref(false); // Armazenar se o usuário é admin

        // Função para buscar as mesas do backend
        const fetchTables = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtém o token do localStorage
                if (!token) {
                    console.error('Token não encontrado.');
                    return;
                }

                const response = await axios.get('http://localhost:8090/tables', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });

                console.log('Mesas recebidas:', response.data.data);
                tables.value = response.data.data; // Preencher as mesas com os dados do backend
            } catch (error) {
                console.error('Erro ao buscar as mesas:', error.response ? error.response.data : error.message);
            }
        };

        // Função para verificar se o usuário já fez uma reserva
        const checkUserReservation = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtém o token do localStorage
                if (!token) {
                    console.error('Token não encontrado.');
                    return;
                }

                const response = await axios.get('http://localhost:8090/reservas/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });

                console.log('Reserva do usuário:', response.data.hasReservation);
                userHasReservation.value = response.data.hasReservation; // Atualiza o estado
            } catch (error) {
                console.error('Erro ao verificar reserva do usuário:', error.response ? error.response.data : error.message);
            }
        };

        // Função para reservar uma mesa
        const reservarMesa = async (tableId) => {
            try {
                if (userHasReservation.value) {
                    alert('Você já reservou uma mesa.');
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado.');
                    return;
                }

                // Reserva a mesa
                await axios.put(`http://localhost:8090/tables/${tableId}`, {
                    isBooked: true,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });

                // Atualiza a lista de mesas
                await fetchTables(); // Chama a função para buscar as mesas novamente
                userHasReservation.value = true; // Atualiza o estado da reserva do usuário

                // Opcional: exibir uma mensagem de sucesso
                alert('Mesa reservada com sucesso!');
            } catch (error) {
                console.error('Erro ao reservar a mesa:', error.response ? error.response.data : error.message);
            }
        };

        // Função para excluir a reserva de uma mesa
        const excluirReserva = async (tableId) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token não encontrado.');
                    return;
                }

                // Excluir a reserva
                await axios.delete(`http://localhost:8090/reservas/${tableId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                });

                // Atualiza a lista de mesas
                await fetchTables(); // Chama a função para buscar as mesas novamente
                userHasReservation.value = false; // Atualiza o estado da reserva do usuário

                // Opcional: exibir uma mensagem de sucesso
                alert('Reserva excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir a reserva:', error.response ? error.response.data : error.message);
            }
        };

        const checkUserRole = () => {
            const storedRole = localStorage.getItem('role'); // Obtém a role como string
            if (storedRole) {
                try {
                    const roleObj = JSON.parse(storedRole); // Tenta deserializar
                    if (roleObj && roleObj.name === 'admin') { // Verifica se a role é 'admin'
                        isAdmin.value = true; // Define isAdmin como true
                    } else {
                        isAdmin.value = false; // Define isAdmin como false
                    }
                } catch (e) {
                    console.error('Erro ao analisar a role:', e);
                }
            } else {
                isAdmin.value = false; // Define isAdmin como false se a role não existir
            }
        };


        onMounted(async () => {
            await fetchTables(); // Chama a função ao montar o componente
            await checkUserReservation(); // Verifica se o usuário já tem uma reserva
            checkUserRole(); // Verifica se o usuário é admin a partir do localStorage
        });

        return {
            tables,
            reservarMesa,
            excluirReserva,
            userHasReservation,
            isAdmin, // Retorna isAdmin para ser utilizado no template
        };
    },
};
</script>

<style scoped>
/* Estilo igual ao anterior */
body,
html {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    flex-direction: column;
    /* Alinha os elementos verticalmente */
    align-items: center;
    /* Centraliza horizontalmente */
    min-height: 100vh;
    /* Altura mínima para ocupar toda a tela */
}
.acao-container {
    display: flex; /* Exibe os botões lado a lado */
    gap: 10px; /* Espaçamento entre os botões */
}

.reservas-header {
    width: 100%;
    /* Faz o cabeçalho ocupar toda a largura */
    background-color: #fff;
    /* Fundo branco para o cabeçalho */
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    /* Sombra para destaque */
    display: flex;
    justify-content: space-between;
    /* Alinha o h1 e o botão */
    align-items: center;
    padding: 20px;
    /* Espaçamento interno */
}

.reservas-header h1 {
    font-size: 24px;
    color: #333;
    margin: 0;
    /* Remove margens para centralizar */
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
    /* Inclui padding na largura total */
    margin-top: 40px;
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
