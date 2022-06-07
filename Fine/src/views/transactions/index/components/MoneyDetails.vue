<template>
  <div class="money-details">
    <div class="money-details-header">
      <div v-if="!isMobileDevice" class="money-details-header-wrapper">
        <div class="money-details-header-wrapper-title">
          {{ $t("page.transactions.moneyDetails.totalOnAccounts") }}
        </div>
        <div class="money-details-header-wrapper-close" @click="onClickCloseMoneyDetails">
          {{ $t("button.close") }}
        </div>
      </div>

      <div class="money-details-header-total-money-wrapper" @click="onClickShowMoneyDetails">
        <OurMoney
          class="money-details-header-total-money"
          size="2xl"
          :item="moneyTotals.generalAmount"
          :integer="!isShownCents"
        />

        <OurSvgIcon name="Angle-down" class="money-details-header-total-money-icon" />
      </div>
    </div>

    <div
      v-if="!isShownOnlyBaseCurrency"
      v-dragscroll
      class="money-details-header-all-money-wrapper"
    >
      <template v-for="(amount, index) in moneyTotals.otherAmounts">
        <OurMoney
          v-if="amount.sum"
          :key="index"
          class="money-details-header-all-money-wrapper-title"
          size="xl"
          :item="amount"
          :integer="!isShownCents"
        />
      </template>
    </div>

    <div class="money-details-border" />

    <div class="money-details-body">
      <template v-if="isMobileDevice">
        <MoneyDetailsAccounts />
      </template>

      <perfect-scrollbar v-else class="body-perfect-scrollbar">
        <MoneyDetailsAccounts />
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import { mapGetters } from "vuex";
import { dragscroll } from "vue-dragscroll";

import MoneyDetailsAccounts from "./MoneyDetailsAccounts";

export default {
  directives: {
    dragscroll,
  },

  components: {
    MoneyDetailsAccounts,
    PerfectScrollbar,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("breakpoint", ["isMobileDevice"]),
    ...mapGetters("transaction", ["moneyTotals"]),
    ...mapGetters("settings", ["baseCurrency", "isShownCents"]),

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    isShownOnlyBaseCurrency() {
      return this.moneyTotals.otherAmounts.every(
        (item) => item.currencySymbol === this.baseCurrency.currentSymbol
      );
    },
  },

  methods: {
    isIntegerAmount(amount) {
      const minimalPositiveIntegerNumber = 1;

      return Math.abs(amount) > minimalPositiveIntegerNumber;
    },

    onClickShowMoneyDetails() {
      if (this.isMobileDevice) {
        this.isShownModal = false;
      }
    },

    onClickCloseMoneyDetails() {
      this.isShownModal = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.money-details-body {
  @apply relative grow overflow-y-scroll md:overflow-y-hidden;
}

.body-perfect-scrollbar::v-deep {
  @apply absolute top-0;
  @apply h-full w-full;

  .ps__rail-y {
    &:hover {
      @apply bg-transparent;
    }

    &:active {
      @apply bg-transparent;
    }

    .ps__thumb-y {
      @apply bg-violet-200 opacity-25;
    }
  }
}

.money-details {
  @apply overflow-hidden;
  @apply top-0 right-0 md:fixed;
  @apply bg-base-dark md:rounded-l-2xl md:bg-opacity-90;
  @apply border border-base-dark;
  @apply z-20 md:w-96;
  @apply md:mt-0 !important;
  @apply md:py-6;
  @apply md:backdrop-blur-lg md:backdrop-filter;
  @apply md:!h-full;
  @apply flex flex-col;
  height: calc(100% - 3.5rem);

  &-border {
    @apply border-b border-gray-700;
    @apply my-6 mx-4 md:mx-8;
  }
}

.money-details-header {
  @apply px-4 md:px-8;

  &-wrapper {
    @apply flex justify-between;

    &-title {
      @apply text-sm font-normal text-gray-400;
    }

    &-close {
      @apply text-sm font-normal lowercase text-gray-400;
      @apply border border-t-0 border-r-0 border-l-0 border-dashed border-gray-400;
      @apply cursor-pointer;
    }
  }

  &-total-money {
    &::v-deep {
      .money-block {
        @apply font-bold text-white;
        @apply justify-start;

        .penny {
          @apply text-2xl;
        }

        .sum {
          @apply ml-0;
        }
      }
    }

    &-wrapper {
      @apply inline-flex items-center md:block;
      @apply mt-4 pt-2 md:pt-0;
    }

    &-icon {
      @apply inline-block md:hidden;
      @apply pr-2.5;
      @apply rotate-180 transform transition-all duration-300;
      @apply cursor-pointer;

      &::v-deep g [fill] {
        @apply fill-current text-white;
      }
    }
  }

  &-all-money-wrapper {
    @apply relative cursor-pointer overflow-x-scroll;
    @apply flex flex-none;
    @apply bottom-px mt-2 space-x-6 px-4 pt-px md:mt-2 md:px-8 md:pt-0;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &-title {
      &::v-deep {
        .money-block {
          @apply font-bold text-gray-400 md:text-2lg md:font-medium;
          @apply justify-start;
          @apply whitespace-nowrap;

          .penny {
            @apply text-base;
          }

          .sum {
            @apply ml-0;
          }
        }
      }
    }
  }
}

.account-money-wrapper-currency-number-coin {
  @apply text-sm;
}
</style>
