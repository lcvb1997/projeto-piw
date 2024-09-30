<template>
    <div class="not-found">
      <h1>ID de Usuário Não Encontrado</h1>
      <p>Desculpe, o usuário que você está procurando não existe.</p>
      <router-link :to="redirectLink">Voltar para a página de reservas</router-link>
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
  