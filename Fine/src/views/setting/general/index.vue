<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.common._')"
    width="md"
    data-cy="general-settings-page"
  >
    <OurCard>
      <OurInput
        v-model="form.businessName"
        :label="$t('label.businessName')"
        :placeholder="$t('placeholder.businessName')"
        :description="$t('description.businessName')"
        :error="businessNameError"
        data-cy="business-name-input"
      />

      <!--      TODO: Temporary hidden till launch on Ukraine market-->

      <!--      <OurSelect-->
      <!--        v-model="form.country"-->
      <!--        :options="countries"-->
      <!--        :label="$t('label.country')"-->
      <!--        valueKey="code"-->
      <!--      />-->

      <OurInput
        v-model="form.baseCurrency"
        :label="$t('label.baseCurrency')"
        :description="$t('description.baseCurrency')"
        :error="baseCurrencyError"
        data-cy="business-currency-input"
        disabled
      />

      <OurInput :value="appVersion" :label="$t('label.appVersion')" disabled />
    </OurCard>

    <OurCard class="general-settings-card">
      <OurCheckbox v-model="form.isShownPennies" :label="$t('label.showCents')" />

      <OurCheckbox
        v-model="form.isConfirmedOperations"
        :label="$t('label.confirmedOperationDefault')"
      />
    </OurCard>

    <template #footer-left>
      <OurButton data-cy="submit-button" :text="$t('button.save')" @click="onClickSaveSettings" />
      <OurButton
        data-cy="back-button"
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToSettings"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import router from "@/router";

const { version } = require(`${process.env.BASE_URL}package.json`);

export default {
  name: "GeneralSettings",

  data: () => ({
    form: {
      businessName: "",
      country: "",
      baseCurrency: "",
      isShownPennies: false,
      isConfirmedOperations: false,
    },
  }),

  validations: {
    form: {
      businessName: { required },
      baseCurrency: { required },
    },
  },

  computed: {
    ...mapState("settings", ["settings"]),
    ...mapState("business", ["businesses"]),

    ...mapGetters("settings", ["countries", "brandName"]),
    ...mapGetters("currency", ["currencyLabel"]),

    businessNameError() {
      const isDirty = this.$v.form.businessName.$dirty;
      const isFilled = this.$v.form.businessName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    baseCurrencyError() {
      const isDirty = this.$v.form.baseCurrency.$dirty;
      const isFilled = this.$v.form.baseCurrency.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },

    appVersion() {
      return `v.${version}`;
    },
  },

  async created() {
    await this.getSettings();

    this.prefillForm();
  },

  methods: {
    ...mapActions("settings", ["getSettings", "updateSettings"]),
    ...mapActions("business", ["updateBusiness"]),

    prefillForm() {
      const currentCurrency = {
        code: this.settings.currency.current,
        symbol: this.settings.currency.currentSymbol,
      };

      this.form.country = this.settings?.country?.current;
      this.form.baseCurrency = this.currencyLabel(currentCurrency);
      this.form.businessName = this.brandName;
      this.form.timezone = this.settings?.timezone?.current;
      this.form.currentSymbol = this.settings?.currency?.currentSymbol;
      this.form.isShownPennies = this.settings?.showCents?.current;
      this.form.isConfirmedOperations = this.settings?.makeConfirmed?.current;
    },

    async onClickSaveSettings() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const editedBusiness = this.businesses.find((item) => item.name === this.brandName);

      const data = {
        country: this.form.country,
        currentSymbol: this.form.currentSymbol,
        timezone: this.form.timezone,
        showCents: this.form.isShownPennies,
        makeConfirmed: this.form.isConfirmedOperations,
      };

      const businessData = {
        id: editedBusiness.id,
        name: this.form.businessName,
      };

      await Promise.all([
        this.updateSettings(data),
        this.updateBusiness({ businessData, withNotify: false }),
      ]);
    },

    onClickBackToSettings() {
      router.push({ name: "SettingsList" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.general-settings-card {
  @apply mt-4;
}
</style>
