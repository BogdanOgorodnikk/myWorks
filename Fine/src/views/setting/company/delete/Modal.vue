<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.setting.company.delete')"
    :action-button-text="$t('button.delete')"
    :disable-accept-button="!isAllAcceptedAttention"
    @actionConfirmed="onConfirmDeleteCompany"
  >
    <div v-html="$t('page.setting.company.deleteModalText', { title: item.name })" />

    <OurHint class="modal-attention">
      <div v-html="$t('description.deleteCompanyAttention')" />
    </OurHint>

    <div class="modal-block">
      <OurCheckbox
        v-model="isAcceptedDeleteTransactions"
        :label="$t('label.allCompanyTransactionsWillBeDeleted')"
        data-cy="accept-delete-transactions"
      />

      <OurCheckbox
        v-model="isAcceptedDeleteCompanyAccount"
        :label="$t('label.allCompanyAccountWillBeDeleted')"
        data-cy="accept-delete-company-account"
      />

      <OurCheckbox
        v-model="isAcceptedRecalculateBalance"
        :label="$t('label.businessBalanceWillBeRecalculated')"
        data-cy="accept-recalculate-balance"
      />

      <OurCheckbox
        v-model="isAcceptedChangeReports"
        data-cy="accept-change-reports"
        :label="$t('label.reportsWillBeChange')"
      />
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
    isAcceptedDeleteCompanyAccount: false,
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
        this.isAcceptedDeleteCompanyAccount = false;
        this.isAcceptedRecalculateBalance = false;
        this.isAcceptedChangeReports = false;

        this.$emit("input", value);
      },
    },

    isAllAcceptedAttention() {
      return (
        this.isAcceptedDeleteTransactions &&
        this.isAcceptedDeleteCompanyAccount &&
        this.isAcceptedRecalculateBalance &&
        this.isAcceptedChangeReports
      );
    },
  },

  methods: {
    ...mapActions("company", ["deleteCompany"]),

    async onConfirmDeleteCompany() {
      await this.deleteCompany({
        companyId: this.item.id,
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
