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
        :error="currencyError"
        @change="onChangeCurrencyId"
      />

      <OurMoneyInput v-model="form.startBalance" :error="startBalanceError" />

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
      <OurButton :text="$t('button.save')" @click="onClickCreateAccount" />
    </template>
  </OurPage>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  name: "AddAccountIntegrationWithOtherBank",

  data() {
    return {
      step: 3,
      totalSteps: 3,
      form: {
        startBalance: {
          initialCurrency: {
            sum: "",
            label: this.$t("label.startBalance"),
            placeholder: "0",
            symbol: "",
          },
        },
        currencyId: "",
        accountName: "",
        accountCompanyId: "",
      },
    };
  },

  validations: {
    form: {
      startBalance: { initialCurrency: { sum: { required } } },
      currencyId: { required },
      accountName: { required },
      accountCompanyId: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    ...mapGetters("settings", ["baseCurrency"]),
    ...mapGetters("currency", ["currencies"]),
    ...mapGetters("company", ["companiesForSelect"]),

    startBalanceError() {
      const isDirty = this.$v.form.startBalance.initialCurrency.sum.$dirty;
      const isFilled = this.$v.form.startBalance.initialCurrency.sum.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    currencyError() {
      const isDirty = this.$v.form.currencyId.$dirty;
      const isFilled = this.$v.form.currencyId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

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

    prefillForm() {
      const currency = this.currencies.find((item) => item.id === this.baseCurrency.currentId);
      const firstCompany = this.companiesForSelect.find((item) => item);

      this.account ? Object.assign(this.form, this.account) : this.form;
      this.form.currencyId = currency.id;
      this.form.accountCompanyId = firstCompany.id;

      this.form.startBalance.initialCurrency.symbol = currency.symbol;
    },

    onChangeCurrencyId() {
      const currency = this.currencies.find((item) => item.id === this.form.currencyId);

      this.form.startBalance.initialCurrency.symbol = currency.symbol;
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AddAccountChooseBank" });
    },

    async onClickCreateAccount() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const form = {
        name: this.form.accountName,
        currencyId: this.form.currencyId,
        companyId: this.form.accountCompanyId,
        startingBalance: this.form.startBalance.initialCurrency.sum,
        isCash: false,
        bank: this.form.bankCode,
      };

      await this.addAccount(form);

      await this.$router.push({ name: "AccountList" });
    },
  },
};
</script>
