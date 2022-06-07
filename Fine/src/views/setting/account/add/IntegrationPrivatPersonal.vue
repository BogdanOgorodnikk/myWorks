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

      <BankInfo bank="privat24Personal" :bank-title="$t('label.privatBankPersonal')" />

      <OurTextBlock v-html="$t('description.integrationWithBank')" />

      <OurInput v-model="form.ipAddressFine" :label="$t('label.ipAddressFine')" disabled>
        <template #icon>
          <OurSvgIcon
            name="Duplicate"
            :tooltip-settings="tooltipSettings"
            :tooltip="tippyDescription"
            @click="onClickCopyIp"
          />
        </template>
      </OurInput>

      <OurInput
        v-model="form.merchantId"
        :label="$t('label.merchantId')"
        :error="merchantIdError"
      />

      <OurInput
        v-model="form.merchantPassword"
        :label="$t('label.merchantPassword')"
        :error="merchantPasswordError"
        :placeholder="$t('placeholder.password')"
      />

      <OurInput
        v-model="form.cardNumber"
        :label="$t('label.cardNumber')"
        :error="cardNumberError"
        :placeholder="$t('placeholder.cardNumber')"
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
import { getServerIP } from "@/api/settings";
import { required } from "vuelidate/lib/validators";

import BankInfo from "@/views/setting/account/_components/BankInfo";

export default {
  name: "AddAccountIntegrationPrivatPersonal",

  components: {
    BankInfo,
  },

  data() {
    return {
      step: 3,
      totalSteps: 6,
      tippyDescription: "",
      form: {
        ipAddressFine: "",
        merchantId: "",
        merchantPassword: "",
        cardNumber: "",
      },
      tooltipSettings: {
        trigger: "click",
      },
    };
  },

  validations: {
    form: {
      merchantId: { required },
      merchantPassword: { required },
      cardNumber: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    merchantIdError() {
      const isDirty = this.$v.form.merchantId.$dirty;
      const isFilled = this.$v.form.merchantId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    merchantPasswordError() {
      const isDirty = this.$v.form.merchantPassword.$dirty;
      const isFilled = this.$v.form.merchantPassword.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    cardNumberError() {
      const isDirty = this.$v.form.cardNumber.$dirty;
      const isFilled = this.$v.form.cardNumber.required;

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
    this.prefillForm();

    this.form.ipAddressFine = await getServerIP();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    async onClickCopyIp() {
      try {
        await navigator.clipboard.writeText(this.form.ipAddressFine);

        this.tippyDescription = this.$t("label.copied");
      } catch (e) {
        this.tippyDescription = this.$t("label.copyError");
      }
    },

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
