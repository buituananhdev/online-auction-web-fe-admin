<script setup lang="ts">
import { ref } from 'vue'
import UsersTable from './widgets/UsersTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { User } from './types'
import { useUsers } from './composables/useUsers'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useUsers()

const userToEdit = ref<User | null>(null)
const isViewDetail = ref(false)

const showEditUserModal = (user: User) => {
    isViewDetail.value = false
    userToEdit.value = user
    doShowEditUserModal.value = true
}

const showDetailUserModal = (user: User) => {
    console.log('user', user)

    userToEdit.value = user

    console.log('user-edit', userToEdit)

    doShowEditUserModal.value = true
    isViewDetail.value = true
}

const showAddUserModal = () => {
    isViewDetail.value = false
    userToEdit.value = null
    doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: User) => {
    if (userToEdit.value) {
        await usersApi.update(user)
        try {
            notify({
                message: `${user.fullName} has been updated`,
                color: 'success',
            })
        } catch (error) {
            notify({
                message: `${user.fullName} update failed`,
                color: 'danger',
            })
        }
    } else {
        await usersApi.add(user)
        try {
            notify({
                message: `${user.fullName} has been created`,
                color: 'success',
            })
        } catch (error) {
            notify({
                message: `${user.fullName} create failed`,
                color: 'danger',
            })
        }
    }
}

const onStatusChange = async (user: User) => {
    await usersApi.changeStatus(user)
    notify({
        message: `${user.fullName} has been changed`,
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
    <h1 class="page-title">Users</h1>

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

            <UsersTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :users="users"
                :loading="isLoading"
                :pagination="pagination"
                @editUser="showEditUserModal"
                @changeStatus="onStatusChange"
                @detailUser="showDetailUserModal"
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
        <h1 class="va-h5">{{ !userToEdit ? 'Add user' : isViewDetail ? 'View Detail User' : 'Edit user' }}</h1>
        <EditUserForm
            ref="editFormRef"
            :user="userToEdit"
            :save-button-label="userToEdit ? 'Save' : 'Add'"
            :hidden-status="userToEdit ? false : true"
            :view-details="isViewDetail"
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
