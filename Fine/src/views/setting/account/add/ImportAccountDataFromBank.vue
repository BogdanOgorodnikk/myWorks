<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.account.add')"
    width="md"
    mobile-footer-reverse
  >
    <OurCard>
      <OurStepper
        :step="step"
        :total-steps="totalSteps"
        :title="$t('page.setting.account.enterYourAccountDetails')"
      />

      <BankInfo
        :bank="form.bankCode"
        :bank-title="form.bankCode"
        status-type="doubleAccepted"
        :status-title="$t('label.accountAdded')"
        :bank-account="cardNumber"
      />

      <div class="import-account-description">{{ $t("description.importAccount") }}</div>

      <OurDatePicker
        v-model="form.dateStartDownloadOperation"
        :label="$t('label.startLoadTransactionsFrom')"
      >
        <template #icon>
          <OurSvgIcon name="Time-schedule" color="gray" class="icon" />
        </template>
      </OurDatePicker>

      <OurTextarea
        v-model="form.stopWords"
        :label="$t('label.stopWords')"
        :placeholder="$t('placeholder.stopWords')"
        :description="$t('description.stopWords')"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPreviousStep" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.continue')" @click="onClickGoToNextStep" />
    </template>
  </OurPage>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { getUnixTime } from "date-fns";

import BankInfo from "@/views/setting/account/_components/BankInfo";

export default {
  name: "AddAccountImportAccountDataFromBank",

  components: {
    BankInfo,
  },

  data() {
    return {
      step: 5,
      totalSteps: 6,
      form: {
        dateStartDownloadOperation: "",
        stopWords: "",
      },
    };
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },

    cardNumber() {
      const account = this.account.accounts.find(
        (account) => account.accountId === this.form.accountId
      );

      return account.card || account.iban;
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillForm() {
      this.account ? Object.assign(this.form, this.account) : this.form;

      this.form.dateStartDownloadOperation = getUnixTime(new Date());
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AddAccountIntegratedAccount" });
    },

    onClickGoToNextStep() {
      this.SET_ACCOUNT(this.form);

      this.$router.push({ name: "AddAccountCashless" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.import-account-description {
  @apply text-base font-normal text-base-dark;
}

.icon {
  @apply absolute top-0 right-0 p-4;
}
</style>
