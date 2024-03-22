<template>
    <VaForm ref="form" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">Log in</h1>
        <p class="text-base mb-4 leading-5">
            New to Vuestic?
            <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
        </p>
        <VaInput
            v-model="email"
            :rules="[validators.required, validators.email]"
            class="mb-4"
            label="Email"
            type="email"
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
                v-model="password"
                :rules="[validators.required]"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                label="Password"
                @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
            >
                <template #appendInner>
                    <VaIcon
                        :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
                        class="cursor-pointer"
                        color="secondary"
                    />
                </template>
            </VaInput>
        </VaValue>

        <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <VaCheckbox v-model="keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
            <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
                Forgot password?
            </RouterLink>
        </div>

        <div class="flex justify-center mt-4">
            <VaButton class="w-full" @click="submit"> Login</VaButton>
        </div>
    </VaForm>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { initAuthStore } from '../../stores/auth.store'
import { loginApi } from '../../services/auth.service'
import { useNotification } from '@kyvg/vue3-notification'
const notification = useNotification()
const router = useRouter()
const email = ref('')
const password = ref('')
const keepLoggedIn = ref('')

const { validate } = useForm('form')
// const { push } = useRouter()
// const { init } = useToast()

// const formData = reactive({
//     email: '',
//     password: '',
//     keepLoggedIn: false,
// })

const submit = async () => {
    if (validate()) {
        // init({ message: "You've successfully logged in", color: 'success' })
        // push({ name: 'dashboard' })

        try {
            await loginApi({ email: email.value, password: password.value }).then((res) => {
                const data = res.data
                console.log('data', data)
                localStorage.setItem('access_token', data.accessToken)
                localStorage.setItem('refresh_token', data.refreshToken)
            })
            await initAuthStore()
            router.push({ name: 'dashboard' })
        } catch (error) {
            notification.notify({
                type: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Vui lòng kiểm tra lại thông tin đăng nhập!',
            })
            console.log(error)
        }
    }
}
</script>
