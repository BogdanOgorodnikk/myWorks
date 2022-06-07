<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.account.delete')"
    :action-button-text="$t('button.delete')"
    :disable-accept-button="!isAllAcceptedAttention"
    class="delete-account-modal"
    @actionConfirmed="onConfirmDeleteAccount"
  >
    <div v-html="$t('page.setting.account.deleteAccountDescription', { title: item.name })" />

    <OurHint class="modal-attention">
      <div v-html="$t('description.deleteAccountAttention')" />
    </OurHint>

    <div class="modal-block">
      <OurCheckbox
        v-model="isAcceptedDeleteTransactions"
        :label="$t('label.allTransactionsWillBeDeleted')"
      />

      <OurCheckbox
        v-model="isAcceptedRecalculateBalance"
        :label="$t('label.businessBalanceWillBeRecalculated')"
      />

      <OurCheckbox v-model="isAcceptedChangeReports" :label="$t('label.reportsWillBeChange')" />
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

    item: {
      type: Object,
      default: () => {},
    },

    delaySuccessNotify: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isAcceptedDeleteTransactions: false,
    isAcceptedRecalculateBalance: false,
    isAcceptedChangeReports: false,
  }),

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },

      set(value) {
        this.isAcceptedDeleteTransactions = false;
        this.isAcceptedRecalculateBalance = false;
        this.isAcceptedChangeReports = false;

        this.$emit("input", value);
      },
    },

    isAllAcceptedAttention() {
      return (
        this.isAcceptedDeleteTransactions &&
        this.isAcceptedRecalculateBalance &&
        this.isAcceptedChangeReports
      );
    },
  },

  methods: {
    ...mapActions("bankAccount", ["deleteAccount"]),

    async onConfirmDeleteAccount() {
      await this.deleteAccount({
        accountId: this.item.id,
        currentRoute: this.$route.name,
        delaySuccessNotify: this.delaySuccessNotify,
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal {
  &-attention {
    @apply my-6;
  }

  &-block {
    @apply space-y-4;
  }
}
</style>
