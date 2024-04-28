<script setup lang="ts">
import { ref } from 'vue'
import BidsTable from './widgets/BidsTable.vue'
import EditBidForm from './widgets/EditBidForm.vue'
import { Bid } from './types'
import { useBids } from './composables/useBids'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { bids, isLoading, filters, sorting, pagination, ...usersApi } = useBids()

const userToEdit = ref<Bid | null>(null)

const { init: notify } = useToast()

const onUserSaved = async (user: Bid) => {
    if (userToEdit.value) {
        await usersApi.update(user)
        notify({
            message: `${user.userId} has been updated`,
            color: 'success',
        })
    } else {
        usersApi.add(user)
        notify({
            message: `${user.userId} has been created`,
            color: 'success',
        })
    }
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
    <h1 class="page-title">Bids</h1>

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
            </div>

            <BidsTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :bids="bids"
                :loading="isLoading"
                :pagination="pagination"
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
        <h1 class="va-h5">{{ userToEdit ? 'Edit bid' : 'Add bid' }}</h1>
        <EditBidForm
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
