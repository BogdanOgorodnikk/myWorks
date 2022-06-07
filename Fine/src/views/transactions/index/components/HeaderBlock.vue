<template>
  <div ref="transactionHeader" class="header" tabindex="1">
    <div class="header-wrapper">
      <div class="header-wrapper-block">
        <OurButton
          :text="$t('button.cashflow.expense')"
          data-cy="expense-button"
          @click="onClickButtonOpenModal(transactionType.expense)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="button-icon" name="Minus2" />
          </template>
        </OurButton>

        <OurButton
          :text="$t('button.cashflow.income')"
          data-cy="income-button"
          @click="onClickButtonOpenModal(transactionType.income)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="button-icon" name="Plus2" />
          </template>
        </OurButton>

        <OurButton
          :text="$t('button.cashflow.transfer')"
          data-cy="transfer-button"
          @click="onClickButtonOpenModal(transactionType.transfer)"
        >
          <template #icon-left>
            <OurSvgIcon size="sm" class="button-icon" name="Arrow-right" />
          </template>
        </OurButton>
      </div>

      <div
        v-if="!isShownMoneyDetails"
        class="header-wrapper-cash"
        @click="onClickShownMoneyDetails"
      >
        <OurMoney
          v-if="generalAmountInBaseCurrency.sum"
          :item="generalAmountInBaseCurrency"
          class="header-wrapper-cash-title"
          :integer="!isShownCents"
          size="2xl"
        />

        <OurSvgIcon
          :tooltip="$t('label.totalOnAccount')"
          class="header-wrapper-cash-info"
          name="Info-circle"
        />
      </div>
    </div>

    <div class="header-wrapper">
      <div class="header-wrapper-block">
        <OurDateRangePicker v-model="paymentDateRange" />

        <OurButton
          :text="$t('button.filters')"
          :variant="filtersButtonVariant"
          data-cy="filter-button"
          @click="onClickFiltersButton"
        >
          <template v-if="activeFiltersCount" #icon-right>
            <div class="filters-count">{{ activeFiltersCount }}</div>

            <div class="filters-clear" @click.stop="onClickClearFilters">
              <OurSvgIcon size="sm" name="Close" />
            </div>
          </template>
        </OurButton>

        <OurButton :text="$t('button.import')" variant="thirdary" @click="onClickImportButton" />

        <OurButton
          :text="$t('button.export')"
          variant="thirdary"
          @click="onClickExportTransaction"
        />
      </div>

      <div class="header-wrapper-block">
        <OurButton class="custom-button" text="" variant="transparent">
          <template #icon-left>
            <OurSvgIcon :tooltip="$t('label.charts')" size="sm" name="Chart-line1" />
          </template>
        </OurButton>

        <OurButtonGroup v-model="selectedTableView" :options="buttons" name="transactionRadio" />
      </div>
    </div>

    <transition name="money-details">
      <MoneyDetails v-if="isShownMoneyDetails" v-model="isShownMoneyDetails" />
    </transition>
    <div
      v-if="isShownMoneyDetails"
      class="money-details-opinion"
      @click="onClickCloseMoneyDetails"
    />

    <FiltersModal v-model="isShownFiltersModal" />

    <TransactionModal
      v-model="isShownTransactionModal"
      :transaction-type.sync="chosenTransactionType"
    />

    <ImportTransactionModal
      v-model="isShownImportOperation"
      @importTransactions="onImportTransactions"
    />
  </div>
</template>

<script>
import { TRANSACTION_TYPE, exportTransactions } from "@/api/transaction";
import { getUnixTime } from "date-fns";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { downloadExport } from "@/api/exports";

import MoneyDetails from "./MoneyDetails";
import FiltersModal from "./FilterModal";
import TransactionModal from "./TransactionModal";
import ImportTransactionModal from "./ImportTransactionModal";

