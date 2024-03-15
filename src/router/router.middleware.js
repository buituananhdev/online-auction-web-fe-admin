import router from '.'
export const authMiddleware = () => {
    router.beforeEach((to, from, next) => {
        console.log('beforeEach aa', to, from)
        const isLoggedIn = localStorage.getItem('access_token')
        console.log('1')
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            console.log('2')
            if (!isLoggedIn) {
                next({ name: 'auth/login' })
                console.log('3')
            } else {
                console.log('4')

                next()
                // handle logged in user permission
                // const user = authStore.value.user
                // const userRole = user.role
                // if (to.meta.roles && !to.meta.roles.includes(userRole)) {
                //     console.log('403')
                // }
            }
        } else {
            if (isLoggedIn && to.name == 'auth/login') {
                console.log('5')
                next({ name: 'dashboard' })
            } else {
                next()
            }
        }
    })
}
