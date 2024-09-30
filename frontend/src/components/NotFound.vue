<template>
  <div class="not-found">
    <h1>Página Não Encontrada</h1>
    <p>Desculpe, a página que você está procurando não existe.</p>
    <router-link :to="redirectLink">Voltar</router-link>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'NotFound',
  computed: {
    redirectLink() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? '/reserva' : '/login';
    },
  },
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>
