<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Payment } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
    payment: {
        type: Object as PropType<Payment | null>,
        default: null,
    },
    saveButtonLabel: {
        type: String,
        default: 'Save',
    },
})

const defaultNewUser: Payment = {
    id: -1,
    bidId: -1,
    responseCode: -1,
    transactionNumber: -1,
    bank: '',
    paymentAmount: -1,
    createdAt: new Date(),
}

const newUser = ref<Payment>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newUser.value).some((key) => {
        if (key === 'avatar' || key === 'projects') {
            return false
        }

        return newUser.value[key as keyof Payment] !== (props.payment ?? defaultNewUser)?.[key as keyof Payment]
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.payment,
    () => {
        if (!props.payment) {
            return
        }

        newUser.value = {
            ...props.payment,
        }
    },
    { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
    if (form.validate()) {
        emit('save', newUser.value)
    }
}
</script>

<template>
    <VaForm
        v-slot="{ isValid }"
        ref="add-user-form"
        class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
            <div class="flex gap-4 flex-col sm:flex-row w-full">
                <VaInput
                    v-model="newUser.bidId"
                    label="Bidder Id"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="userId"
                />
                <VaInput
                    v-model="newUser.bank"
                    label="Bank Name"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="bank"
                />
            </div>

            <div class="flex gap-4 w-full">
                <VaInput
                    v-model="newUser.paymentAmount"
                    label="Payment Amount"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="paymentAmount"
                />
            </div>

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
