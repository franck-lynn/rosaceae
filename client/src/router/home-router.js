const homeRoutes = [
    {
        path: '/app-home',
        name: 'app-home',
        component: () => import('@/components/home/app-home.vue')
    }
]

export { homeRoutes }