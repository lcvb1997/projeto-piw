import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import ReservaPage from '../components/ReservaPage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import EditarPerfil from '@/components/EditarPerfil.vue';
import LandingPage from '../components/LandingPage.vue';
import RegisteredUsers from '@/components/RegisteredUsers.vue';
import UserPage from '@/components/UserPage.vue';
import NotFound from '@/components/NotFound.vue';
import IdNotfound from '@/components/IdNotfound.vue';
import EditAdmin from '@/components/EditAdmin.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/reserva',
    name: 'ReservaPage',
    component: ReservaPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/editadmin/:id',
    name: 'EditAdmin',
    component: EditAdmin,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/editperfil/:id',
    name: 'EditarPerfil',
    component: EditarPerfil,
    props: true,
    meta: { requiresAuth: true, },
  },
  {
    path: '/usuarios',
    name: 'RegisteredUsers',
    component: RegisteredUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/user-page/:id',
    name: 'UserPage',
    component: UserPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/id-not-found',
    name: 'idNotfound',
    component: IdNotfound,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:catchAll(.*)*', // Rota catch-all
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//Autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'LoginPage' });
    }
    
    // Verifica se a rota requer admin
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!isAdmin(authStore)) {
        return next({ name: 'NotFound' }); // Redireciona para NotFound se não for admin
      }
    }
  }
  next();
});

// verificar se o usuário é admin
const isAdmin = (authStore) => {
  return authStore.userData.role && authStore.userData.role.id === 1; // Verifica se o ID da role é 1
};

export default router;
