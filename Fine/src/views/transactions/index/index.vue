<template>
  <div class="transactions">
    <OurPage v-if="!isMobileDevice" width="wide" data-cy="transactions-page">
      <HeaderBlock :table-view.sync="tableView" @importTransactions="onImportTransactions" />

      <TransactionTable
        v-if="transactionsViewType.table"
        :future-transactions-state="futureTransactionsState"
        @clickRow="onClickRow"
        @clickShowMassEditModal="onClickShowMassEditModal"
        @clickDeleteTransactions="onClickDeleteTransactions"
        @clickTogglePlannedTransactions="onClickTogglePlannedTransactions"
        @clickShowMore="onClickShowMore"
        @clickDivideTransferTransaction="onClickDivideTransferTransaction"
        @clickCombineTransactionInTransfer="onClickCombineTransactionInTransfer"
      />

      <CalendarTable v-if="transactionsViewType.calendar" />

      <MassEditModal v-model="isShownMassEditModal" :items="transactionsForTable" />

      <EditModal
        v-model="isShownEditModal"
        :transaction-id="transactionId"
        :transaction-type.sync="transactionType"
      />

      <CombineTransactionConfirmModal
        v-model="isShownCombineTransactionModal"
        :items="transactionsForTable"
      />

      <DivideTransferTransactionConfirmModal
        v-model="isShownDivideTransferTransactionModal"
        :items="transactionsForTable"
      />

      <OurConfirmModal
        v-model="isShownMassDeleteModal"
        :title="$t('title.transaction.delete')"
        :action-button-text="$t('button.delete')"
        @actionConfirmed="onConfirmDeleteTransactions"
      >
        <div v-html="$tc('page.transactions.massDeleteModalText', deletedTransactionIds.length)" />
      </OurConfirmModal>
    </OurPage>

    <div v-if="isMobileDevice">
      <MobileHeader v-if="!isShownMoneyDetails" :money-details.sync="isShownMoneyDetails" />

      <MoneyDetails
        v-if="isShownMoneyDetails"
        v-model="isShownMoneyDetails"
        :class="moneyDetailsClass"
      />

      <MobileTransactionsTable
        v-if="transactionsViewType.table"
        :class="mobileTablesClass"
        :table-view.sync="tableView"
        :future-transactions-state="futureTransactionsState"
        @showMore="onClickShowMore"
        @togglePlannedTransactions="onClickTogglePlannedTransactions"
      />

      <MobileCalendarTable
        v-if="transactionsViewType.calendar"
        :class="mobileTablesClass"
        :table-view.sync="tableView"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import { getUnixTime, addDays, startOfDay } from "date-fns";
import { isPWA } from "@ilevel/our.service.ui";
import DateService from "@/services/date.service";
import { TRANSACTIONS_VIEW_TYPE } from "./constants";
import QS from "qs";
import { TRANSACTION_QS_OPTIONS } from "@/api/transaction";

import HeaderBlock from "./components/HeaderBlock";
import MassEditModal from "./components/MassEditModal";
import MobileHeader from "./components/MobileHeader";
import MobileTransactionsTable from "./components/MobileTransactionsTable";
import MoneyDetails from "./components/MoneyDetails";
import CalendarTable from "./components/CalendarTable";
import EditModal from "./components/EditModal";
import MobileCalendarTable from "./components/MobileCalendarTable";
import TransactionTable from "@/components/TransactionTable";
import CombineTransactionConfirmModal from "./components/CombineTransactionConfirmModal";
import DivideTransferTransactionConfirmModal from "./components/DivideTransferTransactionConfirmModal";

