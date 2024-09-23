<<<<<<< HEAD
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import ReservaPage from '../components/ReservaPage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import EditarPerfil from '@/components/EditarPerfil.vue';



const routes = [
      {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage
      },
      {
        path: '/reserva',
        name: 'ReservaPage',
        component: ReservaPage
      },
      {
        path: '/perfil',
        name: 'ProfilePage',
        component: ProfilePage
      },
      {
        path: '/editperfil/',
        name: 'EditarPerfil',
        component: EditarPerfil,
        props: true
      },
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  });
  
=======
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import ReservaPage from '../components/ReservaPage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import EditarPerfil from '@/components/EditarPerfil.vue';



const routes = [
      {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage
      },
      {
        path: '/reserva',
        name: 'ReservaPage',
        component: ReservaPage
      },
      {
        path: '/perfil',
        name: 'ProfilePage',
        component: ProfilePage
      },
      {
        path: '/editperfil/',
        name: 'EditarPerfil',
        component: EditarPerfil,
        props: true
      },
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  });
  
>>>>>>> caa57293c363c979019fc2d82794764dc092a357
  export default router;