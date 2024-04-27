<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Bid } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/bids'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'STT', key: 'id', sortable: true },
    { label: 'Bidder Id', key: 'userId', sortable: true },
    { label: 'Product Id', key: 'auctionId', sortable: true },
    { label: 'Amount', key: 'bidAmount', sortable: true },
    { label: 'Time', key: 'bidTime', sortable: true },
])

const props = defineProps({
    bids: {
        type: Array as PropType<Bid[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const bids = toRef(props, 'bids')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
    <VaDataTable
        v-model:sort-by="sortByVModel"
        v-model:sorting-order="sortingOrderVModel"
        :columns="columns"
        :items="bids"
        :loading="$props.loading"
    >
        <template #cell(id)="{ rowIndex }">
            <div class="max-w-[100px] ellipsis">
                {{ rowIndex + 1 }}
            </div>
        </template>

        <template #cell(userId)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.userId }}
            </div>
        </template>

        <template #cell(auctionId)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.auctionId }}
            </div>
        </template>

        <template #cell(bidAmount)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.bidAmount }}
            </div>
        </template>

        <template #cell(bidTime)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[230px] ellipsis">
                {{ rowData.bidTime }}
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
