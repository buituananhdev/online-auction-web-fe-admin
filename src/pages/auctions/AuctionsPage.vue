<script setup lang="ts">
import { ref } from 'vue'
import AuctionsTable from './widgets/AuctionsTable.vue'
import EditAuctionForm from './widgets/EditAuctionForm.vue'
import { Auction } from './types'
import { useAuctions } from './composables/useAuctions'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)
const isViewDetail = ref(false)

const { auctions, isLoading, filters, sorting, pagination, ...usersApi } = useAuctions()

const userToEdit = ref<Auction | null>(null)

const showDetailAuctionModal = (user: Auction) => {
    userToEdit.value = user
    doShowEditUserModal.value = true
    isViewDetail.value = true
}

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

const onStatusChange = async (user: Auction) => {
    await usersApi.changeStatus(user)
    notify({
        message: `${user.productName} has been changed`,
        color: 'success',
    })
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
    if (editFormRef.value.isFormHasUnsavedChanges && isViewDetail.value === false) {
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
                    <VaInput v-model="filters.search" placeholder="Search">
                        <template #prependInner>
                            <VaIcon name="search" color="secondary" size="small" />
                        </template>
                    </VaInput>
                </div>
            </div>

            <AuctionsTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :auctions="auctions"
                :loading="isLoading"
                :pagination="pagination"
                @changeStatus="onStatusChange"
                @detailAuction="showDetailAuctionModal"
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
        <h1 class="va-h5">{{ isViewDetail ? 'View Detail Auction' : 'Edit Auction' }}</h1>
        <EditAuctionForm
            ref="editFormRef"
            :auction="userToEdit"
            :save-button-label="'Save'"
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