export default {
  components: {
    ImportTransactionModal,
    MoneyDetails,
    FiltersModal,
    TransactionModal,
  },

  props: {
    tableView: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isShownMoneyDetails: false,
      isShownFiltersModal: false,
      isShownTransactionModal: false,
      isShownImportOperation: false,
      transactionType: TRANSACTION_TYPE,
      chosenTransactionType: "",
      paymentDateRange: {},
      buttons: [
        {
          name: "Menu",
          value: "table",
          iconTooltip: this.$t("label.transactionsList"),
        },
        {
          name: "Layout-grid",
          value: "calendar",
          iconTooltip: this.$t("label.paymentCalendar"),
        },
      ],
    };
  },

  computed: {
    ...mapState("transaction", ["filters", "totalsBalance"]),

    ...mapGetters("settings", ["baseCurrency", "isShownCents"]),
    ...mapGetters("bankAccount", ["bankAccountsCurrencies"]),
    ...mapGetters("transaction", ["transactionsForTable"]),

    selectedTableView: {
      get() {
        return this.tableView;
      },
      set(value) {
        this.$emit("update:tableView", value);
      },
    },

    activeFiltersCount() {
      let filtersLength = 0;

      for (let key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          filtersLength += this.filters[key].length;
        } else if (this.filters[key] === 1 || this.filters[key] === 0) {
          filtersLength++;
        }
      }

      filtersLength += !!this.filters.description;
      filtersLength += !!(this.filters.accrualDate?.to || this.filters.accrualDate?.from);
      filtersLength += !!(this.filters.sum?.to || this.filters.sum?.from);

      return filtersLength;
    },

    filtersButtonVariant() {
      return this.activeFiltersCount ? "transparent" : "thirdary";
    },

    generalAmountInBaseCurrency() {
      return {
        sum: this.totalsBalance?.factual?.totals?.inBaseCurrency?.balance,
        currencySymbol: this.totalsBalance?.factual?.totals?.inBaseCurrency?.currency?.symbol,
      };
    },
  },

  watch: {
    paymentDateRange: {
      handler: "onChangePaymentDateRange",
      immediate: true,
      deep: true,
    },
  },

  async created() {
    await this.getAllCurrenciesRateForToday();
  },

  methods: {
    ...mapActions("currency", ["getCurrencyRate"]),
    ...mapActions("bankAccount", ["getAccounts"]),

    ...mapMutations("transaction", ["SET_FILTERS"]),

    onChangePaymentDateRange() {
      if (this.paymentDateRange.from && this.paymentDateRange.to) {
        if (
          this.filters?.paymentDate?.from &&
          this.filters?.paymentDate?.from !== this.paymentDateRange.from &&
          this.filters?.paymentDate?.to !== this.paymentDateRange.to
        ) {
          this.paymentDateRange = {
            ...this.filters.paymentDate,
          };

          return;
        }

        const filters = {
          ...this.filters,
          paymentDate: this.paymentDateRange,
        };

        this.SET_FILTERS(filters);
      }
    },

    onClickClearFilters() {
      this.SET_FILTERS({ paymentDate: this.paymentDateRange });

      this.$refs.transactionHeader.focus();
    },

    onClickShownMoneyDetails() {
      this.isShownMoneyDetails = true;
    },

    async onClickExportTransaction() {
      const checkedItems = this.transactionsForTable.filter((item) => item.isChecked);
      const checkedItemsId = checkedItems.map((item) => item.id);

      const response = await exportTransactions(checkedItemsId);

      await downloadExport(response.id);
    },

    onClickCloseMoneyDetails() {
      this.isShownMoneyDetails = false;
    },

    onClickFiltersButton() {
      this.isShownFiltersModal = true;
    },

    onClickImportButton() {
      this.isShownImportOperation = true;
    },

    async getAllCurrenciesRateForToday() {
      await this.getAccounts();

      const params = {
        currencyIds: this.bankAccountsCurrencies,
        timestamp: getUnixTime(new Date()),
      };

      await this.getCurrencyRate(params);
    },

    async onClickButtonOpenModal(transactionType) {
      this.isShownTransactionModal = true;
      this.chosenTransactionType = transactionType;
    },

    onImportTransactions() {
      this.$emit("importTransactions");
    },
  },
};
</script>

<style lang="postcss" scoped>
.money-details-enter-active,
.money-details-leave-active {
  @apply transition-all duration-150 ease-out;
  @apply right-0;
}
.money-details-enter,
.money-details-leave-to {
  @apply -right-96;
}

.header {
  @apply space-y-6;

  &:focus-visible {
    @apply outline-none;
  }
}

.header-wrapper {
  @apply flex items-center justify-between;
}

.header-wrapper-block {
  @apply flex;
  @apply space-x-4;
}

.button-icon {
  @apply pr-1;

  &::v-deep g [fill] {
    @apply fill-current text-white opacity-100;
  }
}

.header-wrapper-cash {
  @apply flex items-center;
  @apply space-x-4 px-2 py-[0.3125rem];
  @apply cursor-pointer;

  &:hover {
    @apply rounded-lg bg-base-dark bg-opacity-5;
    @apply transition-all duration-100 ease-in-out;

    .header-wrapper-cash-info {
      &::v-deep g [fill] {
        @apply bg-gray-700 bg-opacity-30 fill-current text-gray-700;
        @apply transition-all duration-100 ease-in-out;
      }
    }
  }

  &-info {
    &::v-deep g [fill] {
      @apply bg-gray-500 bg-opacity-30 fill-current text-gray-500;
    }
  }

  &-title {
    &::v-deep {
      .money-block {
        @apply font-bold text-base-dark;
        @apply mb-0 whitespace-nowrap;

        .sum {
          @apply ml-0 text-3xl;

          .penny {
            @apply text-2xl;
          }
        }
      }
    }
  }
}

.money-details-opinion {
  @apply fixed top-0 right-0;
  @apply h-screen w-screen;
}

.filters {
  &-count {
    @apply flex items-center justify-center;
    @apply rounded-full bg-blue-500;
    @apply text-[0.625rem] font-medium text-white;
    @apply h-5 w-5;
    @apply mr-1;
  }

  &-clear {
    @apply flex items-center justify-center;
    @apply cursor-pointer;
  }
}
</style>
