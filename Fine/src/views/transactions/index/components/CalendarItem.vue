<template>
  <div class="wrapper" :class="calendarItemClass">
    <div class="calendar-table-date">
      <span class="calendar-table-date-month">{{ calendar.month }}</span>

      <span class="calendar-table-date-number">
        {{ calendar.dayNumber }}
      </span>
    </div>

    <OurMoney v-if="calendar.income.sum" :item="calendar.income" :integer="!isShownCents" />

    <OurMoney v-if="calendar.expense.sum" :item="calendar.expense" :integer="!isShownCents" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    calendar: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters("settings", ["isShownCents"]),

    calendarItemClass() {
      return {
        "other-month": this.calendar.otherMonth,
        "current-day": this.calendar.isCurrentDay,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex flex-col items-end;
  @apply border-t border-r border-gray-200;
  @apply h-[5.8125rem] w-full;
  @apply py-2 pl-2 pr-4;

  &:nth-of-type(7n) {
    @apply border-r-0;
  }
}

.calendar-table-date {
  @apply flex items-center;
  @apply text-sm font-normal text-base-dark;
  @apply py-1.5 pl-1.5 pr-0;

  &-month {
    @apply pr-1;
  }
}

.other-month {
  @apply bg-gray-100;

  .calendar-table-date {
    @apply text-gray-400;
  }
}

.current-day {
  .calendar-table-date {
    @apply pt-0;
  }

  .calendar-table-date-number {
    @apply flex items-center justify-center;
    @apply text-white;
    @apply rounded-full bg-base-dark;
    @apply -mr-1.5 px-1.5 pt-[0.40625rem] pb-[0.34375rem];
    @apply h-7 w-7;
  }
}
</style>
