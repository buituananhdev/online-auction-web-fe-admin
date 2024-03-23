<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Bid } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
    bid: {
        type: Object as PropType<Bid | null>,
        default: null,
    },
    saveButtonLabel: {
        type: String,
        default: 'Save',
    },
})

const defaultNewUser: Bid = {
    id: -1,
    bidderId: -1,
    productId: -1,
    bidAmount: 0,
    bidTime: '',
}

const newUser = ref<Bid>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newUser.value).some((key) => {
        if (key === 'avatar' || key === 'projects') {
            return false
        }

        return newUser.value[key as keyof Bid] !== (props.bid ?? defaultNewUser)?.[key as keyof Bid]
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.bid,
    () => {
        if (!props.bid) {
            return
        }

        newUser.value = {
            ...props.bid,
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
                    v-model="newUser.bidderId"
                    label="Bidder Id"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="bidderId"
                />
                <VaInput
                    v-model="newUser.productId"
                    label="Product Id"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="productId"
                />
            </div>

            <div class="flex gap-4 w-full">
                <VaInput
                    v-model="newUser.bidAmount"
                    label="Bid Amount"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="bidAmount"
                />
            </div>

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
