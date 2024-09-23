<template>
  <div>
    <div class="reservas-header">
      <h1>Perfil do Usuário</h1>
      <router-link :to="{ name: 'EditarPerfil', params: { id: profile.userId } }">
        <button class="perfil-button">Editar Perfil</button>
      </router-link>
    </div>

    <div class="perfil-container">
      <div class="perfil-header">
        <img
          class="profile-picture"
          src="https://via.placeholder.com/150"
          alt="Foto de Perfil"
        />
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
          <p>{{ profile.userId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const profile = ref({
      name: "",
      username: "",
      email: "",
      userId: "",
    });

    const fetchProfile = () => {
      const storedName = localStorage.getItem("name");
      const storedUsername = localStorage.getItem("username");
      const storedEmail = localStorage.getItem("email");
      const storedUserId = localStorage.getItem("userId");

      profile.value.name = storedName || "Nome não encontrado";
      profile.value.username = storedUsername || "Username não encontrado";
      profile.value.email = storedEmail || "Email não encontrado";
      profile.value.userId = storedUserId || "ID não encontrado";
    };

    onMounted(fetchProfile);

    return {
      profile,
    };
  },
};
</script>

### Estilos atualizados
<style scoped>
/* Global */
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


/* Cabeçalho fixo e centralizado */
.reservas-header {
  width: 100%;
  max-width: 800px; /* Mesma largura máxima do container de perfil */
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto; /* Centraliza o cabeçalho */
  z-index: 10; /* Mantém o cabeçalho acima dos outros elementos */
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

/* Container de perfil centralizado */
.perfil-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
  margin: 120px auto 0; /* Centraliza o container com margem para o header */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Cabeçalho de perfil */
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

/* Informações de perfil */
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

/* Responsividade */
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
