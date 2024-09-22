import { defineStore } from 'pinia';

// Criando um store chamado 'auth'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userEmail: '',
  }),
  actions: {
    login(email) {
      this.isLoggedIn = true;
      this.userEmail = email;
    },
    logout() {
      this.isLoggedIn = false;
      this.userEmail = '';
    },
  },
});