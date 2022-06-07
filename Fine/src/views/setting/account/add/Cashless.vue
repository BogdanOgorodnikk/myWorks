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
        :title="$t('page.setting.account.inputNameAndCompany')"
      />

      <OurInput
        v-model="form.accountName"
        :label="$t('label.name')"
        :placeholder="$t('placeholder.accountName')"
        :error="accountNameError"
      />

      <OurSelect
        v-model="form.currencyId"
        :options="currencies"
        :label="$t('label.currency')"
        disabled
      />

      <OurInput v-model="form.startBalance" :label="$t('label.startBalance')" disabled />

      <OurSelect
        v-model="form.accountCompanyId"
        :options="companiesForSelect"
        :label="$t('label.company')"
        :description="$t('description.accountCompany')"
        :error="companyError"
      />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPreviousStep" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.save')" @click="onClickIntegrateAccount" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import { addIntegrationWithMonobank } from "@/api/bankAccount";

export default {
  name: "AddAccountCashless",

  data: () => ({
    step: 6,
    totalSteps: 6,
    form: {
      accountName: "",
      accountCompanyId: "",
      startBalance: "0",
      currencyId: "",
      accountId: "",
      bankCode: "",
      bankToken: "",
      dateStartDownloadOperation: "",
      bankAccountId: "",
    },
  }),

  validations: {
    form: {
      accountName: { required },
      accountCompanyId: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account", "accountId"]),

    ...mapGetters("company", ["companiesForSelect"]),
    ...mapGetters("currency", ["currencies"]),

    accountNameError() {
      const isDirty = this.$v.form.accountName.$dirty;
      const isFilled = this.$v.form.accountName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    companyError() {
      const isDirty = this.$v.form.accountCompanyId.$dirty;
      const isFilled = this.$v.form.accountCompanyId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },
  },

  async created() {
    await Promise.all([this.getCompanies(), this.getCurrencies()]);

    this.prefillForm();
  },

  methods: {
    ...mapActions("company", ["getCompanies"]),
    ...mapActions("currency", ["getCurrencies"]),
    ...mapActions("bankAccount", ["addAccount"]),

    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillForm() {
      const firstCompany = this.companiesForSelect.find((item) => item);

      this.form.accountCompanyId = firstCompany.id;
      this.form.currencyId = this.account.currencyId;
      this.form.accountId = this.account.accountId;
      this.form.bankCode = this.account.bankCode;
      this.form.bankToken = this.account.bankToken;
      this.form.dateStartDownloadOperation = this.account.dateStartDownloadOperation;
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AddAccountImportAccountDataFromBank" });
    },

    async createAccount() {
      const form = {
        name: this.form.accountName,
        currencyId: this.form.currencyId,
        companyId: this.form.accountCompanyId,
        startingBalance: this.form.startBalance,
        isCash: false,
        bank: this.form.bankCode,
      };

      await this.addAccount(form);

      this.form.bankAccountId = this.accountId;
    },

    async onClickIntegrateAccount() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      await this.createAccount();

      const form = {
        accountId: this.form.accountId,
        token: this.form.bankToken,
        bankAccountId: this.form.bankAccountId,
        firstSyncStep: this.form.dateStartDownloadOperation,
      };

      await addIntegrationWithMonobank(form);

      await this.$router.push({ name: "AccountList" });
    },
  },
};
</script>
