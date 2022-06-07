<template>
  <OurCard class="head-card">
    <span class="head-card-title">{{ $t("title.addBankInformation") }}</span>
    <div class="input-group-line">
      <OurInput
        v-model="form.bankRoutingNumber"
        :label="$t('label.bankRoutingNumber')"
        :placeholder="$t('placeholder.bankRoutingNumber')"
        class="input-card-routing-number"
        :error="routingNumberError"
      >
      </OurInput>
      <OurInput
        v-model="form.bankAccountNumber"
        :label="$t('label.bankAccountNumber')"
        :placeholder="$t('placeholder.bankAccountNumber')"
        class="input-card-account-number"
        :error="accountNumberError"
      >
      </OurInput>
    </div>
    <div>
      <OurSelect
        v-model="form.bankAccountType"
        :options="accountTypeOptions"
        class="input-card-account-type"
        :label="$t('label.accountType')"
      >
      </OurSelect>
    </div>
    <div class="input-group-checkbox">
      <OurCheckbox v-model="form.makeDefault"></OurCheckbox>
      <span class="make-default-type">Make this my default payment type</span>
    </div>
    <div class="second-title">
      <span class="title-billing-infos">{{ $t("title.billingInformations") }}</span>
    </div>
    <div class="input-group-checkbox">
      <OurCheckbox v-model="form.sameAsBilling"></OurCheckbox>
      <span class="make-default-type"
        >Cardholder name/address same as billing contact information</span
      >
    </div>
    <div class="input-group-line">
      <OurInput
        v-model="form.firstName"
        :label="$t('label.firstName')"
        class="input-card-firstname"
        :error="nameError"
      >
      </OurInput>
      <OurInput
        v-model="form.lastName"
        :label="$t('label.lastName')"
        class="input-card-lastname"
        :error="lastNameError"
      >
      </OurInput>
    </div>
    <div>
      <OurInput
        v-model="form.addressLine1"
        :label="$t('label.streetAddressLine1')"
        class="input-card-streetAddressLine"
        :placeholder="$t('placeholder.streetAddressLine1')"
        :error="addressLine1Error"
      >
      </OurInput>
    </div>
    <div>
      <OurInput
        v-model="form.addressLine2"
        :label="$t('label.streetAddressLine2')"
        class="input-card-streetAddressLine"
      >
      </OurInput>
    </div>
    <div class="input-group-line">
      <OurInput
        v-model="form.city"
        :label="$t('label.city')"
        :placeholder="$t('placeholder.city')"
        class="input-card-city"
        :error="cityError"
      >
      </OurInput>
      <OurSelect
        v-model="form.state"
        :options="stateOptions"
        class="input-card-state"
        :label="$t('label.state')"
      >
      </OurSelect>
      <OurSelect
        v-model="form.country"
        :options="countryOptions"
        class="input-card-country"
        :label="$t('label.country')"
      >
      </OurSelect>
      <OurInput
        v-model="form.zipcode"
        :label="$t('label.ZIPCode')"
        :placeholder="$t('placeholder.ZIPCode')"
        class="input-card-zipcode"
        :error="zipCodeError"
      >
      </OurInput>
    </div>
    <div>
      <OurPhoneInput
        v-model="form.phone"
        class="input-card-phone"
        :label="$t('label.phoneNumber')"
        :placeholder="$t('placeholder.phone')"
        mode="national"
        :enabled-flags="false"
        :show-dial-code="false"
        :default-country="preparedCountry"
        :only-countries="[preparedCountry]"
        :error="phoneError"
      >
        <template #arrow-icon>
          <div />
        </template>
      </OurPhoneInput>
    </div>
    <div class="input-group-line">
      <OurButton
        class="input-card-button-left"
        size="lg"
        :text="$t('button.cancel')"
        @click="onClickBackStep"
      />
      <OurButton
        :class="inputButtonClass"
        size="lg"
        :text="$t('button.addPayment')"
        :disabled="isbuttonDisabled"
        @click="onClickNextStep"
      />
    </div>
  </OurCard>
</template>

<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";

const { isNumeric, routingNumberLength, accountNumberLength, phoneMinLength, phoneMaxLength } =
  ValidationService;

import addressMixins from "../mixins/address.mixin";

