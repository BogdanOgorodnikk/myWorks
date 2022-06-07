<template>
  <div class="calendar">
    <div v-for="(item, index) in calendarItems" :key="index" class="calendar-wrapper">
      <div class="calendar-date">{{ item.month }} {{ item.year }}</div>

      <div class="calendar-week">
        <div v-for="(day, idx) in dayOfWeeks" :key="idx" class="calendar-week-day">
          {{ day }}
        </div>
      </div>

      <div class="calendar-table">
        <CalendarItem v-for="(day, idx) in item.days" :key="idx" :calendar="day" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Calendar from "../services/calendar";
import CalendarItem from "./CalendarItem";

export default {
  components: {
    CalendarItem,
  },

  props: {
    stardDate: {
      type: Number,
      default: 1640763963,
    },
    endDate: {
      type: Number,
      default: 1672299963,
    },
  },

  data() {
    return {
      calendarItems: [],
      dayOfWeeks: [
        this.$t("label.dayOfWeekShort.monday"),
        this.$t("label.dayOfWeekShort.tuesday"),
        this.$t("label.dayOfWeekShort.wednesday"),
        this.$t("label.dayOfWeekShort.thursday"),
        this.$t("label.dayOfWeekShort.friday"),
        this.$t("label.dayOfWeekShort.saturday"),
        this.$t("label.dayOfWeekShort.sunday"),
      ],
    };
  },

  computed: {
    ...mapState("transaction", ["calendarTransactions"]),

    ...mapGetters("settings", ["baseCurrency"]),
  },

  watch: {
    calendarTransactions: {
      handler: "onChangeCalendarTransactions",
      deep: true,
    },
  },

  async created() {
    await this.getCalendarTransactions();

    this.createCalendar();
  },

  methods: {
    ...mapActions("transaction", ["getCalendarTransactions"]),

    createCalendar() {
      const calendar = new Calendar(
        this.stardDate,
        this.endDate,
        this.calendarTransactions,
        this.baseCurrency
      );

      this.calendarItems = calendar.getData();
    },

    async onChangeCalendarTransactions() {
      if (!this.calendarTransactions.length) {
        await this.getCalendarTransactions();
        this.createCalendar();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.calendar {
  @apply rounded-lg bg-white shadow;
  @apply mt-6;

  &-wrapper {
    @apply mb-6;
  }

  &-week {
    @apply flex;

    &-day {
      @apply text-sm font-medium text-gray-400;
      @apply flex flex-auto justify-end;
      @apply py-2 pr-4;
    }
  }

  &-table {
    @apply grid grid-cols-7;
  }

  &-date {
    @apply text-2lg font-bold text-base-dark;
    @apply p-4;
  }
}
</style>
