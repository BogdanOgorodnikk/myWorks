<template>
  <OurPageModal
    v-model="isShownModal"
    class="modal-head"
    :width="modalWidthClass"
    :title="modalTitle"
    :click-to-close="false"
  >
    <template #header-left-after>
      <OurDropdown
        class="modal-header-change"
        text=""
        variant="link"
        :dropdown-icon="false"
        size="xs"
        data-cy="change-type-button"
        list-x-position="left"
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

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>
  </OurPageModal>
</template>

<script>
import { TRANSACTION_TYPE } from "@/api/transaction";
import { mapActions } from "vuex";

import TransactionAdd from "@/views/transactions/_components/TransactionAdd";

export default {
  components: {
    TransactionAdd,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    transactionType: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    form: {},
    isShownDivideTable: true,
  }),

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    modalWidthClass() {
      return this.isShownDivideTable ? "4xl" : "md";
    },

    activeTransactionType: {
      get() {
        return this.transactionType;
      },
      set(value) {
        this.$emit("update:transactionType", value);
      },
    },

    modalType() {
      return {
        transfer: this.activeTransactionType === TRANSACTION_TYPE.transfer,
        income: this.activeTransactionType === TRANSACTION_TYPE.income,
        expense: this.activeTransactionType === TRANSACTION_TYPE.expense,
      };
    },

    modalTitle() {
      let title;

      if (this.activeTransactionType === TRANSACTION_TYPE.expense) {
        title = this.$t("title.transaction.expense");
      }

      if (this.activeTransactionType === TRANSACTION_TYPE.income) {
        title = this.$t("title.transaction.income");
      }

      if (this.activeTransactionType === TRANSACTION_TYPE.transfer) {
        title = this.$t("title.transaction.transfer");
      }

      return title;
    },
  },

  methods: {
    ...mapActions("transaction", ["addTransaction", "addTransfer"]),

    onClickChangeModalForm(type) {
      this.activeTransactionType = type;

      if (type === TRANSACTION_TYPE.transfer) this.isShownDivideTable = false;
    },

    onClickCloseModal() {
      this.isShownModal = false;

      this.form = {};
    },

    async onSubmitForm() {
      if (this.modalType.income || this.modalType.expense) {
        this.$refs.transactionAdd.validate();

        if (this.form.isValid) {
          await this.addTransaction(this.form);

          this.form = {};

          this.isShownModal = false;
        }
      } else {
        this.$refs.transactionAdd.validate();

        if (this.form.isValid) {
          await this.addTransfer({ transaction: this.form });

          this.form = {};

          this.isShownModal = false;
        }
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal-head {
  @apply mt-0 !important;
}

.modal-header-change {
  @apply ml-4;
}
</style>
