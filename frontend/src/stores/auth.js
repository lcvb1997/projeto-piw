import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token') || '';
    const user = JSON.parse(localStorage.getItem('user')) || {
      name: '',
      username: '',
      email: '',
      id: '',
      role: { id: '', name: '' },
      hasReservation: false,
    };

    return {
      token,
      userData: user,
    };
  },

  actions: {
    setUser(data) {
      console.log('Dados recebidos para setUser:', data);
      this.userData = {
        name: data.name || '',
        username: data.username || '',
        email: data.email || '',
        id: data.userId || data.id || '',
        role: data.role || { id: '', name: '' },
        hasReservation: data.hasReservation || false,
      };
      console.log('Dados na store após setUser:', this.userData);
      localStorage.setItem('user', JSON.stringify(this.userData));
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    clearAuth() {
      this.token = '';
      this.userData = {
        name: '',
        username: '',
        email: '',
        id: '',
        role: { id: '', name: '' },
        hasReservation: false,
      };
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    // Adicionei a função logout
    logout() {
      this.clearAuth(); // Limpa os dados de autenticação
    },

    setReservationStatus(hasReservation) {
      this.userData.hasReservation = hasReservation;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
