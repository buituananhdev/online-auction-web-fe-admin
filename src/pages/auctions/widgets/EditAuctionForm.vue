<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Auction, ProductCondition, ProductStatus } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
    auction: {
        type: Object as PropType<Auction | null>,
        default: null,
    },
    saveButtonLabel: {
        type: String,
        default: 'Save',
    },
})

const defaultNewUser: Auction = {
    id: -1,
    productName: '',
    description: '',
    startingPrice: 0,
    condition: 1,
    productStatus: 1,
    endTime: new Date(),
}

const newUser = ref<Auction>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newUser.value).some((key) => {
        if (key === 'avatar' || key === 'projects') {
            return false
        }

        return newUser.value[key as keyof Auction] !== (props.auction ?? defaultNewUser)?.[key as keyof Auction]
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.auction,
    () => {
        if (!props.auction) {
            return
        }

        newUser.value = {
            ...props.auction,
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

const conditionSelectOptions: { text: string; value: ProductCondition }[] = [
    { text: 'New', value: 1 },
    { text: 'Open Box', value: 2 },
    { text: 'Used', value: 3 },
]

const statusSelectOptions: { text: string; value: ProductStatus }[] = [
    { text: 'Available', value: 1 },
    { text: 'Sold', value: 2 },
    { text: 'Deleted', value: 3 },
    { text: 'Canceled', value: 4 },
    { text: 'Pending Publish', value: 5 },
]
</script>

<template>
    <VaForm
        v-slot="{ isValid }"
        ref="add-user-form"
        class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
            <div class="flex w-full gap-4">
                <VaInput
                    v-model="newUser.productName"
                    label="Product name"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="productName"
                />
                <VaInput
                    v-model="newUser.description"
                    label="Description"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="description"
                />
            </div>

            <div class="flex gap-4 w-full">
                <div class="w-1/2">
                    <VaSelect
                        v-model="newUser.condition"
                        label="Condition"
                        class="w-full"
                        :options="conditionSelectOptions"
                        :rules="[validators.required]"
                        name="condition"
                        value-by="value"
                    />
                </div>

                <div class="w-1/2">
                    <VaSelect
                        v-model="newUser.productStatus"
                        label="Status"
                        class="w-full"
                        :options="statusSelectOptions"
                        :rules="[validators.required]"
                        name="status"
                        value-by="value"
                    />
                </div>
            </div>

            <div class="flex gap-4 w-full">
                <VaInput
                    v-model="newUser.startingPrice"
                    label="Starting Price"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="startingPrice"
                />
            </div>

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
