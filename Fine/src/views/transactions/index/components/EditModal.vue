<template>
  <OurPageModal
    v-model="isShownModal"
    class="modal-head"
    :click-to-close="false"
    :width="modalWidthClass"
  >
    <template #header-left>
      <div class="modal-head-wrapper">
        <OurSvgIcon
          v-if="isActiveCopyTransactionMode"
          name="Duplicate"
          class="modal-copy-icon"
          :tooltip="$t('title.transaction.copy')"
        />

        <div class="modal-title">
          {{ modalTitle }}
        </div>

        <OurDropdown
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
      </div>
    </template>

    <TransactionEdit
      ref="transactionEdit"
      v-model="form"
      :transaction-id="transactionId"
      :shown-delete-modal.sync="isShownDeleteModal"
      :divide-table.sync="isShownDivideTable"
      :transaction-type="activeTransactionType"
      @confirmDeleteTransaction="onConfirmDeleteTransaction"
    />

    <template #footer-left>
      <OurButton :text="buttonTitle" @click="onClickSaveTransaction" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary">
        <div v-if="!isActiveCopyTransactionMode" @click="onClickChangeCopyStateTransaction">
          {{ $t("button.copy") }}
        </div>

        <div v-if="isActiveCopyTransactionMode" @click="onClickChangeCopyStateTransaction">
          {{ $t("button.cancelCopy") }}
        </div>

        <div @click="onClickDeleteTransaction">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>
  </OurPageModal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { TRANSACTION_TYPE } from "@/api/transaction";

import TransactionEdit from "@/views/transactions/_components/TransactionEdit";

export default {
  components: {
    TransactionEdit,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    transactionId: {
      type: Number,
      default: null,
    },

    transactionType: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isShownDivideTable: false,
      isShownDeleteModal: false,
      isActiveCopyTransactionMode: false,
      form: {},
    };
  },

  computed: {
    ...mapState("transaction", ["transactions"]),

    buttonTitle() {
      return this.isActiveCopyTransactionMode ? this.$t("button.add") : this.$t("button.save");
    },

    modalTitle() {
      let title;

      if (this.modalType.expense) {
        title = this.$t("title.transaction.expense");
      }

      if (this.modalType.income) {
        title = this.$t("title.transaction.income");
      }

      if (this.modalType.transfer) {
        title = this.$t("title.transaction.transfer");
      }

      return title;
    },

    modalWidthClass() {
      return this.isShownDivideTable ? "4xl" : "md";
    },

    modalType() {
      return {
        transfer: this.activeTransactionType === TRANSACTION_TYPE.transfer,
        income: this.activeTransactionType === TRANSACTION_TYPE.income,
        expense: this.activeTransactionType === TRANSACTION_TYPE.expense,
      };
    },

    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    activeTransactionType: {
      get() {
        return this.transactionType;
      },
      set(value) {
        this.$emit("update:transactionType", value);
      },
    },
  },

  watch: {
    isShownModal: "onChangeShownModal",
  },

  methods: {
    ...mapActions("transaction", [
      "updateTransaction",
      "addTransaction",
      "addTransfer",
      "updateTransfer",
    ]),

    onClickChangeModalForm(type) {
      this.activeTransactionType = type;

      if (type === TRANSACTION_TYPE.transfer) this.isShownDivideTable = false;
    },

    onConfirmDeleteTransaction() {
      this.isShownModal = false;
    },

    onClickDeleteTransaction() {
      this.isShownDeleteModal = true;
    },

    onClickChangeCopyStateTransaction() {
      this.isActiveCopyTransactionMode = !this.isActiveCopyTransactionMode;

      const modalHead = document.querySelector(".modal-head");

      modalHead.scrollTo(0, 0);

      if (
        this.form.categoryType === TRANSACTION_TYPE.income ||
        this.form.categoryType === TRANSACTION_TYPE.expense
      ) {
        this.$refs.transactionEdit.$refs.transactionForm.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
      } else {
        this.$refs.transactionEdit.$refs.transferForm.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
      }
    },

    onChangeShownModal() {
      this.isActiveCopyTransactionMode = false;

      setTimeout(() => {
        this.isShownDivideTable = false;
      }, 0);

      if (!this.isShownModal) {
        this.$router.replace({ query: {} });
      }
    },

    onClickCloseModal() {
      this.isShownModal = false;
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

          this.isShownModal = false;
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

          this.isShownModal = false;
        }
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal {
  &-head {
    @apply mt-0 !important;

    &-wrapper {
      @apply flex items-center;
    }
  }

  &-copy-icon {
    @apply mr-2 cursor-pointer;

    &::v-deep g [fill] {
      @apply text-gray-500;
    }
  }

  &-title {
    @apply text-3xl font-bold text-base-dark;
    @apply mr-4;
  }
}
</style>
