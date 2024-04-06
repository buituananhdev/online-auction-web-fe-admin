<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { User, UserRole, UserStatus } from '../types'
import UserAvatar from './UserAvatar.vue'
import { validators } from '../../../services/utils'

const props = defineProps({
    user: {
        type: Object as PropType<User | null>,
        default: null,
    },
    saveButtonLabel: {
        type: String,
        default: 'Save',
    },
    hiddenStatus: {
        type: Boolean,
        default: true,
    },
})

const defaultNewUser: User = {
    id: '',
    avatar: '',
    fullName: '',
    role: 1,
    notes: '',
    email: '',
    status: 1,
    phone: '',
    address: '',
    password: '',
}

const newUser = ref<User>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newUser.value).some((key) => {
        if (key === 'avatar' || key === 'projects') {
            return false
        }

        return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.user,
    () => {
        if (!props.user) {
            return
        }

        newUser.value = {
            ...props.user,
            avatar: props.user.avatar || '',
        }
    },
    { immediate: true },
)

const avatar = ref<File>()

const makeAvatarBlobUrl = (avatar: File) => {
    return URL.createObjectURL(avatar)
}

watch(avatar, (newAvatar) => {
    newUser.value.avatar = newAvatar ? makeAvatarBlobUrl(newAvatar) : ''
})

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
    if (form.validate()) {
        emit('save', newUser.value)
    }
}

const roleSelectOptions: { text: string; value: UserRole }[] = [
    { text: 'Buyer', value: 1 },
    { text: 'Seller', value: 2 },
    { text: 'Admin', value: 3 },
]

const statusSelectOptions: { text: string; value: UserStatus }[] = [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 2 },
]
</script>

<template>
    <VaForm
        v-slot="{ isValid }"
        ref="add-user-form"
        class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
        <VaFileUpload
            v-model="avatar"
            type="single"
            hide-file-list
            class="self-stretch justify-start items-center gap-4 inline-flex"
        >
            <UserAvatar :user="newUser" size="large" />
            <VaButton preset="primary" size="small">Add image</VaButton>
            <VaButton
                v-if="avatar"
                preset="primary"
                color="danger"
                size="small"
                icon="delete"
                class="z-10"
                @click.stop="avatar = undefined"
            />
        </VaFileUpload>
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
            <div class="flex gap-4 flex-col sm:flex-row w-full">
                <VaInput
                    v-model="newUser.fullName"
                    label="Full name"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="fullName"
                />
                <VaInput
                    v-model="newUser.email"
                    label="Email"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required, validators.email]"
                    name="email"
                />
            </div>

            <div class="flex gap-4 flex-col sm:flex-row w-full">
                <VaInput
                    v-model="newUser.phone"
                    label="Phone Number"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="phone"
                />
                <VaInput
                    v-model="newUser.address"
                    label="Address"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="address"
                />
            </div>

            <div class="flex gap-4 w-full">
                <div class="w-1/2">
                    <VaSelect
                        v-model="newUser.role"
                        label="Role"
                        class="w-full"
                        :options="roleSelectOptions"
                        :rules="[validators.required]"
                        name="role"
                        value-by="value"
                    />
                </div>

                <div v-if="!hiddenStatus" class="w-1/2">
                    <VaSelect
                        v-model="newUser.status"
                        label="Status"
                        class="w-full"
                        :options="statusSelectOptions"
                        :rules="[validators.required]"
                        name="status"
                        value-by="value"
                    />
                </div>
                <VaInput
                    v-if="hiddenStatus"
                    v-model="newUser.password"
                    label="Password"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required, validators.customMinWidth, validators.customUppercaseLowercase]"
                    name="password"
                />
            </div>

            <VaTextarea v-model="newUser.notes" label="Notes" class="w-full" name="notes" />
            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
