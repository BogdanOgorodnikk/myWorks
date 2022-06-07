<template>
  <OurTable
    class="transaction-table"
    :headers="tableHeaders"
    :items.sync="tableItems"
    selectable
    fixed-footer
    :loader-resource-name="transactionsResource"
    sticky-header
    :filters="filters"
    @clickRow="onClickRow"
  >
    <template #thead-actions="{ selectedRows }">
      <OurButton
        size="sm"
        class="transaction-table-action"
        variant="thirdary"
        :text="$t('button.edit')"
        data-cy="transaction-edit-button"
        @click="onClickShowMassEditModal"
      />

      <OurButton
        size="sm"
        class="transaction-table-action"
        variant="thirdary"
        :text="$t('button.delete')"
        @click="onClickDeleteTransactions(selectedRows)"
      />

      <OurButton
        v-if="isCheckedOneTransferTransaction"
        size="sm"
        class="transaction-table-action"
        variant="thirdary"
        :text="$t('button.divide')"
        @click="onClickDivideTransferTransaction"
      />

      <OurButton
        v-else
        size="sm"
        class="transaction-table-action"
        variant="thirdary"
        :text="$t('button.combineIntoTransfer')"
        :disabled="!isAllowedMergeTransactions"
        @click="onClickCombineTransactionInTransfer"
      />

      <OurButton
        size="sm"
        class="transaction-table-action"
        variant="thirdary"
        :text="$t('button.export')"
        @click="onClickExportTransaction"
      />
    </template>

    <template #before-first-row>
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
    </template>

    <template #before-last-row>
      <OurButton
        v-if="transactionsMeta.hasMorePages"
        size="sm"
        :text="$t('button.showMore')"
        variant="transparent"
        @click="onClickShowMore"
      />
    </template>

    <template #cell-date="{ value }">
      <div>
        {{ dateConverter(value.primaryRow) }}
      </div>

      <div v-if="Array.isArray(value.secondaryRow)" class="secondary-row">
        <div v-for="(secondaryRow, index) in value.secondaryRow" :key="index">
          <div v-if="secondaryRow">{{ dateConverter(secondaryRow) }}</div>

          <div v-else class="children-empty" />
        </div>
      </div>

      <div v-else-if="value.secondaryRow" class="secondary-row">
        {{ dateConverter(value.secondaryRow) }}
      </div>
    </template>

    <template #cell-money="{ value }">
      <OurMoney
        :item="value.primaryRow"
        :planned="value.isPlannedTransaction"
        :icons="moneyIcons"
        :integer="!isShownCents"
        :sign="value.primaryRow.sign"
      />

      <div v-if="value.secondaryRow.length">
        <OurMoney
          v-for="(item, index) in value.secondaryRow"
          :key="index"
          class="children-money"
          :item="item"
          size="xs"
          :planned="value.isPlannedTransaction"
          :icons="moneyIcons"
          :integer="!isShownCents"
        />
      </div>

      <div v-else-if="!Array.isArray(value.secondaryRow)">
        <OurMoney
          :item="value.secondaryRow"
          :planned="value.isPlannedTransaction"
          :integer="!isShownCents"
        />
      </div>
    </template>

    <template #cell-details="{ value }">
      <div>
        {{ value.primaryRow }}
      </div>

      <div v-if="Array.isArray(value.secondaryRow.children)" class="secondary-row">
        <div v-for="(secondaryRow, index) in value.secondaryRow.children" :key="index">
          <span>{{ secondaryRow.category }} </span>
          <span v-if="secondaryRow.project" class="transaction-table-project">{{
            secondaryRow.project
          }}</span>
        </div>
      </div>

      <div v-else class="secondary-row">
        <span>{{ value.secondaryRow.category }} </span>
        <span v-if="value.secondaryRow.project" class="transaction-table-project">{{
          value.secondaryRow.project
        }}</span>
      </div>

      <div v-if="value.secondaryRow.tags.length" class="secondary-row-tags">
        <div v-for="(tag, index) in value.secondaryRow.tags" :key="index">
          {{ tag }}
        </div>
      </div>
    </template>

    <template #cell-requisites="{ value }">
      <div v-if="value.primaryRowTransfer">
        <span>{{ value.primaryRowTransfer.bankAccount }}</span>

        <span class="secondary-row-transfer-company">
          {{ value.primaryRowTransfer.company }}
        </span>
      </div>

      <div v-else>
        {{ value.primaryRow }}
      </div>

      <div v-if="value.secondaryRowTransfer" class="secondary-row-transfer">
        <span>
          {{ value.secondaryRowTransfer.bankAccount }}
        </span>

        <span class="secondary-row-transfer-company">
          {{ value.secondaryRowTransfer.company }}
        </span>
      </div>

      <div v-else class="secondary-row">
        {{ value.secondaryRow }}
      </div>
    </template>

    <template #tfoot>
      <TransactionTotalsLabels :transaction-totals="transactionTotals" />

      <TransactionTotalsActual :transaction-totals="transactionTotals" />

      <TransactionTotalsPlanned :transaction-totals="transactionTotals" />
    </template>
  </OurTable>
