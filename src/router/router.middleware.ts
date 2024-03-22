import router from '.'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export const authMiddleware = () => {
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        console.log('beforeEach aa', to, from)
        const isLoggedIn = localStorage.getItem('access_token')
        console.log('1')
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            console.log('2')
            if (!isLoggedIn) {
                next({ name: 'login' })
                console.log('3')
            } else {
                console.log('4')

                next()
            }
        } else {
            if (isLoggedIn && to.name == 'login') {
                console.log('5')
                next({ name: 'dashboard' })
            } else {
                next()
            }
        }
    })
}
