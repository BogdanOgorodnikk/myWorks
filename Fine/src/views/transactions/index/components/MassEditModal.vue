<template>
  <OurPageModal
    v-model="isShownModal"
    class="modal-head"
    width="md"
    :title="$t('title.editTransactions')"
  >
    <MassEditForm v-model="form" :transactions-type="selectedTransactionsType" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onClickSaveTransactions" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>
  </OurPageModal>
</template>

<script>
import { mapActions } from "vuex";
import { CATEGORY_ACTIVITIES } from "@/api/category";

import MassEditForm from "./MassEditForm";

export default {
  components: {
    MassEditForm,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    selectedTransactionsType() {
      const checkedTableItems = this.items.filter((item) => item.isChecked);

      const isIncome = checkedTableItems.find(
        (item) => item.money.primaryRow.type === CATEGORY_ACTIVITIES.income
      );
      const isExpense = checkedTableItems.find(
        (item) => item.money.primaryRow.type === CATEGORY_ACTIVITIES.expense
      );
      const isTransfer = checkedTableItems.find(
        (item) => item.money.primaryRow.type === CATEGORY_ACTIVITIES.transfer
      );

      return {
        income: !!isIncome,
        expense: !!isExpense,
        transfer: !!isTransfer,
      };
    },
  },

  methods: {
    ...mapActions("transaction", ["massUpdateTransactions"]),

    onClickCloseModal() {
      this.isShownModal = false;
    },

    async onClickSaveTransactions() {
      const RESET = null;

      const checkedTableItems = this.items.filter((item) => item.isChecked);
      const tableItemsId = checkedTableItems.map((item) => {
        return item.id;
      });

      let prepareForm = {
        ids: [...tableItemsId],
        paymentDate: this.form.paymentDate,
        accrualDate: this.form.accrualDate,
      };

      if (this.form.paymentConfirmed) {
        prepareForm.paymentConfirmed = this.form.paymentConfirmed;
      }

      if (this.form.accrualConfirmed) {
        prepareForm.accrualConfirmed = this.form.accrualConfirmed;
      }

      if (this.form.expenseAccount) {
        prepareForm.expenseAccountId = this.form.expenseAccount;
      }

      if (this.form.incomeAccount) {
        prepareForm.incomeAccountId = this.form.incomeAccount;
      }

      if (this.form.expense || this.form.expense === RESET) {
        prepareForm.expenseCategoryId = this.form.expense;
      }

      if (this.form.income || this.form.income === RESET) {
        prepareForm.incomeCategoryId = this.form.income;
      }

      if (this.form.transfer || this.form.transfer === RESET) {
        prepareForm.transferCategoryId = this.form.transfer;
      }

      if (this.form.countragent || this.form.countragent === RESET) {
        prepareForm.counterparty_id = this.form.countragent;
      }

      if (this.form.project || this.form.project === RESET) {
        prepareForm.projectId = this.form.project;
      }

      if (this.form.tag?.length || this.form.tag === RESET) {
        prepareForm.tagIds = this.form.tag;
      }

      if (this.form.descriptions || this.form.descriptions === RESET) {
        prepareForm.description = this.form.descriptions;
      }

      await this.massUpdateTransactions(prepareForm);

      this.isShownModal = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal-head {
  @apply mt-0 !important;
}
</style>