</template>

<script>
import {
  exportTransactions,
  getTotalsTransactions,
  TRANSACTION_TYPE,
  TRANSACTIONS_RESOURCE,
} from "@/api/transaction";
import { downloadExport } from "@/api/exports";
import DateService from "@/services/date.service";
import debounce from "lodash.debounce";
import { mapActions, mapGetters, mapState } from "vuex";

import TransactionTotalsLabels from "./components/TransactionTotalsLabels";
import TransactionTotalsActual from "./components/TransactionTotalsActual";
import TransactionTotalsPlanned from "./components/TransactionTotalsPlanned";

const DEBOUNCE_TIME_WAIT = 1500;

export default {
  components: {
    TransactionTotalsPlanned,
    TransactionTotalsActual,
    TransactionTotalsLabels,
  },

  props: {
    futureTransactionsState: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tableHeaders: [
        {
          value: "date",
          text: this.$t("label.date"),
          tdClass: "text-right",
          thClass: "table-date w-24",
        },
        {
          value: "money",
          text: this.$t("label.amount"),
          thClass: "text-right table-money w-[13.5rem]",
          tdClass: "text-right max-w-[13.5rem]",
        },
        {
          value: "details",
          text: this.$t("label.details"),
          thClass: "table-details w-[30%]",
        },
        {
          value: "counteragent",
          text: this.$t("label.counteragent"),
        },
        {
          value: "requisites",
          text: this.$t("label.requisites"),
        },
      ],
      tableItems: [],
      moneyIcons: {
        creditTooltip: this.$t("label.payables"),
        debitTooltip: this.$t("label.receivables"),
        size: "3xs",
      },
      checkedTotalTransactions: {},
    };
  },

  computed: {
    ...mapState("transaction", [
      "transactions",
      "filters",
      "totalPlannedTransactions",
      "transactionsMeta",
      "transactionsTotals",
    ]),

    ...mapGetters("transaction", ["transactionsForTable"]),
    ...mapGetters("settings", ["isShownCents"]),

    transactionTotals() {
      const isPreparedCheckedTransactions =
        this.checkedTotalTransactions?.balance?.length ||
        this.checkedTotalTransactions?.expense?.length ||
        this.checkedTotalTransactions?.income?.length;

      return this.isCheckedTransactions && isPreparedCheckedTransactions
        ? this.checkedTotalTransactions
        : this.preparedTotalTransactions;
    },

    isCheckedTransactions() {
      return this.checkedTableItems.length > 1;
    },

    checkedTableItems() {
      return this.tableItems.filter((item) => item.isChecked);
    },

    transactionsResource() {
      return TRANSACTIONS_RESOURCE;
    },

    preparedTotalTransactions() {
      const emptyTotalTransactions = {
        balance: [
          {
            factual: { sum: 0 },
            planned: { sum: 0 },
          },
        ],
        expense: [
          {
            factual: { sum: 0 },
            planned: { sum: 0 },
          },
        ],
        income: [
          {
            factual: { sum: 0 },
            planned: { sum: 0 },
          },
        ],
      };

      return this.isCheckedTransactions
        ? emptyTotalTransactions
        : this.prepareTotalTransactions(this.transactionsTotals);
    },

    plannedTransactionsState() {
      return {
        shown: this.futureTransactionsState === true,
        hidden: this.futureTransactionsState === false,
      };
    },

    isCheckedOneTransferTransaction() {
      const requiredNumberOfTransferTransactionForDivide = 1;
      const [checkedTransaction] = this.checkedTableItems;

      return (
        this.checkedTableItems.length === requiredNumberOfTransferTransactionForDivide &&
        checkedTransaction.money.primaryRow.categoryType === TRANSACTION_TYPE.transfer
      );
    },

    isAllowedMergeTransactions() {
      const requiredNumberOfTransactionsForMerge = 2;

      return this.checkedTableItems.length === requiredNumberOfTransactionsForMerge;
    },
  },

  watch: {
    transactionsForTable: "onChangeTransactionsForTable",
    checkedTableItems: {
      deep: true,
      handler() {
        this.checkedTotalTransactions = {};

        this.calculateCheckedTransactions();
      },
    },
  },

  async created() {
    await this.getTotalsTransactions();
  },

  methods: {
    ...mapActions("transaction", ["getTotalsTransactions"]),

    async onChangeTransactionsForTable() {
      this.tableItems = [...this.transactionsForTable];

      await this.getTotalsTransactions();
    },

    async onClickExportTransaction() {
      const checkedTableItemsId = this.checkedTableItems.map((item) => item.id);

      const response = await exportTransactions(checkedTableItemsId);

      await downloadExport(response.id);
    },

    calculateCheckedTransactions: debounce(async function () {
      if (this.isCheckedTransactions) {
        const params = {
          filters: {
            id: this.checkedTableItems.map((item) => {
              if (item.money.secondaryRow.length) {
                const tableTransactions = this.transactions.filter(
                  (transaction) => transaction.parentId === item.id
                );

                return tableTransactions.map((item) => item.id);
              }

              return item.id;
            }),
          },
        };

        const response = await getTotalsTransactions(params);

        this.checkedTotalTransactions = this.prepareTotalTransactions(response);
      }
    }, DEBOUNCE_TIME_WAIT),

    prepareTotalTransactions(transactionTotals) {
      const ZERO_SUM = 0;

      const factualTotals = transactionTotals.factual;
      const plannedTotals = transactionTotals.planned;

      const totalsWithSum = {
        factual: {
          income: factualTotals?.income?.filter((item) => item.value) || [],
          outcome: factualTotals?.outcome?.filter((item) => item.value) || [],
          balance: factualTotals?.balance?.filter((item) => item.value) || [],
        },
        planned: {
          income: plannedTotals?.income?.filter((item) => item.value) || [],
          outcome: plannedTotals?.outcome?.filter((item) => item.value) || [],
          balance: plannedTotals?.balance?.filter((item) => item.value) || [],
        },
      };

      const allIncomes = [...totalsWithSum.factual.income, ...totalsWithSum.planned.income];
      const allOutcomes = [...totalsWithSum.factual.outcome, ...totalsWithSum.planned.outcome];
      const allBalances = [...totalsWithSum.factual.balance, ...totalsWithSum.planned.balance];

      const allCurrencies = {
        income: allIncomes.map((item) => item.currency?.symbol),
        outcome: allOutcomes.map((item) => item.currency?.symbol),
        balance: allBalances.map((item) => item.currency?.symbol),
      };

      const uniqueCurrency = {
        income: Array.from(new Set(allCurrencies.income)),
        outcome: Array.from(new Set(allCurrencies.outcome)),
        balance: Array.from(new Set(allCurrencies.balance)),
      };

      const emptyTotals = [
        {
          factual: {
            sum: ZERO_SUM,
          },
          planned: {
            sum: ZERO_SUM,
          },
        },
      ];

      return {
        income: uniqueCurrency?.income?.length
          ? uniqueCurrency?.income?.map((currencySymbol) => {
              const factual = factualTotals?.income?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              const planned = plannedTotals?.income?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              return {
                factual: {
                  sum: factual?.value,
                  currencySymbol: currencySymbol,
                },
                planned: {
                  sum: planned?.value || ZERO_SUM,
                  currencySymbol: currencySymbol,
                },
              };
            })
          : emptyTotals,
        expense: uniqueCurrency?.outcome?.length
          ? uniqueCurrency?.outcome?.map((currencySymbol) => {
              const factual = factualTotals?.outcome?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              const planned = plannedTotals?.outcome?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              return {
                factual: {
                  sum: factual?.value,
                  currencySymbol: currencySymbol,
                  type: TRANSACTION_TYPE.expense,
                },
                planned: {
                  sum: planned?.value || ZERO_SUM,
                  currencySymbol: currencySymbol,
                  type: TRANSACTION_TYPE.expense,
                },
              };
            })
          : emptyTotals,
        balance: uniqueCurrency?.balance?.length
          ? uniqueCurrency?.balance?.map((currencySymbol) => {
              const factual = factualTotals?.balance?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              const planned = plannedTotals?.balance?.find(
                (item) => item.currency.symbol === currencySymbol
              );

              return {
                factual: {
                  sum: factual?.value,
                  currencySymbol: currencySymbol,
                },
                planned: {
                  sum: planned?.value || ZERO_SUM,
                  currencySymbol: currencySymbol,
                },
              };
            })
          : emptyTotals,
      };
    },

    dateConverter(value, format) {
      return DateService.dateConverter(value, format);
    },

    onClickRow(row) {
      this.$emit("clickRow", row);
    },

    onClickShowMassEditModal() {
      this.$emit("clickShowMassEditModal");
    },

    onClickDeleteTransactions(selectedRows) {
      this.$emit("clickDeleteTransactions", selectedRows);
    },

    onClickTogglePlannedTransactions() {
      this.$emit("clickTogglePlannedTransactions");
    },

    onClickShowMore() {
      this.$emit("clickShowMore");
    },

    onClickDivideTransferTransaction() {
      this.$emit("clickDivideTransferTransaction");
    },

    onClickCombineTransactionInTransfer() {
      this.$emit("clickCombineTransactionInTransfer");
    },
  },
};
</script>

<style lang="postcss" scoped>
.transaction-table {
  @apply mt-6;

  &-project {
    @apply pl-4;
  }
}

.transaction-table-action {
  @apply text-blue-900;
}

.children {
  &-empty {
    @apply inline-block;
  }

  &-money::v-deep {
    .money-block {
      @apply text-gray-500;
      @apply mb-0;
    }
  }
}

.secondary-row {
  @apply mt-1 text-xs text-gray-500;

  &-tags {
    @apply flex space-x-0.5;
    @apply text-xs font-normal text-gray-400;
    @apply mt-0.5;
  }

  &-transfer {
    @apply mt-1;

    &-company {
      @apply text-xs text-gray-500;
    }
  }
}
</style>