export default {
  mixins: [addressMixins],

  data: () => ({
    accountTypeOptions: [
      { id: "checking", label: "Checking" },
      { id: "businesschecking", label: "Business Checking" },
    ],
    form: {
      bankRoutingNumber: "",
      bankAccountNumber: "",
      bankAccountType: "checking",
      makeDefault: false,
      sameAsBilling: false,
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "Alabama",
      country: "usa",
      zipcode: "",
      phone: "",
    },
  }),

  validations: {
    form: {
      bankRoutingNumber: { required, isNumeric, routingNumberLength },
      bankAccountNumber: { required, isNumeric, accountNumberLength },
      firstName: { required },
      lastName: { required },
      addressLine1: { required },
      city: { required },
      state: { required },
      country: { required },
      zipcode: { required },
      phone: { required, phoneMinLength, phoneMaxLength },
    },
  },

  computed: {
    inputButtonClass() {
      return this.isbuttonDisabledMethod()
        ? "input-card-button-disabled"
        : "input-card-button-right";
    },
    isbuttonDisabled() {
      return this.isbuttonDisabledMethod();
    },
    routingNumberError() {
      const isDirty = this.$v.form.bankRoutingNumber.$dirty;
      const isFilled = this.$v.form.bankRoutingNumber.required;
      const isNumeric = this.$v.form.bankRoutingNumber.isNumeric;
      const isLength = this.$v.form.bankRoutingNumber.routingNumberLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isLength) {
        error = this.$t("validation.routingNumberLength");
      } else if (isDirty && !isNumeric) {
        error = this.$t("validation.routingNumberLength");
      }

      return error;
    },
    accountNumberError() {
      const isDirty = this.$v.form.bankAccountNumber.$dirty;
      const isFilled = this.$v.form.bankAccountNumber.required;
      const isNumeric = this.$v.form.bankAccountNumber.isNumeric;
      const isLength = this.$v.form.bankAccountNumber.accountNumberLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isLength) {
        error = this.$t("validation.accountNumberLength");
      } else if (isDirty && !isNumeric) {
        error = this.$t("validation.accountNumberLength");
      }

      return error;
    },
  },
  mounted() {
    window.onbeforeunload = this.backButtonPressed;
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },

  methods: {
    ...mapActions({
      addPaymentMethod: "billing/addPaymentMethod",
    }),
    isbuttonDisabledMethod() {
      return !this.form.bankRoutingNumber.length || !this.form.bankAccountNumber.length;
    },
    onClickBackStep() {
      if (!this.isbuttonDisabledMethod()) {
        if (confirm(this.$t("validation.changesMaybeNotSaved"))) {
          this.$router.back();
        }
      }
    },
    onClickNextStep() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      // TODO: check here the Auth conection
      // this.$emit("paymentAdded");
      this.sendPaymentDataToAnet();
    },
    backButtonPressed(e) {
      e.preventDefault();
      const confirmationMessage = this.$t("validation.changesMaybeNotSaved");

      (e || window.event).returnValue = confirmationMessage; // Gecko + IE

      return confirmationMessage;
    },
    sendPaymentDataToAnet() {
      var paymentData = {};

      paymentData.accountNumber = this.form.bankAccountNumber;
      paymentData.routingNumber = this.form.bankRoutingNumber;
      paymentData.nameOnAccount = this.form.lastName + this.form.firstName;
      paymentData.accountType = this.form.bankAccountType;

      this.addPaymentMethod({
        paymentData: paymentData,
        makeDefault: this.form.makeDefault,
        type: "bank",
        callbackSuccess: () => {
          this.$emit("paymentAdded");
        },
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.head-card {
  @apply h-auto !important;

  &-title {
    @apply text-2lg font-bold text-base-bright-red;
  }
  .input-card-routing-number {
    @apply mr-2 w-6/12;
  }
  .input-card-account-number {
    @apply ml-2 w-6/12;
  }
  .input-card-account-type {
    @apply w-64;
  }
  .input-group-line {
    @apply flex justify-between;

    .input-card-firstname {
      @apply mr-2 w-6/12;
    }
    .input-card-lastname {
      @apply ml-2 w-6/12;
    }
    .input-card-button-disabled {
      @apply w-6/12;
    }
    .input-card-button-left {
      @apply mr-2 w-6/12 bg-base-bright-red;
    }
    .input-card-button-right {
      @apply ml-2 w-6/12 bg-base-bright-red;
    }
    .input-card-city {
      @apply mr-2;
    }
    .input-card-zipcode {
      @apply ml-2;
    }
    .input-card-state {
      @apply mr-2 ml-2 w-9/12;
    }
    .input-card-country {
      @apply mr-2 ml-2 w-56;
    }
  }
  .input-group-checkbox {
    @apply flex;

    .make-default-type {
      @apply ml-3.5 text-base font-bold leading-5 text-base-dark;
    }
  }
  .second-title {
    @apply mb-8;
  }
  .title-billing-infos {
    @apply mt-8 text-2lg font-bold text-base-bright-red;
  }
  .input-card-firstname {
    @apply w-6/12;
  }
  .input-card-lastname {
    @apply w-6/12;
  }
}
</style>
