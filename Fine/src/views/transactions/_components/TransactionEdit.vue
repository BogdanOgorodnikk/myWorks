<template>
  <div>
    <TransactionForm
      v-if="modalType.incomeOrExpense"
      ref="transactionForm"
      v-model="form"
      :transaction-type="transactionType"
      :divide-table.sync="isShownDivideAmountTable"
    />

    <TransferForm
      v-if="modalType.transfer"
      ref="transferForm"
      v-model="form"
      :divide-table.sync="isShownDivideAmountTable"
    />

    <OurConfirmModal
      v-model="isShownDeleteModal"
      :title="$t('title.transaction.delete')"
      :action-button-text="$t('button.delete')"
      @actionConfirmed="onConfirmDeleteTransaction"
    >
      <div v-html="$t('page.transactions.deleteModalText')" />
    </OurConfirmModal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { TRANSACTION_TYPE } from "@/api/transaction";
import { prepareMoneyForTransfer } from "../_services/transferMoney.service";

import TransactionForm from "../_components/TransactionForm";
import TransferForm from "../_components/TransferForm";

export default {
  components: {
    TransactionForm,
    TransferForm,
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },

    transactionId: {
      type: Number,
      default: null,
    },

    shownDeleteModal: {
      type: Boolean,
      default: false,
    },

    divideTable: {
      type: Boolean,
      default: false,
    },

    transactionType: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isDownloadedData: false,
      form: {
        isValid: false,
        id: "",
        counterpartyId: 0,
        bankAccountId: 0,
        categoryId: 0,
        paymentDate: 0,
        isConfirmedPaymentDay: false,
        accrualDate: 0,
        isConfirmedAccrualDay: false,
        currencyId: 0,
        project: 0,
        tags: [],
        description: "",
        sum: "",
        rate: "",
        symbol: "",
        sumFrom: "",
        sumTo: "",
        symbolFrom: "",
        symbolTo: "",
        rateFrom: "",
        rateTo: "",
        bankAccountFromId: "",
        bankAccountToId: "",
        currencyIdFrom: "",
        currencyIdTo: "",
      },
    };
  },

  computed: {
    ...mapState("transaction", ["transaction", "transactions"]),
    ...mapGetters("transaction", ["transactionsChildren"]),

    modalType() {
      return {
        incomeOrExpense:
          (this.transactionType === TRANSACTION_TYPE.expense && this.isDownloadedData) ||
          (this.transactionType === TRANSACTION_TYPE.income && this.isDownloadedData),
        transfer: this.transactionType === TRANSACTION_TYPE.transfer && this.isDownloadedData,
      };
    },

    isShownDeleteModal: {
      get() {
        return this.shownDeleteModal;
      },
      set(value) {
        this.$emit("update:shownDeleteModal", value);
      },
    },

    isShownDivideAmountTable: {
      get() {
        return this.divideTable;
      },
      set(value) {
        this.$emit("update:divideTable", value);
      },
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    await this.prefillForm();
  },

  methods: {
    ...mapMutations("transaction", ["SET_TRANSACTION"]),

    ...mapActions("transaction", ["getTransaction", "deleteTransaction"]),

    async onConfirmDeleteTransaction() {
      await this.deleteTransaction(this.transaction.id);

      this.$emit("confirmDeleteTransaction");
    },

    async prefillForm() {
      const editedTransaction = this.transactions.find((item) => item.id === this.transactionId);

      if (editedTransaction) {
        this.SET_TRANSACTION(editedTransaction);
      } else {
        await this.getTransaction(this.transactionId);
      }

      let tagsId = [];

      if (this.transaction.tags?.length) {
        tagsId = this.transaction.tags.map((tag) => ({
          id: tag.id,
          label: tag.name,
        }));
      }

      this.form.id = this.transaction.id;
      this.form.paymentDate = this.transaction.paymentDate;
      this.form.isConfirmedPaymentDay = this.transaction.paymentConfirmed;
      this.form.categoryId = this.transaction.category?.id;
      this.form.tags = [...tagsId];
      this.form.description = this.transaction.description;

      if (
        this.transactionType === TRANSACTION_TYPE.expense ||
        this.transactionType === TRANSACTION_TYPE.income
      ) {
        this.form.sum = this.transaction.sum;
        this.form.rate = this.transaction.rate;
        this.form.symbol = this.transaction.bankAccount.currency.symbol;
        this.form.bankAccountId = this.transaction.bankAccount?.id;
        this.form.counterpartyId = this.transaction.counterparty?.id;
        this.form.accrualDate = this.transaction.accrualDate;
        this.form.isConfirmedAccrualDay = this.transaction.accrualConfirmed;
        this.form.project = this.transaction.project?.id;
        this.form.currencyId = this.transaction.bankAccount.currency.id;

        const transactionChildren = this.transactionsChildren.find(
          (child) => child.parentId === this.transaction.id
        );

        this.form.children =
          transactionChildren || this.transaction.children
            ? transactionChildren?.child || this.transaction.children
            : [];

        if (this.form.children.length) {
          const [firstChild] = this.form.children;

          this.form.tags = firstChild.tags.map((tag) => ({
            id: tag.id,
            label: tag.name,
          }));
        }
      } else {
        this.form.sumFrom = this.transaction.sum;
        this.form.symbolFrom = this.transaction.bankAccount.currency.symbol;
        this.form.rateFrom = this.transaction.rate;
        this.form.bankAccountFromId = this.transaction.bankAccount?.id;
        this.form.currencyIdFrom = this.transaction.bankAccount.currency.id;

        const transferTransaction = this.transactions.find(
          (item) => item.id === this.transaction.transferId
        );

        if (transferTransaction) {
          this.SET_TRANSACTION(transferTransaction);
        } else {
          await this.getTransaction(this.transaction.transferId);
        }

        this.form.sumTo = this.transaction.sum;
        this.form.symbolTo = this.transaction.bankAccount.currency.symbol;
        this.form.rateTo = this.transaction.rate;
        this.form.bankAccountToId = this.transaction.bankAccount?.id;
        this.form.currencyIdTo = this.transaction.bankAccount.currency.id;
      }

      this.isDownloadedData = true;
    },

    validate() {
      if (this.modalType.incomeOrExpense) {
        this.$refs.transactionForm.validate();
      } else {
        this.$refs.transferForm.validate();
      }
    },

    async onChangeForm() {
      let tagIds = [];

      if (this.form.tags.length) {
        tagIds = this.form.tags.map((item) => item?.id || item);
      }

      if (this.modalType.incomeOrExpense) {
        const preparedForm = {
          categoryType: this.transactionType,
          isValid: this.form?.isValid,
          id: this.form.id,
          bankAccountId: this.form.bankAccountId,
          categoryId: this.form.categoryId,
          sum: this.form.money?.initialCurrency.sum,
          rate: this.form.money?.firstRate.sum || this.form.money?.firstRate.placeholder,
          counterpartyId: this.form.counterpartyId,
          paymentDate: this.form.paymentDate,
          paymentConfirmed: this.form.isConfirmedPaymentDay,
          accrualDate: this.form.accrualDate,
          accrualConfirmed: this.form.isConfirmedAccrualDay,
          description: this.form.description,
          projectId: this.form.project,
          children: this.form.children || [],
          tagIds: tagIds,
        };

        this.$emit("input", preparedForm);
      } else {
        const money = await prepareMoneyForTransfer(this.form);

        const preparedForm = {
          categoryType: this.transactionType,
          isValid: this.form?.isValid,
          id: this.form.id,
          sumFrom: money.from.sum,
          sumTo: money.to.sum,
          rateFrom: money.from.rate,
          rateTo: money.to.rate,
          bankAccountFromId: this.form.fromAccount,
          bankAccountToId: this.form.intoAccount,
          paymentDate: this.form.paymentDate,
          paymentConfirmed: this.form.isConfirmedPaymentDay,
          categoryId: this.form.categoryId,
          tagIds: tagIds,
          description: this.form.description,
        };

        this.$emit("input", preparedForm);
      }
    },
  },
};
</script>
