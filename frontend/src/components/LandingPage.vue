<template>
  <div class="landing-container">
    <header class="header">
      <div class="header-content">
        <h1>Reservas</h1>
      </div>
    </header>
    <div class="content">
      <h2>Sinta-se à vontade em nossa plataforma</h2>
      <p>Descubra uma nova maneira de fazer uma reserva. Registre-se e aproveite nossos serviços incríveis!</p>
      <div class="button-container">
        <router-link to="/login" class="button">Login</router-link>
        <router-link to="/register" class="button">Cadastro</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.landing-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;
  padding-top: 80px;
}

.header {
  width: 100%;
  background-color: white;
  padding: 20px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin-top: 100px;
}

h2 {
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: bold;
}

p {
  margin-bottom: 40px;
  font-size: 1.2rem;
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffcb69;
  color: #d00000;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  height: 50px;
  text-decoration: none;
}

.button:hover {
  background-color: #ffba08;
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .content {
    padding: 20px;
  }

  h2 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
