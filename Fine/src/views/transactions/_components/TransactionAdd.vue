<template>
  <div>
    <TransactionForm
      v-if="modalType.incomeOrExpense"
      ref="transactionForm"
      v-model="form"
      :divide-table.sync="isShownDivideTable"
      :transaction-type="transactionType"
    />

    <TransferForm
      v-if="modalType.transfer"
      ref="transferForm"
      v-model="form"
      :divide-table.sync="isShownDivideTable"
    />
  </div>
</template>

<script>
import { TRANSACTION_TYPE } from "@/api/transaction";
import { prepareMoneyForTransfer } from "../_services/transferMoney.service";
import { mapGetters } from "vuex";

import TransactionForm from "../_components/TransactionForm";
import TransferForm from "../_components/TransferForm";

export default {
  components: {
    TransferForm,
    TransactionForm,
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },

    transactionType: {
      type: String,
      default: "",
    },

    divideTable: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isDownloadedData: false,
    form: {
      isConfirmedPaymentDay: true,
      isConfirmedAccrualDay: false,
    },
  }),

  computed: {
    ...mapGetters("category", ["defaultCategories"]),
    ...mapGetters("settings", ["isMakeConfirmedByDefault"]),

    isShownDivideTable: {
      get() {
        return this.divideTable;
      },
      set(value) {
        this.$emit("update:divideTable", value);
      },
    },

    modalType() {
      return {
        incomeOrExpense:
          (this.transactionType === TRANSACTION_TYPE.expense && this.isDownloadedData) ||
          (this.transactionType === TRANSACTION_TYPE.income && this.isDownloadedData),
        transfer: this.transactionType === TRANSACTION_TYPE.transfer && this.isDownloadedData,
      };
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    prefillForm() {
      this.form.isConfirmedPaymentDay = this.isMakeConfirmedByDefault;

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
      if (this.modalType.incomeOrExpense) {
        const preparedForm = {
          isValid: this.form?.isValid,
          sum: this.form.money?.initialCurrency?.sum,
          rate: this.form.money?.firstRate?.sum || this.form.money?.firstRate?.placeholder,
          bankAccountId: this.form.bankAccountId,
          categoryId: this.form.categoryId,
          counterpartyId: this.form.counterpartyId,
          paymentDate: this.form.paymentDate,
          paymentConfirmed: this.form.isConfirmedPaymentDay,
          accrualDate: this.form.accrualDate,
          accrualConfirmed: this.form.isConfirmedAccrualDay,
          description: this.form.description,
          projectId: this.form.project,
          tagIds: this.form.tags,
          children: this.form.children || [],
        };

        this.$emit("input", preparedForm);
      } else {
        const money = await prepareMoneyForTransfer(this.form);

        const preparedForm = {
          isValid: this.form?.isValid,
          sumFrom: money.from.sum,
          sumTo: money.to.sum,
          rateFrom: money.from.rate,
          rateTo: money.to.rate,
          bankAccountFromId: this.form.fromAccount,
          bankAccountToId: this.form.intoAccount,
          paymentDate: this.form.paymentDate,
          paymentConfirmed: this.form.isConfirmedPaymentDay,
          categoryId: this.form.categoryId,
          tagIds: this.form.tags,
          description: this.form.description,
        };

        this.$emit("input", preparedForm);
      }
    },
  },
};
</script>
