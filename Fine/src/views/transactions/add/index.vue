<template>
  <OurPage :back-route="backRouteParams" :title="modalTitle" :width="pageWidthClass">
    <template #header-left-after>
      <OurDropdown
        list-x-position="left"
        class="header-dropdown"
        variant="link"
        :dropdown-icon="false"
        size="xs"
        text=""
      >
        <template #action-button="{ keydownHandler, mousedownHandler, blurHandler }">
          <OurLink
            :text="$t('title.transaction.changeType')"
            dashed
            variant="secondary"
            size="xs"
            @mousedown="mousedownHandler"
            @keydown="keydownHandler"
            @blur="blurHandler($event)"
          />
        </template>

        <div v-if="!modalType.expense" @click="onClickChangeModalForm('expense')">
          {{ $t("title.transaction.expense") }}
        </div>
        <div v-if="!modalType.income" @click="onClickChangeModalForm('income')">
          {{ $t("title.transaction.income") }}
        </div>
        <div v-if="!modalType.transfer" @click="onClickChangeModalForm('transfer')">
          {{ $t("title.transaction.transfer") }}
        </div>
      </OurDropdown>
    </template>

    <TransactionAdd
      ref="transactionAdd"
      v-model="form"
      :divide-table.sync="isShownDivideTable"
      :transaction-type="transactionType"
    />

    <template #footer-left>
      <OurButton :text="$t('button.add')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTransactions" />
    </template>
  </OurPage>
</template>

<script>
import { TRANSACTION_TYPE } from "@/api/transaction";
import { mapActions } from "vuex";

import TransactionAdd from "@/views/transactions/_components/TransactionAdd";

export default {
  components: {
    TransactionAdd,
  },

  data: () => ({
    form: {},
    isShownDivideTable: true,
  }),

  computed: {
    pageWidthClass() {
      return this.isShownDivideTable ? "4xl" : "md";
    },

    transactionType() {
      return this.$route.query.type;
    },

    modalType() {
      return {
        transfer: this.transactionType === TRANSACTION_TYPE.transfer,
        income: this.transactionType === TRANSACTION_TYPE.income,
        expense: this.transactionType === TRANSACTION_TYPE.expense,
      };
    },

    modalTitle() {
      let title;

      if (this.transactionType === TRANSACTION_TYPE.expense) {
        title = this.$t("title.transaction.expense");
      }

      if (this.transactionType === TRANSACTION_TYPE.income) {
        title = this.$t("title.transaction.income");
      }

      if (this.transactionType === TRANSACTION_TYPE.transfer) {
        title = this.$t("title.transaction.transfer");
      }

      return title;
    },

    backRouteParams() {
      return {
        title: this.$t("title.transaction.list"),
        name: "TransactionsList",
      };
    },
  },

  methods: {
    ...mapActions("transaction", ["addTransaction", "addTransfer"]),

    onClickBackToTransactions() {
      this.$router.push({ name: "TransactionsList" });
    },

    onClickChangeModalForm(type) {
      if (type !== this.transactionType) {
        this.$router.push({ name: "TransactionsAdd", query: { type } });
      }
    },

    async onSubmitForm() {
      if (this.modalType.income || this.modalType.expense) {
        this.$refs.transactionAdd.validate();

        if (this.form.isValid) {
          await this.addTransaction(this.form);

          this.form = {};

          await this.$router.push({ name: "TransactionsList" });
        }
      } else {
        this.$refs.transactionAdd.validate();

        if (this.form.isValid) {
          await this.addTransfer({ transaction: this.form });

          this.form = {};

          await this.$router.push({ name: "TransactionsList" });
        }
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.header-dropdown {
  @apply mt-2;
}
</style>
