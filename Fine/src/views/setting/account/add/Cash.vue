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

      <OurMoneyInput v-model="form.startBalance" />

      <OurSelect
        v-model="form.companyId"
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
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  name: "AddAccountCash",

  data() {
    return {
      step: 2,
      totalSteps: 2,
      form: {
        accountType: "cash",
        currencyId: "",
        companyId: "",
        accountName: "",
        startBalance: {
          initialCurrency: {
            sum: "",
            label: this.$t("label.startBalance"),
            placeholder: "0",
            symbol: "",
          },
        },
      },
    };
  },

  validations: {
    form: {
      accountName: { required },
      currencyId: { required },
      companyId: { required },
    },
  },

  computed: {
    ...mapGetters("currency", ["currencies"]),
    ...mapGetters("company", ["companiesForSelect"]),
    ...mapGetters("settings", ["baseCurrency"]),

    accountNameError() {
      const isDirty = this.$v.form.accountName.$dirty;
      const isFilled = this.$v.form.accountName.required;

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

    companyError() {
      const isDirty = this.$v.form.companyId.$dirty;
      const isFilled = this.$v.form.companyId.required;

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
    await Promise.all([this.getCurrencies(), this.getCompanies()]);

    this.prefillForm();
  },

  methods: {
    ...mapActions("currency", ["getCurrencies"]),
    ...mapActions("bankAccount", ["addAccount"]),
    ...mapActions("company", ["getCompanies"]),

    prefillForm() {
      const currency = this.currencies.find((item) => item.id === this.baseCurrency.currentId);
      const companyId = this.companiesForSelect.find((item) => item);

      this.form.currencyId = currency.id;
      this.form.companyId = companyId.id;

      this.form.startBalance.initialCurrency.symbol = currency.symbol;
    },

    onChangeCurrencyId() {
      const currency = this.currencies.find((item) => item.id === this.form.currencyId);

      this.form.startBalance.initialCurrency.symbol = currency.symbol;
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AccountAdd" });
    },

    async onClickCreateAccount() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const form = {
        name: this.form.accountName,
        currencyId: this.form.currencyId,
        companyId: this.form.companyId,
        startingBalance: this.form.startBalance.initialCurrency.sum,
        isCash: true,
      };

      await this.addAccount(form);

      await this.$router.push({ name: "AccountList" });
    },
  },
};
</script>
