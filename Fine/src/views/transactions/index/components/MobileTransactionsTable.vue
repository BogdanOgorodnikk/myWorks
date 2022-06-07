<template>
  <div class="mobile-table" :class="pwaTableHeight" @scroll="onScrollChangeCurrentDate">
    <div class="mobile-table-header">
      <OurButton
        class="mobile-table-header-button"
        text=""
        variant="transparent"
        @click="onClickGoToFilter"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" name="Filter" class="mobile-table-header-button-icon" />
        </template>
      </OurButton>

      <div class="mobile-table-header-date">
        <OurButton
          v-if="plannedTransactionsState.hidden"
          size="sm"
          :text="$tc('button.viewPlannedTransactions', totalPlannedTransactions)"
          variant="link"
          @click="onClickTogglePlannedTransactions"
        />

        <OurButton
          v-if="plannedTransactionsState.shown"
          size="sm"
          :text="$t('button.hidePlannedTransactions')"
          variant="link"
          @click="onClickTogglePlannedTransactions"
        />

        <div class="mobile-table-fixed-date">{{ currentDate }}</div>
      </div>

      <OurButton
        class="mobile-table-header-button"
        text=""
        variant="transparent"
        @click="onClickChangeTableType"
      >
        <template #icon-left>
          <OurSvgIcon size="sm" name="Layout-grid" class="mobile-table-header-button-icon" />
        </template>
      </OurButton>
    </div>

    <div
      v-for="(tableItem, index) in transactionsForMobileTable"
      :key="index"
      class="mobile-table-block"
    >
      <div class="mobile-table-block-date">{{ tableItem.date }}</div>

      <div
        v-for="(item, idx) in tableItem.items"
        :key="idx"
        class="mobile-table-block-wrapper"
        @click="onClickOpenEditPage(item.id, item.money.type)"
      >
        <div>
          <div class="mobile-table-block-title">{{ item.title }}</div>
          <div class="mobile-table-block-descriptions">{{ item.descriptions }}</div>
        </div>

        <OurMoney :item="item.money" :integer="!isShownCents" size="lg" />
      </div>
    </div>

    <OurButton
      v-if="transactionsMeta.hasMorePages"
      size="sm"
      :text="$t('button.showMore')"
      variant="transparent"
      class="more-transactions-button"
      @click="onClickShowMore"
    />
  </div>
</template>

<script>
import { TRANSACTIONS_VIEW_TYPE } from "../constants";
import { mapGetters, mapState } from "vuex";
import { isPWA } from "@ilevel/our.service.ui";

export default {
  props: {
    tableView: {
      type: String,
      default: "",
    },

    futureTransactionsState: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    currentDate: "",
  }),

  computed: {
    ...mapState("transaction", ["totalPlannedTransactions", "transactionsMeta"]),

    ...mapGetters("transaction", ["transactionsForMobileTable"]),
    ...mapGetters("settings", ["isShownCents"]),

    pwaTableHeight() {
      return isPWA ? "mobile-table-pwa-height" : "";
    },

    plannedTransactionsState() {
      return {
        shown: this.futureTransactionsState === true,
        hidden: this.futureTransactionsState === false,
      };
    },
  },

  watch: {
    transactionsForMobileTable: "onChangeTransactionsForMobileTable",
  },

  created() {
    this.setFirstCurrentDate();
  },

  methods: {
    onClickGoToFilter() {
      this.$router.push({ name: "TransactionsFilter" });
    },

    onClickOpenEditPage(transactionId, type) {
      this.$router.push({
        name: "TransactionsEdit",
        params: { id: transactionId },
        query: { type },
      });
    },

    onChangeTransactionsForMobileTable() {
      this.setFirstCurrentDate();
    },

    onClickChangeTableType() {
      this.$emit("update:tableView", TRANSACTIONS_VIEW_TYPE.calendar);
    },

    setFirstCurrentDate() {
      this.currentDate = this.currentDate
        ? this.currentDate
        : this.transactionsForMobileTable[0]?.date;
    },

    onScrollChangeCurrentDate() {
      const transactionsHeader = document.querySelector(".mobile-table-header");
      const headerPositionBottom = transactionsHeader.getBoundingClientRect().bottom;
      const halfHeightTransactionsHeader = transactionsHeader.getBoundingClientRect().height / 2;

      const allDays = document.querySelectorAll(".mobile-table-block");

      let allDaysData = [];

      allDays.forEach((day) => {
        const position = day.getBoundingClientRect();
        const date = day.querySelector(".mobile-table-block-date");

        allDaysData.push({
          text: date.textContent,
          positionBottom: position.bottom + halfHeightTransactionsHeader,
        });
      });

      const newDayData = allDaysData.find(
        (item) => item.positionBottom >= headerPositionBottom && item.positionBottom > 0
      );

      if (newDayData) this.currentDate = newDayData.text;
    },

    onClickShowMore() {
      this.$emit("showMore");
    },

    onClickTogglePlannedTransactions() {
      this.$emit("togglePlannedTransactions");

      this.currentDate = "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-table {
  @apply rounded-t-2xl bg-base-light;
  @apply -mt-3.5 p-4;
  @apply overflow-y-scroll;
  height: calc(100vh - 15.8125rem);

  &-pwa-height {
    height: calc(100vh - 15.375rem);
  }

  &-fixed-date {
    @apply text-sm font-normal text-gray-500;
    @apply pt-1;
  }

  &-header {
    @apply flex items-center justify-between;
    @apply rounded-t-2xl bg-base-light;
    @apply fixed left-0;
    @apply w-full;
    @apply -mt-4 p-4;

    &-button {
      @apply h-11 w-11;

      &-icon {
        &::v-deep g [fill] {
          @apply fill-current text-base-dark;
        }
      }
    }

    &-date {
      @apply flex flex-col items-center;
    }
  }

  &-block {
    @apply mt-4;

    &-date {
      @apply text-center text-sm font-normal text-gray-500;
      @apply pb-9;
    }

    &-wrapper {
      @apply flex items-start justify-between;
      @apply mb-9 cursor-pointer;

      &:last-child {
        @apply mb-0;
      }
    }

    &-title {
      @apply text-sm font-normal text-base-dark;
    }

    &-descriptions {
      @apply text-xs font-normal text-gray-500;
      @apply pt-1;
    }
  }
}

.more-transactions-button {
  @apply mx-auto mt-4;
}
</style>
