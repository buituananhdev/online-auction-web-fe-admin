<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Category } from '../types'
import { validators } from '../../../services/utils'
import { uploadImage } from '../../../plugins/uploadImage'
import { notify } from '@kyvg/vue3-notification'

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
    imageUrl: '',
    status: 1,
}

const previewUrl = ref(null)

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
const upload = async (event: any) => {
    try {
        console.log(event)
        const imageUrl = await uploadImage(event.target.files[0])
        newCategory.value.imageUrl = imageUrl
        previewUrl.value = imageUrl
        console.log(imageUrl)

        console.log('Upload successful:', newCategory.value.imageUrl)
    } catch (error) {
        notify({
            message: 'Failed to upload image!',
            color: 'danger',
        })
        console.error('Upload error:', error)
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
            <div class="flex gap-4 flex-col w-full justify-center">
                <VaInput
                    v-model="newCategory.categoryName"
                    label="Category name"
                    class="w-full sm:w-3/4"
                    :rules="[validators.required]"
                    name="categoryName"
                />
                <div class="flex items-center">
                    <input id="fileInput" type="file" class="file-input hidden" accept="image/*" @change="upload" />
                    <div class="flex items-center">
                        <img
                            v-if="previewUrl"
                            :src="previewUrl"
                            class="preview-image mr-10 w-[160px] h-[160px] border-2 border-gray-300 rounded-xl"
                            alt="Preview Image"
                        />
                        <label for="fileInput" class="file-label cursor-pointer py-2 px-5 border-2 rounded-xl"
                            >Choose Image</label
                        >
                    </div>
                </div>
            </div>

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
