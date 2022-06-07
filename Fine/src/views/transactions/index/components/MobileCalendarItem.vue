<template>
  <div class="wrapper">
    <div class="day-name">{{ date.dayOfWeek }}</div>

    <div class="day-block">
      <div class="day-number">{{ date.day }}</div>

      <OurMoney v-if="date.income.sum" size="lg" :item="date.income" :integer="!isShownCents" />
      <OurMoney v-if="date.expense.sum" size="lg" :item="date.expense" :integer="!isShownCents" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    date: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters("settings", ["isShownCents"]),
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex justify-between;
  @apply border-t border-gray-200;
  @apply px-2 pt-3 pb-8;

  .day {
    &-name {
      @apply text-base font-medium text-gray-400;
    }

    &-number {
      @apply text-base font-normal text-base-dark;
      @apply text-right;
      @apply pb-3;
    }
  }
}
</style>
