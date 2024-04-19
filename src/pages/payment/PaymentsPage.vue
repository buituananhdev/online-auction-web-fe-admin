<script setup lang="ts">
import { ref } from 'vue'
import PaymentsTable from './widgets/PaymentsTable.vue'
import EditPaymentForm from './widgets/EditPaymentForm.vue'
import { Payment } from './types'
import { usePayments } from './composables/usePayments'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { payments, isLoading, filters, sorting, pagination, ...usersApi } = usePayments()

const userToEdit = ref<Payment | null>(null)

const showEditUserModal = (user: Payment) => {
    userToEdit.value = user
    doShowEditUserModal.value = true
}

// const showAddUserModal = () => {
//     userToEdit.value = null
//     doShowEditUserModal.value = true
// }

const { init: notify } = useToast()

const onUserSaved = async (user: Payment) => {
    if (userToEdit.value) {
        await usersApi.update(user)
        notify({
            message: `${user.id} has been updated`,
            color: 'success',
        })
    } else {
        usersApi.add(user)
        notify({
            message: `${user.id} has been created`,
            color: 'success',
        })
    }
}

const onUserDelete = async (user: Payment) => {
    await usersApi.remove(user)
    notify({
        message: `${user.id} has been deleted`,
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
    <h1 class="page-title">Payments</h1>

    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <div class="flex flex-col md:flex-row gap-2 justify-start">
                    <VaInput v-model="filters.search" placeholder="Search">
                        <template #prependInner>
                            <VaIcon name="search" color="secondary" size="small" />
                        </template>
                    </VaInput>
                </div>
                <!-- <VaButton @click="showAddUserModal">Add User</VaButton> -->
            </div>

            <PaymentsTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :payments="payments"
                :loading="isLoading"
                :pagination="pagination"
                @editUser="showEditUserModal"
                @deleteUser="onUserDelete"
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
        <h1 class="va-h5">{{ userToEdit ? 'Edit payment' : 'Add payment' }}</h1>
        <EditPaymentForm
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
