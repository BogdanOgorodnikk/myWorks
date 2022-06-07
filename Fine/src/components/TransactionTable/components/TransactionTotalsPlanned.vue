<template>
  <td>
    <div v-if="isShownBlocks.income" class="transaction-totals-wrapper">
      <template v-for="(item, index) in transactionTotals.income">
        <OurMoney
          v-if="item.planned.sum"
          :key="index"
          class="transaction-totals-planned"
          :item="item.planned"
          planned
          :integer="!isShownCents"
        />

        <div v-else :key="index" class="empty-block" />
      </template>
    </div>
    <div v-if="isShownBlocks.expense" class="transaction-totals-wrapper">
      <template v-for="(item, index) in transactionTotals.expense">
        <OurMoney
          v-if="item.planned.sum"
          :key="index"
          class="transaction-totals-planned"
          :item="item.planned"
          planned
          :integer="!isShownCents"
        />

        <div v-else :key="index" class="empty-block" />
      </template>
    </div>
    <div>
      <template v-for="(item, index) in transactionTotals.balance">
        <OurMoney
          v-if="item.planned.sum"
          :key="index"
          class="transaction-totals-planned"
          :item="item.planned"
          planned
          :integer="!isShownCents"
        />

        <div v-else :key="index" class="empty-block" />
      </template>
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

  &-planned {
    &::v-deep {
      .money-block {
        @apply justify-start whitespace-nowrap;

        .sum {
          @apply ml-0;
        }
      }
    }
  }
}

.empty-block {
  @apply mb-1 block;
  @apply h-4 w-1;
}
</style>
