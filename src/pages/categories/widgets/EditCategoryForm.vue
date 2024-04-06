<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Category } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
    category: {
        type: Object as PropType<Category | null>,
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

const defaultNewCategory: Category = {
    id: '',
    categoryName: '',
    status: 1,
}

const newCategory = ref<Category>({ ...defaultNewCategory })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newCategory.value).some((key) => {
        if (key === 'avatar' || key === 'projects') {
            return false
        }

        return (
            newCategory.value[key as keyof Category] !== (props.category ?? defaultNewCategory)?.[key as keyof Category]
        )
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.category,
    () => {
        if (!props.category) {
            return
        }

        newCategory.value = {
            ...props.category,
        }
    },
    { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
    if (form.validate()) {
        emit('save', newCategory.value)
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
                    v-model="newCategory.categoryName"
                    label="Category name"
                    class="w-full sm:w-1/2"
                    :rules="[validators.required]"
                    name="categoryName"
                />
            </div>

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
