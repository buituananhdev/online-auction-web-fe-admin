<script setup lang="ts">
import { ref } from 'vue'
import CategoriesTable from './widgets/CategoriesTable.vue'
import EditCategoryForm from './widgets/EditCategoryForm.vue'
import { Category } from './types'
import { useCategories } from './composables/useCategories'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { categories, isLoading, filters, sorting, pagination, ...usersApi } = useCategories()

const userToEdit = ref<Category | null>(null)

const showEditUserModal = (user: Category) => {
    userToEdit.value = user
    doShowEditUserModal.value = true
}

const showAddUserModal = () => {
    userToEdit.value = null
    doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: Category) => {
    if (userToEdit.value) {
        await usersApi.update(user)
        notify({
            message: `${user.categoryName} has been updated`,
            color: 'success',
        })
    } else {
        await usersApi.add(user)
        notify({
            message: `${user.categoryName} has been created`,
            color: 'success',
        })
    }
}

const onChangeStatus = async (user: Category) => {
    await usersApi.changeStatus(user)
    notify({
        message: `${user.categoryName} has been changed`,
        color: 'success',
    })
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
    if (editFormRef.value.isFormHasUnsavedChanges) {
        const agreed = await confirm({
            maxWidth: '380px',
            message: 'Form has unsaved changes. Are you sure you want to close it?',
            size: 'small',
        })
        if (agreed) {
            hide()
        }
    } else {
        hide()
    }
}
</script>

<template>
    <h1 class="page-title">Categories</h1>

    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <div class="flex flex-col md:flex-row gap-2 justify-start">
                    <VaButtonToggle
                        v-model="filters.status"
                        color="background-element"
                        border-color="background-element"
                        :options="[
                            { label: 'Active', value: 1 },
                            { label: 'Inactive', value: 2 },
                        ]"
                    />
                    <VaInput v-model="filters.search" placeholder="Search">
                        <template #prependInner>
                            <VaIcon name="search" color="secondary" size="small" />
                        </template>
                    </VaInput>
                </div>
                <VaButton @click="showAddUserModal">Add User</VaButton>
            </div>

            <CategoriesTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :categories="categories"
                :loading="isLoading"
                :pagination="pagination"
                @editUser="showEditUserModal"
                @changeStatus="onChangeStatus"
            />
        </VaCardContent>
    </VaCard>

    <VaModal
        v-slot="{ cancel, ok }"
        v-model="doShowEditUserModal"
        size="small"
        mobile-fullscreen
        close-button
        hide-default-actions
        :before-cancel="beforeEditFormModalClose"
    >
        <h1 class="va-h5">{{ userToEdit ? 'Edit category' : 'Add category' }}</h1>
        <EditCategoryForm
            ref="editFormRef"
            :user="userToEdit"
            :save-button-label="userToEdit ? 'Save' : 'Add'"
            @close="cancel"
            @save="
                (user) => {
                    onUserSaved(user)
                    ok()
                }
            "
        />
    </VaModal>
</template>
