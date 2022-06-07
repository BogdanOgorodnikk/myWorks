<template>
  <div class="mobile-table">
    <div class="mobile-table-header">
      <OurDateRangePicker v-model="paymentRange" />

      <OurButton
        class="mobile-table-header-button"
        text=""
        variant="transparent"
        @click="onClickChangeTableType"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" name="Menu" class="mobile-table-header-button-icon" />
        </template>
      </OurButton>
    </div>

    <div class="mobile-table-block">
      <MobileCalendarItem v-for="(item, index) in calendarItems" :key="index" :date="item" />
    </div>
  </div>
</template>

<script>
import { fromUnixTime, getDay, getDate } from "date-fns";
import { TRANSACTIONS_VIEW_TYPE } from "../constants";
import { mapActions, mapGetters, mapState } from "vuex";

import MobileCalendarItem from "./MobileCalendarItem";

export default {
  components: {
    MobileCalendarItem,
  },

  props: {
    tableView: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      calendarItems: [],
      paymentRange: {},
    };
  },

  computed: {
    ...mapState("transaction", ["calendarTransactions"]),

    ...mapGetters("settings", ["baseCurrency"]),
  },

  watch: {
    paymentRange: {
      deep: true,
      handler: "onChangePaymentRange",
    },
  },

  methods: {
    ...mapActions("transaction", ["getCalendarTransactions"]),

    async onChangePaymentRange() {
      const params = {
        filters: {
          paymentDate: {
            from: this.paymentRange.from,
            to: this.paymentRange.to,
          },
        },
      };

      await this.getCalendarTransactions(params);

      this.createCalendar();
    },

    onClickChangeTableType() {
      this.$emit("update:tableView", TRANSACTIONS_VIEW_TYPE.table);
    },

    createCalendar() {
      const DAY_OF_WEEK_LOCALES = [
        this.$t("label.dayOfWeekShort.sunday"),
        this.$t("label.dayOfWeekShort.monday"),
        this.$t("label.dayOfWeekShort.tuesday"),
        this.$t("label.dayOfWeekShort.wednesday"),
        this.$t("label.dayOfWeekShort.thursday"),
        this.$t("label.dayOfWeekShort.friday"),
        this.$t("label.dayOfWeekShort.saturday"),
      ];

      this.calendarItems = this.calendarTransactions.map((item) => {
        const date = fromUnixTime(item.date);
        const dayOfWeek = getDay(date);

        return {
          day: getDate(date),
          dayOfWeek: DAY_OF_WEEK_LOCALES[dayOfWeek],
          income: {
            type: "income",
            sum: item.income,
            currencySymbol: this.baseCurrency.currentSymbol,
          },
          expense: {
            type: "expense",
            sum: item.expense,
            currencySymbol: this.baseCurrency.currentSymbol,
          },
        };
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-table {
  @apply rounded-t-2xl bg-base-light;
  @apply -mt-3.5 p-4;
  @apply overflow-y-scroll;
  height: calc(100vh - 15.875rem);

  &-header {
    @apply flex items-center justify-between;
    @apply rounded-t-2xl bg-base-light;
    @apply fixed left-0;
    @apply w-full;
    @apply -mt-4 px-4 pt-4;

    &-button {
      @apply h-11 w-11;

      &-icon {
        &::v-deep g [fill] {
          @apply fill-current text-base-dark;
        }
      }
    }
  }

  &-block {
    @apply mt-14 pt-1;
  }
}
</style>
