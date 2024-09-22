<template>
    <body>
        <div class="reservas-container">
            <div class="reservas-header">
                <h1>Reservas de Restaurantes</h1>
            </div>
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
                    <button :disabled="table.isBooked || userHasReservation" @click="reservarMesa(table.id)"
                        class="reservas-button">
                        {{ table.isBooked ? "Reservada" : "Reservar" }}
                    </button>
                </div>
            </div>
        </div>
    </body>
</template>

<script>

</script>

<style scoped>
/* Estilo igual ao anterior */
body,
html {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #333;
}

.reservas-container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
    padding: 20px;
    box-sizing: border-box;
}

.reservas-header {
    text-align: center;
    margin-bottom: 20px;
}

h1 {
    font-size: 24px;
    color: #333;
}

.reservas-tabela {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

.tabela-header,
.tabela-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    align-items: center;
}

.tabela-header {
    background-color: #ffcb69;
    color: #333;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    border-bottom: 2px solid #ddd;
}

.tabela-row {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}

.tabela-row:nth-child(even) {
    background-color: #f7f7f7;
}

.mesa,
.assentos,
.horario {
    flex: 1;
    text-align: center;
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

.reservas-button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
}

.reservas-button:hover:not(:disabled) {
    background-color: #ffba08;
}

@media (max-width: 600px) {
    .reservas-container {
        padding: 15px;
    }

    .tabela-header,
    .tabela-row {
        flex-direction: column;
        align-items: flex-start;
    }

    .tabela-header span,
    .tabela-row span {
        text-align: left;
        padding: 5px 0;
    }

    .tabela-row {
        padding: 15px;
    }

    .reservas-button {
        width: 100%;
        margin-top: 10px;
    }
}
</style>
