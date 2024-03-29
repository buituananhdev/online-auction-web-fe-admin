<template>
    <VaForm ref="form" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">Log in</h1>
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
                :rules="[validators.required, validators.customMinWidth, validators.customUppercaseLowercase]"
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

        <div class="flex justify-center mt-4">
            <VaButton class="w-full" @click="submit"> Login</VaButton>
        </div>
    </VaForm>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { initAuthStore } from '../../stores/auth.store'
import { loginApi } from '../../services/auth.service'
const router = useRouter()
const email = ref('')
const password = ref('')

const { validate } = useForm('form')
// const { push } = useRouter()
const { init: notify } = useToast()

// const formData = reactive({
//     email: '',
//     password: '',
//     keepLoggedIn: false,
// })

const submit = async () => {
    if (validate()) {
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
            notify({
                message: 'Vui lòng kiểm tra lại thông tin đăng nhập!',
                color: 'danger',
            })
            console.log(error)
        }
    }
}
</script>
