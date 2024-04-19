<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Payment } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/bids'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'STT', key: 'id', sortable: true },
    { label: 'Bidder Id', key: 'bidId', sortable: true },
    { label: 'Response', key: 'responseCode', sortable: true },
    { label: 'Transaction Number', key: 'transactionNumber', sortable: true },
    { label: 'Bank Name', key: 'bank', sortable: true },
    { label: 'Payment Amount', key: 'paymentAmount', sortable: true },
    { label: 'Time', key: 'createdAt', sortable: true },
    { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
    payments: {
        type: Array as PropType<Payment[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
    (event: 'edit-user', user: Payment): void
    (event: 'delete-user', user: Payment): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const payments = toRef(props, 'payments')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (user: Payment) => {
    const agreed = await confirm({
        title: 'Delete payment',
        message: `Are you sure you want to delete ${user.id}?`,
        okText: 'Delete',
        cancelText: 'Cancel',
        size: 'small',
        maxWidth: '380px',
    })

    if (agreed) {
        emit('delete-user', user)
    }
}
</script>

<template>
    <VaDataTable
        v-model:sort-by="sortByVModel"
        v-model:sorting-order="sortingOrderVModel"
        :columns="columns"
        :items="payments"
        :loading="$props.loading"
    >
        <template #cell(id)="{ rowIndex }">
            <div class="max-w-[100px] ellipsis">
                {{ rowIndex + 1 }}
            </div>
        </template>

        <template #cell(bidId)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.bidId }}
            </div>
        </template>

        <template #cell(responseCode)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.responseCode }}
            </div>
        </template>

        <template #cell(transactionNumber)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.transactionNumber }}
            </div>
        </template>

        <template #cell(bank)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.bank }}
            </div>
        </template>

        <template #cell(paymentAmount)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.paymentAmount }}
            </div>
        </template>

        <template #cell(createdAt)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.createdAt }}
            </div>
        </template>

        <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-edit"
                    aria-label="Edit payment"
                    @click="$emit('edit-user', rowData as Payment)"
                />
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-delete"
                    color="danger"
                    aria-label="Delete payment"
                    @click="onUserDelete(rowData as Payment)"
                />
            </div>
        </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
        <div>
            <b>{{ $props.pagination.total }} results.</b>
            Results per page
            <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100, 200]" />
        </div>

        <div v-if="totalPages > 1" class="flex">
            <VaButton
                preset="secondary"
                icon="va-arrow-left"
                aria-label="Previous page"
                :disabled="$props.pagination.page === 1"
                @click="$props.pagination.page--"
            />
            <VaButton
                class="mr-2"
                preset="secondary"
                icon="va-arrow-right"
                aria-label="Next page"
                :disabled="$props.pagination.page === totalPages"
                @click="$props.pagination.page++"
            />
            <VaPagination
                v-model="$props.pagination.page"
                buttons-preset="secondary"
                :pages="totalPages"
                :visible-pages="5"
                :boundary-links="false"
                :direction-links="false"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.va-data-table {
    ::v-deep(.va-data-table__table-tr) {
        border-bottom: 1px solid var(--va-background-border);
    }
}
</style>
