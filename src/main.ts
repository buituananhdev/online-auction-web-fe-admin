import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { initAuthStore } from './stores/auth.store'
import { authMiddleware } from './router/router.middleware'
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue'

const initApp = async () => {
    authMiddleware()
    await initAuthStore()
    const app = createApp(App)

    app.use(stores)
    app.use(router)
    app.use(i18n)
    app.use(createVuestic({ config: vuesticGlobalConfig }))

    if (import.meta.env.VITE_APP_GTM_ENABLED) {
        app.use(
            createGtm({
                id: import.meta.env.VITE_APP_GTM_KEY,
                debug: false,
                vueRouter: router,
            }),
        )
    }

    app.use(Notifications)
    app.mount('#app')
}
initApp()