export default {
  components: {
    TransactionTable,
    DivideTransferTransactionConfirmModal,
    CombineTransactionConfirmModal,
    MobileCalendarTable,
    EditModal,
    CalendarTable,
    MoneyDetails,
    MobileTransactionsTable,
    MobileHeader,
    MassEditModal,
    HeaderBlock,
  },

  data() {
    return {
      tableView: TRANSACTIONS_VIEW_TYPE.table,
      isShownMassEditModal: false,
      isShownMoneyDetails: false,
      isShownEditModal: false,
      isOpenedPlannedTransactions: false,
      isShownMassDeleteModal: false,
      isShownCombineTransactionModal: false,
      isShownDivideTransferTransactionModal: false,
      transactionId: null,
      deletedTransactionIds: [],
      currentTransactionLoadPage: 1,
      transactionType: "",
    };
  },

  computed: {
    ...mapState("transaction", [
      "totalPlannedTransactions",
      "filters",
      "isShownPlannedTransactions",
    ]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),
    ...mapGetters("transaction", ["transactionsForTable"]),

    futureTransactionsState() {
      let state = null;

      if (this.totalPlannedTransactions) {
        state = !!this.isOpenedPlannedTransactions;
      }

      return state;
    },

    transactionsViewType() {
      return {
        table: this.tableView === TRANSACTIONS_VIEW_TYPE.table,
        calendar: this.tableView === TRANSACTIONS_VIEW_TYPE.calendar,
      };
    },

    mobileTablesClass() {
      return this.isShownMoneyDetails ? "money-details-open" : "";
    },

    isActiveTransactionsFilters() {
      return Object.keys(this.filters).length >= 2;
    },

    moneyDetailsClass() {
      return isPWA ? "money-details-mobile-pwa" : "money-details-mobile";
    },
  },

  watch: {
    filters: {
      handler: "onFiltersChange",
    },
    totalPlannedTransactions: "onChangeTotalPlannedTransactions",
    isMobileDevice: {
      handler: "onChangeMobileDevice",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await Promise.all([
      this.getTotalsBalance(),
      this.getCategories(),
      this.getAccounts(),
      this.getProjects(),
      this.getTags(),
      this.getContragents(),
      this.getCompanies(),
    ]);

    this.isOpenedPlannedTransactions = this.isShownPlannedTransactions;

    if (!this.totalPlannedTransactions) {
      this.SET_SHOWN_PLANNED_TRANSACTIONS(false);
    }
  },

  methods: {
    ...mapActions("transaction", [
      "getTransactions",
      "getPlannedTransactions",
      "massDeleteTransactions",
      "getTotalsBalance",
    ]),
    ...mapActions("category", ["getCategories"]),
    ...mapActions("bankAccount", ["getAccounts"]),
    ...mapActions("project", ["getProjects"]),
    ...mapActions("tag", ["getTags"]),
    ...mapActions("contragent", ["getContragents"]),
    ...mapActions("company", ["getCompanies"]),

    ...mapMutations("transaction", [
      "SET_TRANSACTIONS",
      "SET_SHOWN_PLANNED_TRANSACTIONS",
      "SET_FILTERS",
    ]),

    async onConfirmDeleteTransactions() {
      await this.massDeleteTransactions({ ids: this.deletedTransactionIds });
    },

    onClickDeleteTransactions(selectedRows) {
      this.deletedTransactionIds = [];

      this.transactionsForTable.forEach((item, index) => {
        selectedRows.forEach((row) => {
          if (row === index) {
            this.deletedTransactionIds.push(item.id);
          }
        });
      });

      this.isShownMassDeleteModal = true;
    },

    onChangeTotalPlannedTransactions() {
      if (!this.isShownPlannedTransactions) {
        this.isOpenedPlannedTransactions = !this.totalPlannedTransactions;
      }

      if (!this.totalPlannedTransactions && !this.isActiveTransactionsFilters) {
        this.SET_SHOWN_PLANNED_TRANSACTIONS(false);
      }

      if (!this.totalPlannedTransactions) {
        this.SET_SHOWN_PLANNED_TRANSACTIONS(false);
      }
    },

    async onImportTransactions() {
      await this.getActualTransactions();
      await this.getFutureTransactions();
    },

    async onChangeMobileDevice() {
      this.$nextTick(() => {
        if (this.isMobileDevice) {
          const filters = {
            ...this.filters,
            paymentDate: {
              from: DateService.thirtyDaysAgo(),
              to: DateService.nextTwoWeek(),
            },
          };

          this.SET_FILTERS(filters);
        }
      });
    },

    async onFiltersChange() {
      if (this.filters?.paymentDate?.from && this.filters?.paymentDate?.to) {
        this.$nextTick(async () => {
          const filtersParamsQueryString = QS.stringify(this.filters, TRANSACTION_QS_OPTIONS);
          const currentFiltersQueryInRoute = this.$router.history.current.query?.filters || "";

          if (filtersParamsQueryString !== currentFiltersQueryInRoute) {
            await this.$router.replace({ query: { filters: filtersParamsQueryString } });
          }

          this.currentTransactionLoadPage = 1;

          await this.getActualTransactions();
          await this.getFutureTransactions();

          if (Object.keys(this.filters).length >= 2) {
            this.isOpenedPlannedTransactions = !this.totalPlannedTransactions;
          }
        });
      }
    },

    async getActualTransactions() {
      const paymentDateRangeTo =
        this.filters.paymentDate.from >= DateService.TOMORROW_TIMESTAMP ||
        this.filters.paymentDate.to <= DateService.TOMORROW_TIMESTAMP
          ? this.filters.paymentDate.to
          : DateService.TOMORROW_TIMESTAMP;

      let params = {
        filters: {
          ...this.filters,
          paymentDate: {
            from: this.filters.paymentDate.from,
            to: paymentDateRangeTo,
          },
        },
        pagination: {
          page: this.currentTransactionLoadPage,
        },
      };

      await this.getTransactions({
        params,
        withCleanTransactions: true,
        withCleanPlannedTransactions: true,
      });
    },

    async getFutureTransactions() {
      if (DateService.TOMORROW_TIMESTAMP >= this.filters.paymentDate.from) {
        const daysToStartPlannedTransactions = 2;
        const startPlannedTransactionsDate = startOfDay(
          addDays(new Date(), daysToStartPlannedTransactions)
        );

        let params = {
          filters: {
            ...this.filters,
            paymentDate: {
              from: getUnixTime(startPlannedTransactionsDate),
              to: this.filters?.paymentDate?.to,
            },
          },
        };

        await this.getPlannedTransactions(params);

        this.isOpenedPlannedTransactions = !this.totalPlannedTransactions;
      }
    },

    async onClickTogglePlannedTransactions() {
      this.currentTransactionLoadPage = 1;

      let params = {
        filters: {
          paymentDate: {
            from: this.filters.paymentDate.from,
            to: this.filters.paymentDate.to,
          },
        },
        pagination: {
          page: this.currentTransactionLoadPage,
        },
      };

      if (!this.isOpenedPlannedTransactions) {
        this.SET_SHOWN_PLANNED_TRANSACTIONS(true);
      } else {
        params.filters = {
          paymentDate: {
            to: DateService.TOMORROW_TIMESTAMP,
            from: this.filters.paymentDate.from,
          },
        };

        this.SET_SHOWN_PLANNED_TRANSACTIONS(false);
      }

      if (this.isActiveTransactionsFilters) {
        params.filters = { ...this.filters, ...params.filters };
      }

      await this.getTransactions({ params, withCleanTransactions: true });

      this.isOpenedPlannedTransactions = !this.isOpenedPlannedTransactions;
    },

    async onClickShowMore() {
      this.currentTransactionLoadPage += 1;

      let params = {
        filters: {
          ...this.filters,
          paymentDate: {
            from: this.filters.paymentDate.from,
            to: this.transactionsForTable[0].date.primaryRow,
          },
        },
        pagination: {
          page: this.currentTransactionLoadPage,
        },
      };

      await this.getTransactions({ params });
    },

    onClickShowMassEditModal() {
      this.isShownMassEditModal = true;
    },

    onClickRow(row) {
      this.transactionType = row.money.primaryRow.categoryType;
      this.transactionId = row.id;
      this.isShownEditModal = true;

      this.$router.replace({ query: { type: this.transactionType, id: this.transactionId } });
    },

    onClickCombineTransactionInTransfer() {
      this.isShownCombineTransactionModal = true;
    },

    onClickDivideTransferTransaction() {
      this.isShownDivideTransferTransactionModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.transactions {
  @apply w-full;
}

.money-details {
  &-open {
    @apply mt-0 !important;
  }

  &-mobile {
    @apply absolute top-14;
    @apply w-full;

    &-pwa {
      @apply absolute top-0;
      @apply !h-full w-full;

      &::v-deep {
        .money-details-header-total-money-wrapper {
          @apply pt-[0.1875rem];
        }
      }
    }
  }
}
</style>
