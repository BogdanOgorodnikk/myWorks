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
        :title="$t('page.setting.account.integrationWithBank')"
      />

      <BankInfo bank="privat24Business" :bank-title="$t('label.privatBankBusiness')" />

      <OurTextBlock v-html="$t('description.integrationWithBank')" />

      <OurInput
        v-model="form.autoClientId"
        :label="$t('label.autoClientId')"
        :error="autoClientIdError"
      />

      <OurInput
        v-model="form.bankToken"
        :label="$t('label.token')"
        :placeholder="$t('placeholder.password')"
        :description="$t('description.token')"
        :error="bankTokenError"
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
import { required } from "vuelidate/lib/validators";

import BankInfo from "@/views/setting/account/_components/BankInfo";

export default {
  name: "AddAccountIntegrationPrivatBusiness",

  components: {
    BankInfo,
  },

  data() {
    return {
      step: 3,
      totalSteps: 6,
      form: {
        autoClientId: "",
        bankToken: "",
      },
    };
  },

  validations: {
    form: {
      autoClientId: { required },
      bankToken: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },

    autoClientIdError() {
      const isDirty = this.$v.form.autoClientId.$dirty;
      const isFilled = this.$v.form.autoClientId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    bankTokenError() {
      const isDirty = this.$v.form.bankToken.$dirty;
      const isFilled = this.$v.form.bankToken.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillForm() {
      this.account ? Object.assign(this.form, this.account) : this.form;
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AddAccountChooseBank" });
    },

    onClickGoToNextStep() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.SET_ACCOUNT(this.form);

      this.$router.push({ name: "AddAccountIntegratedAccount" });
    },
  },
};
</script>
