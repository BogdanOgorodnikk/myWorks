<template>
  <OurPage
    :back-route="backRouteParams"
    :title="modalTitle"
    :width="pageWidthClass"
    class="our-page"
  >
    <template #header-left-after>
      <OurDropdown
        list-x-position="left"
        class="header-dropdown"
        text=""
        variant="link"
        :dropdown-icon="false"
        size="xs"
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

    <TransactionEdit
      ref="transactionEdit"
      v-model="form"
      :transaction-id="transactionId"
      :shown-delete-modal.sync="isShownDeleteModal"
      :divide-table.sync="isShownDivideTable"
      :transaction-type="transactionType"
      @confirmDeleteTransaction="onConfirmDeleteTransaction"
    />

    <template #footer-left>
      <OurButton :text="buttonTitle" @click="onClickSaveTransaction" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTransactions" />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary">
        <div @click="onClickCopyTransaction">
          {{ $t("button.copy") }}
        </div>

        <div @click="onClickDeleteTransaction">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>
  </OurPage>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { isPWA } from "@ilevel/our.service.ui";
import { TRANSACTION_TYPE } from "@/api/transaction";
import router from "@/router";

import TransactionEdit from "../_components/TransactionEdit";

export default {
  components: {
    TransactionEdit,
  },

  data() {
    return {
      isShownDivideTable: false,
      isActiveCopyTransactionMode: false,
      isShownDeleteModal: false,
      form: {},
    };
  },

  computed: {
    ...mapState("transaction", ["transactions"]),

    pageWidthClass() {
      return this.isShownDivideTable ? "4xl" : "md";
    },

    buttonTitle() {
      return this.isActiveCopyTransactionMode ? this.$t("button.add") : this.$t("button.save");
    },

    modalTitle() {
      let title;

      if (this.isActiveCopyTransactionMode) {
        title = this.$t("title.transaction.copy");
      } else {
        if (this.modalType.expense) {
          title = this.$t("title.transaction.expense");
        }

        if (this.modalType.income) {
          title = this.$t("title.transaction.income");
        }

        if (this.modalType.transfer) {
          title = this.$t("title.transaction.transfer");
        }
      }

      return title;
    },

    backRouteParams() {
      return {
        title: this.$t("title.transaction.list"),
        name: "TransactionsList",
      };
    },

    transactionId() {
      return Number(this.$route.params.id);
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
  },

  methods: {
    ...mapActions("transaction", [
      "updateTransaction",
      "addTransaction",
      "addTransfer",
      "updateTransfer",
    ]),

    onClickChangeModalForm(type) {
      if (type !== this.transactionType) {
        this.$router.push({
          name: "TransactionsEdit",
          params: { id: this.transactionId },
          query: { type },
        });
      }
    },

    onClickBackToTransactions() {
      router.push({ name: "TransactionsList" });
    },

    onClickDeleteTransaction() {
      this.isShownDeleteModal = true;
    },

    onConfirmDeleteTransaction() {
      router.push({ name: "TransactionsList" });
    },

    onClickCopyTransaction() {
      this.isActiveCopyTransactionMode = true;

      if (isPWA) {
        const page = document.querySelector(".our-page");

        page.scrollTo({ top: 0 });
      } else {
        window.scrollTo({ top: 0 });
      }

      if (
        this.form.categoryType === TRANSACTION_TYPE.income ||
        this.form.categoryType === TRANSACTION_TYPE.expense
      ) {
        this.$refs.transactionEdit.$refs.transactionForm.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
      } else {
        this.$refs.transactionEdit.$refs.transferForm.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
      }
    },

    async onClickSaveTransaction() {
      this.$refs.transactionEdit.validate();
      await this.$refs.transactionEdit.onChangeForm();

      if (this.form.isValid) {
        if (
          this.form.categoryType === TRANSACTION_TYPE.income ||
          this.form.categoryType === TRANSACTION_TYPE.expense
        ) {
          if (this.isActiveCopyTransactionMode) {
            await this.addTransaction(this.form);
          } else {
            await this.updateTransaction(this.form);
          }

          await router.push({ name: "TransactionsList" });
        } else {
          if (this.isActiveCopyTransactionMode) {
            await this.addTransfer({ transaction: this.form });
          } else {
            const editedTransaction = this.transactions.find((item) => item.id === this.form.id);
            const isTransferTransaction = !!editedTransaction.transferId;

            if (isTransferTransaction) {
              await this.updateTransfer(this.form);
            } else {
              await this.addTransfer({ transaction: this.form, isConverting: true });
            }
          }

          await router.push({ name: "TransactionsList" });
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
