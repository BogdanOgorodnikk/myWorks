<template>
  <td class="transaction-totals">
    <div v-if="isShownLabels.income" class="transaction-totals-wrapper">
      <div class="transaction-totals-title">
        {{ $t("label.cashFlowTypes.income") }}
      </div>

      <div
        v-for="(number, index) in transactionTotalsEmptyBlockCounts.income"
        :key="index"
        class="transaction-totals-empty-block"
      />
    </div>

    <div v-if="isShownLabels.expense" class="transaction-totals-wrapper">
      <div class="transaction-totals-title">
        {{ $t("label.cashFlowTypes.expense") }}
      </div>

      <div
        v-for="(number, index) in transactionTotalsEmptyBlockCounts.expense"
        :key="index"
        class="transaction-totals-empty-block"
      />
    </div>

    <div class="transaction-totals-balance">
      {{ $t("label.cashFlowTypes.balance") }}
    </div>
  </td>
</template>

<script>
export default {
  props: {
    transactionTotals: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    isShownLabels() {
      return {
        income: this.transactionTotals?.income?.length,
        expense: this.transactionTotals?.expense?.length,
      };
    },

    transactionTotalsEmptyBlockCounts() {
      return {
        income: this.transactionTotals?.income?.length - 1,
        expense: this.transactionTotals?.expense?.length - 1,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.transaction-totals {
  @apply text-right align-top;

  &-wrapper {
    @apply mb-4;
  }

  &-title {
    @apply text-sm font-normal text-base-dark;
    @apply mb-1;
  }

  &-empty-block {
    @apply mb-1 block;
    @apply h-4 w-1;
  }

  &-balance {
    @apply text-sm font-bold text-base-dark;
  }
}
</style>
