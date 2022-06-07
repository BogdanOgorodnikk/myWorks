<template>
  <td>
    <div v-if="isShownBlocks.income" class="transaction-totals-wrapper income">
      <OurMoney
        v-for="(item, index) in transactionTotals.income"
        :key="index"
        class="transaction-totals-factual"
        :item="item.factual"
        :integer="!isShownCents"
      />
    </div>
    <div v-if="isShownBlocks.expense" class="transaction-totals-wrapper expense">
      <OurMoney
        v-for="(item, index) in transactionTotals.expense"
        :key="index"
        class="transaction-totals-factual"
        :item="item.factual"
        :integer="!isShownCents"
      />
    </div>
    <div>
      <OurMoney
        v-for="(item, index) in transactionTotals.balance"
        :key="index"
        :item="item.factual"
        :integer="!isShownCents"
      />
    </div>
  </td>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    transactionTotals: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters("settings", ["isShownCents"]),

    isShownBlocks() {
      return {
        income: this.transactionTotals?.income?.length,
        expense: this.transactionTotals?.expense?.length,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.transaction-totals {
  &-wrapper {
    @apply mb-4;
  }

  &-factual {
    &::v-deep {
      .money-block {
        @apply whitespace-nowrap text-base-dark;

        .sum {
          @apply ml-0;
        }
      }
    }
  }
}
</style>
