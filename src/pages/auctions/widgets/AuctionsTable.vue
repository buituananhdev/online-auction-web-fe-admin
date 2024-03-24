<script setup lang="ts">
import moment from 'moment'
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Auction } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting, ProductStatusNames, ConditionNames } from '../../../data/pages/auctions'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'Product Name', key: 'productName', sortable: true },
    { label: 'Description', key: 'description', sortable: false },
    { label: 'Seller', key: 'seller.fullName', sortable: false },
    { label: 'Starting Price', key: 'startingPrice', sortable: false },
    { label: 'Condition', key: 'condition', sortable: false },
    { label: 'Status', key: 'productStatus', sortable: false },
    { label: 'End Time', key: 'endTime', sortable: false },
    { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
    auctions: {
        type: Array as PropType<Auction[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
    (event: 'edit-user', user: Auction): void
    (event: 'delete-user', user: Auction): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const auctions = toRef(props, 'auctions')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (user: Auction) => {
    const agreed = await confirm({
        title: 'Delete auction',
        message: `Are you sure you want to delete ${user.productName}?`,
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
        :items="auctions"
        :loading="$props.loading"
    >
        <template #cell(productName)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[150px] ellipsis">
                <!-- <UserAvatar :user="rowData as User" size="small" /> -->
                {{ rowData.productName }}
            </div>
        </template>

        <template #cell(description)="{ rowData }">
            <div class="max-w-[400px] ellipsis">
                {{ rowData.description }}
            </div>
        </template>

        <template #cell(seller)="{ rowData }">
            <div class="max-w-[200px] ellipsis">
                {{ rowData.seller.fullName }}
            </div>
        </template>

        <template #cell(startingPrice)="{ rowData }">
            <div class="max-w-[100px] ellipsis">
                {{ rowData.startingPrice }}
            </div>
        </template>

        <template #cell(condition)="{ rowData }">
            <div class="max-w-[120px] ellipsis">
                {{ ConditionNames[rowData.condition] }}
            </div>
        </template>

        <template #cell(productStatus)="{ rowData }">
            <div class="max-w-[120px] ellipsis">
                {{ ProductStatusNames[rowData.productStatus] }}
            </div>
        </template>

        <template #cell(endTime)="{ rowData }">
            <div class="max-w-[200px] ellipsis">
                {{ moment(rowData.endTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
        </template>

        <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-edit"
                    aria-label="Edit auction"
                    @click="$emit('edit-user', rowData as Auction)"
                />
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-delete"
                    color="danger"
                    aria-label="Delete auction"
                    @click="onUserDelete(rowData as Auction)"
                />
            </div>
        </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
        <div>
            <b>{{ $props.pagination.total }} results.</b>
            Results per page
            <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
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
