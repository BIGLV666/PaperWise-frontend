import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomePage from '@/views/HomePage.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/review',
        name: 'review',
        component: () => import('../views/ReviewView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path:'/homepage',
        name:'homepage',
        component:HomePage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫：检查登录
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' ) {
       next('/login')
    }else if(token){
        next('/homepage')
    }
     else {
        next()
    }
})

export default router