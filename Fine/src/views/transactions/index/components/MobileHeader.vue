<template>
  <div>
    <div class="mobile-transaction-header">
      <div
        class="mobile-transaction-header-general-amount-wrapper"
        @click="onClickShowMoneyDetails"
      >
        <OurMoney
          class="mobile-transaction-header-general-amount"
          :item="moneyTotals.generalAmount"
          :integer="!isShownCents"
          size="2xl"
        />

        <OurSvgIcon name="Angle-down" class="mobile-transaction-header-general-amount-icon" />
      </div>

      <div class="mobile-transaction-header-currencies-wrapper">
        <OurMoney
          v-for="(amount, index) in moneyTotals.otherAmounts"
          :key="index"
          :item="amount"
          class="mobile-transaction-header-currencies-value"
          :integer="!isShownCents"
          size="xl"
        />
      </div>
    </div>

    <div class="mobile-transaction-header-actions">
      <OurButton
        class="mobile-transaction-header-actions-button"
        :text="$t('button.cashflow.expense')"
        variant="transparent"
        dark-mode
        @click="onClickAddTransaction('expense')"
      >
        <template #icon-left>
          <OurSvgIcon
            size="sm"
            class="mobile-transaction-header-actions-button-icon"
            name="Minus2"
          />
        </template>
      </OurButton>

      <OurButton
        class="mobile-transaction-header-actions-button"
        :text="$t('button.cashflow.income')"
        variant="transparent"
        dark-mode
        @click="onClickAddTransaction('income')"
      >
        <template #icon-left>
          <OurSvgIcon
            size="sm"
            class="mobile-transaction-header-actions-button-icon"
            name="Plus2"
          />
        </template>
      </OurButton>

      <OurButton
        class="mobile-transaction-header-actions-button"
        :text="$t('button.cashflow.transfer')"
        variant="transparent"
        dark-mode
        @click="onClickAddTransaction('transfer')"
      >
        <template #icon-left>
          <OurSvgIcon
            size="sm"
            class="mobile-transaction-header-actions-button-icon"
            name="Arrow-right"
          />
        </template>
      </OurButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    moneyDetails: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("transaction", ["moneyTotals"]),
    ...mapGetters("settings", ["isShownCents"]),

    isShownMoneyDetails: {
      get() {
        return this.moneyDetails;
      },
      set(value) {
        this.$emit("update:moneyDetails", value);
      },
    },
  },

  methods: {
    onClickShowMoneyDetails() {
      this.isShownMoneyDetails = true;
    },

    onClickAddTransaction(type) {
      this.$router.push({ name: "TransactionsAdd", query: { type } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-transaction-header {
  @apply bg-base-dark;
  @apply px-4 pt-4;

  &-general-amount {
    &::v-deep {
      .money-block {
        @apply font-bold text-white;
        @apply whitespace-nowrap;

        .sum {
          @apply ml-0;
        }
      }
    }

    &-wrapper {
      @apply border-l border-transparent;
      @apply inline-flex items-center;
      @apply mt-1;
    }

    &-icon {
      @apply cursor-pointer;
      @apply pl-2.5;

      &::v-deep g [fill] {
        @apply fill-current text-white;
      }
    }
  }

  &-currencies {
    &-wrapper {
      @apply overflow-y-hidden overflow-x-scroll;
      @apply flex items-center;
      @apply mt-2 space-x-6 pl-px;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &-value {
      &::v-deep {
        .money-block {
          @apply font-bold text-gray-400;
          @apply whitespace-nowrap;

          .sum {
            @apply ml-0;
          }
        }
      }
    }
  }

  &-actions {
    @apply flex overflow-x-scroll;
    @apply mt-8 mb-[2.375rem] space-x-4 px-4;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &-button {
      @apply w-full;
      @apply justify-center;

      &-icon {
        @apply pr-1;

        &::v-deep g [fill] {
          @apply fill-current text-white opacity-100;
        }
      }
    }
  }
}
</style>
