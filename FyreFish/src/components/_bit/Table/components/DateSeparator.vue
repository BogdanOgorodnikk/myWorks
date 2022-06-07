<template>
  <tr :class="theme">
    <td :colspan="colsCount">
      <div class="date-separator-wrap">
        <div class="date-separator" :class="separatorClass"></div>
        <div class="date" :class="titleClass">{{ title }}</div>
        <div class="date-separator" :class="separatorClass"></div>
      </div>
    </td>
  </tr>
</template>

<script>
import DateService from "@ilevel/our.service.date";
import { getTheme } from "@ilevel/our.service.ui";
import { secondsToMilliseconds, isToday, isTomorrow, isYesterday } from "date-fns";

export default {
  name: "OurDateSeparator",

  props: {
    date: {
      type: Number,
      default: 0,
    },

    colsCount: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    currentDateInMilliseconds: 0,
  }),

  computed: {
    title() {
      let title = "";

      if (isToday(this.currentDateInMilliseconds)) {
        title = this.i18n.today;
      } else if (isTomorrow(this.currentDateInMilliseconds)) {
        title = this.i18n.tomorrow;
      } else if (isYesterday(this.currentDateInMilliseconds)) {
        title = this.i18n.yesterday;
      } else {
        title = new DateService().dateConverter(this.date, "dateWithFullMonth");
      }

      return title;
    },

    i18n() {
      return {
        yesterday: this.$te("component.dateSeparator.yesterday")
          ? this.$t("component.dateSeparator.yesterday")
          : this.$t("yesterday"),
        today: this.$te("component.dateSeparator.today")
          ? this.$t("component.dateSeparator.today")
          : this.$t("today"),
        tomorrow: this.$te("component.dateSeparator.tomorrow")
          ? this.$t("component.dateSeparator.tomorrow")
          : this.$t("tomorrow"),
      };
    },

    theme() {
      return getTheme();
    },

    separatorClass() {
      return isToday(this.currentDateInMilliseconds) ? "border-yellow-500" : "border-gray-200";
    },

    titleClass() {
      return isToday(this.currentDateInMilliseconds) ? "text-yellow-500" : "text-gray-400";
    },
  },

  watch: {
    date: {
      handler: "onChangeDate",
      immediate: true,
    },
  },

  methods: {
    onChangeDate() {
      this.currentDateInMilliseconds = secondsToMilliseconds(this.date);
    },
  },
};
</script>

<i18n>
en:
  yesterday: Yesterday
  today: Today
  tomorrow: Tomorrow
ru:
  yesterday: Вчера
  today: Сегодня
  tomorrow: Завтра
ua:
  yesterday: Вчора
  today: Сьогодні
  tomorrow: Завтра
</i18n>

<style lang="postcss" scoped>
td {
  @apply p-0 !important;

  .date-separator-wrap {
    @apply flex items-center justify-center;

    .date {
      @apply px-2 py-0.5;
    }

    .date-separator {
      @apply w-full;
      @apply border-t border-solid;
    }
  }
}
</style>
