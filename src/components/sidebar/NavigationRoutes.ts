export interface INavigationRoute {
    name: string
    displayName: string
    meta: { icon: string }
    children?: INavigationRoute[]
}

export default {
    root: {
        name: '/',
        displayName: 'navigationRoutes.home',
    },
    routes: [
        // {
        //     name: 'dashboard',
        //     displayName: 'menu.dashboard',
        //     meta: {
        //         icon: 'vuestic-iconset-dashboard',
        //     },
        // },
        {
            name: 'users',
            displayName: 'menu.users',
            meta: {
                icon: 'group',
            },
        },
        {
            name: 'categories',
            displayName: 'menu.categories',
            meta: {
                icon: 'category',
            },
        },
        {
            name: 'bids',
            displayName: 'menu.bids',
            meta: {
                icon: 'attach_money',
            },
        },
        {
            name: 'auctions',
            displayName: 'menu.auctions',
            meta: {
                icon: 'shopping_cart',
            },
        },
        {
            name: 'payment',
            displayName: 'menu.payments',
            meta: {
                icon: 'credit_card',
            },
        },
        // {
        //     name: 'payments',
        //     displayName: 'menu.payments',
        //     meta: {
        //         icon: 'credit_card',
        //     },
        //     children: [
        //         {
        //             name: 'payment-methods',
        //             displayName: 'menu.payment-methods',
        //         },
        //         {
        //             name: 'pricing-plans',
        //             displayName: 'menu.pricing-plans',
        //         },
        //         {
        //             name: 'billing',
        //             displayName: 'menu.billing',
        //         },
        //     ],
        // },
        // router auth
        // {
        //     name: 'auth',
        //     displayName: 'menu.auth',
        //     meta: {
        //         icon: 'login',
        //     },
        //     children: [
        //         {
        //             name: 'login',
        //             displayName: 'menu.login',
        //         },
        //         {
        //             name: 'signup',
        //             displayName: 'menu.signup',
        //         },
        //         {
        //             name: 'recover-password',
        //             displayName: 'menu.recover-password',
        //         },
        //     ],
        // },

        // {
        //     name: 'faq',
        //     displayName: 'menu.faq',
        //     meta: {
        //         icon: 'quiz',
        //     },
        // },
        // {
        //     name: '404',
        //     displayName: 'menu.404',
        //     meta: {
        //         icon: 'vuestic-iconset-files',
        //     },
        // },
        // {
        //     name: 'preferences',
        //     displayName: 'menu.preferences',
        //     meta: {
        //         icon: 'manage_accounts',
        //     },
        // },
        // {
        //     name: 'settings',
        //     displayName: 'menu.settings',
        //     meta: {
        //         icon: 'settings',
        //     },
        // },
    ] as INavigationRoute[],
}
