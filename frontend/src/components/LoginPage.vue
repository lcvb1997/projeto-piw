<template>
    <body>
        <div class="container">
            <h1>Bem-vindo</h1>
            <form id="login-form" @submit="login">
                <div class="input-group">
                    <label for="login-username">Nome de usuário:</label>
                    <input type="text" id="login-username" v-model="username">
                </div>
                <div class="input-group">
                    <label for="login-password">Senha:</label>
                    <input type="password" id="login-password" v-model="password">
                </div>
                <button type="submit" class="button">Login</button>
            </form>
            <router-link to="/register" class="button">Registrar</router-link>
        </div>
    </body>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
    setup() {
        const username = ref('');
        const password = ref('');
        const router = useRouter();
        const authStore = useAuthStore();

        const login = async (event) => {
            event.preventDefault();

            // Validação dos campos
            if (!username.value) {
                alert('Por favor, preencha o nome de usuário.');
                return;
            }
            if (!password.value) {
                alert('Por favor, preencha a senha.');
                return;
            }

            console.log('Tentando fazer login com:', { username: username.value, password: password.value });

            try {
                const response = await axios.post('http://localhost:8090/login', {
                    username: username.value,
                    password: password.value,
                });

                const token = response.data.data ? response.data.data.jwt : response.data.jwt;

                if (token) {
                    alert('Login realizado com sucesso!');

                    authStore.setToken(token);
                    authStore.setUser({
                        userId: response.data.data.user.id,
                        username: response.data.data.user.username,
                        email: response.data.data.user.email,
                        name: response.data.data.user.name,
                        role: response.data.data.user.role,
                    });

                    console.log('Dados do usuário na store após login:', authStore.userData);

                    // Limpa os campos de nome de usuário e senha
                    username.value = '';
                    password.value = '';

                    // redirecionar para a página desejada após o login
                    router.push('/reserva');
                } else {
                    alert('Erro ao realizar o login. Verifique suas credenciais.');
                }
            } catch (error) {
                console.error('Erro durante o login:', error);
                alert('Erro ao tentar realizar o login. Tente novamente.');
            }
        };

        return {
            username,
            password,
            login,
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
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #fff;
}

.container {
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 400px;
    padding: 20px;
    text-align: center;
}

h1 {
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
}

.button {
    display: inline-block;
    background-color: #ffcb69;
    color: #d00000;
    border: none;
    border-radius: 5px;
    padding: 15px;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-align: center;
    box-sizing: border-box;
    height: 50px;
}

.button:hover {
    background-color: #ffba08;
}

@media (max-width: 600px) {
    .container {
        width: 100%;
        margin: 10px;
    }
}
</style>
