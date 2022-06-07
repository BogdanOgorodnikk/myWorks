<template>
  <OurCard>
    <OurInput
      v-model="form.name"
      data-cy="company-name-input"
      :label="$t('label.businessName')"
      :placeholder="$t('placeholder.businessName')"
      :description="$t('description.businessName')"
      :error="companyNameError"
    />

    <OurSelect
      v-model="form.currencyId"
      data-cy="company-currency-select"
      :label="$t('label.baseCurrency')"
      :description="$t('description.baseCurrency')"
      :options="currencies"
      :error="currencyError"
    />
  </OurCard>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";

const DEFAULT_CURRENCY = "UAH";
const IS_MAIN_BASE_URL = true;

export default {
  data: () => ({
    form: {
      currencyId: "",
      name: "",
    },
  }),

  validations: {
    form: {
      currencyId: { required },
      name: { required },
    },
  },

  computed: {
    ...mapGetters("currency", ["currencies"]),

    currencyError() {
      const isDirty = this.$v.form.currencyId.$dirty;
      const isFilled = this.$v.form.currencyId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    companyNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  async created() {
    await this.getCurrencies(IS_MAIN_BASE_URL);
    this.preFillForm();
  },

  methods: {
    ...mapActions("currency", ["getCurrencies"]),

    preFillForm() {
      this.form.currencyId = this.currencies.find(
        (currency) => currency.code === DEFAULT_CURRENCY
      ).id;
    },

    updateForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      // It need for testing creation of new App without real deployment on server.
      if (window.Cypress) {
        this.form.dryRun = true;
      }

      this.$emit("update:form", this.form);
    },
  },
};
</script>
