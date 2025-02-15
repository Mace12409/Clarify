// `src/router/index.js`
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Test from '@/views/Test.vue';
import testing from '@/views/Testing.vue';
import ViewData from '@/views/ViewData.vue';
import Admin from '@/views/admin/Admin.vue';
import Login from '@/views/admin/Login.vue';
import NotFound from '@/views/NotFound.vue';
import store from '@/store';

const routes = [
    { path: '/', component: Home },
    { path: '/testing', component: testing },
    { path: '/test', component: Test },
    { path: '/view-data', component: ViewData },
    { path: '/admin', component: Admin, meta: { requiresAuth: true } },
    { path: '/login', component: Login },
    { path: '/:pathMatch(.*)*', component: NotFound } // Catch-all route for 404
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
        next('/login');
    } else {
        next();
    }
});

export default router;