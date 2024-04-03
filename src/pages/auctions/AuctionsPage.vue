<script setup lang="ts">
import { ref } from 'vue'
import AuctionsTable from './widgets/AuctionsTable.vue'
import EditAuctionForm from './widgets/EditAuctionForm.vue'
import { Auction } from './types'
import { useAuctions } from './composables/useAuctions'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { auctions, isLoading, filters, sorting, pagination, ...usersApi } = useAuctions()

const userToEdit = ref<Auction | null>(null)

const showEditUserModal = (user: Auction) => {
    userToEdit.value = user
    doShowEditUserModal.value = true
}

// const showAddUserModal = () => {
//     userToEdit.value = null
//     doShowEditUserModal.value = true
// }

const { init: notify } = useToast()

const onUserSaved = async (user: Auction) => {
    if (userToEdit.value) {
        await usersApi.update(user)
        notify({
            message: `${user.productName} has been updated`,
            color: 'success',
        })
    } else {
        usersApi.add(user)
        notify({
            message: `${user.productName} has been created`,
            color: 'success',
        })
    }
}

const onConditionChange = async (user: Auction) => {
    await usersApi.changeCondition(user)
    notify({
        message: `${user.productName} has been changed`,
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
    <h1 class="page-title">Auctions</h1>

    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <div class="flex flex-col md:flex-row gap-2 justify-start whitespace-nowrap">
                    <VaButtonToggle
                        v-model="filters.condition"
                        color="background-element"
                        border-color="background-element"
                        :options="[
                            { label: 'New', value: 1 },
                            { label: 'Open Box', value: 2 },
                            { label: 'Used', value: 3 },
                        ]"
                    />
                    <VaInput v-model="filters.search" placeholder="Search">
                        <template #prependInner>
                            <VaIcon name="search" color="secondary" size="small" />
                        </template>
                    </VaInput>
                </div>
                <!-- <VaButton @click="showAddUserModal">Add User</VaButton> -->
            </div>

            <AuctionsTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :auctions="auctions"
                :loading="isLoading"
                :pagination="pagination"
                @editUser="showEditUserModal"
                @changeCondition="onConditionChange"
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
        <h1 class="va-h5">{{ userToEdit ? 'Edit auction' : 'Add auction' }}</h1>
        <EditAuctionForm
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
