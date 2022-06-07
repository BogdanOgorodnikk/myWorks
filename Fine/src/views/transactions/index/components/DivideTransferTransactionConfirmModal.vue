<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.divideTransaction')"
    :action-button-text="$t('button.divide')"
    @actionConfirmed="onConfirmDivideTransaction"
  >
    <div>
      {{ $t("page.transactions.divideTransferTransactionModal") }}
    </div>
  </OurConfirmModal>
</template>

<script>
import { mapActions } from "vuex";

export default {
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

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    ...mapActions("transaction", ["divideTransferTransaction"]),

    async onConfirmDivideTransaction() {
      const transferTransaction = this.items.find((item) => item.isChecked);

      await this.divideTransferTransaction(transferTransaction.id);
    },
  },
};
</script>
