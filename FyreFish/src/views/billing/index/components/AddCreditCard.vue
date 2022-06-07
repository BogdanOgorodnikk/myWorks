<template>
  <OurCard class="head-card">
    <span class="head-card-title">{{ $t("title.addCreditCard") }}</span>
    <div>
      <OurInput
        v-model="form.cardNumber"
        :label="$t('label.creditCardNumber')"
        :placeholder="$t('placeholder.creditCardNumber')"
        class="input-card-number"
        :error="cardNumberError"
      >
      </OurInput>
    </div>
    <div class="input-group-line">
      <OurInput
        v-model="form.expirationDate"
        :label="$t('label.expirationDate')"
        :placeholder="$t('placeholder.expirationDate')"
        class="input-expiration-date"
        :error="expirationDateError"
      >
      </OurInput>
      <OurInput
        v-model="form.cvv"
        :label="$t('label.cvvCode')"
        :placeholder="$t('placeholder.cvvCode')"
        class="input-cvv"
        :error="cvvError"
      >
      </OurInput>
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
        class="input-card-button-right"
        size="lg"
        :text="$t('button.addPayment')"
        @click="onClickNextStep"
      />
    </div>
  </OurCard>
</template>

<script>
import { mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";

const {
  creditCardMinLength,
  creditCardMaxLength,
  cvvMinLength,
  cvvMaxLength,
  expirationDateFormat,
  isNumeric,
  phoneMinLength,
  phoneMaxLength,
} = ValidationService;

import addressMixins from "../mixins/address.mixin";

export default {
  mixins: [addressMixins],

  data: () => ({
    form: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
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
      cardNumber: { required, isNumeric, creditCardMinLength, creditCardMaxLength },
      expirationDate: { required, expirationDateFormat },
      cvv: { required, isNumeric, cvvMinLength, cvvMaxLength },
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
    cardNumberError() {
      const isDirty = this.$v.form.cardNumber.$dirty;
      const isFilled = this.$v.form.cardNumber.required;
      const isNumeric = this.$v.form.cardNumber.isNumeric;
      const isMinLength = this.$v.form.cardNumber.creditCardMinLength;
      const isMaxLength = this.$v.form.cardNumber.creditCardMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.creditCardLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.creditCardLength");
      } else if (isDirty && !isNumeric) {
        error = this.$t("validation.creditCardLength");
      }

      return error;
    },
    expirationDateError() {
      const isDirty = this.$v.form.expirationDate.$dirty;
      const isFilled = this.$v.form.expirationDate.required;
      const isNotDate = this.$v.form.expirationDate.expirationDateFormat;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isNotDate) {
        error = this.$t("validation.dateformat");
      }

      return error;
    },
    cvvError() {
      const isDirty = this.$v.form.cvv.$dirty;
      const isFilled = this.$v.form.cvv.required;
      const isNumeric = this.$v.form.cvv.isNumeric;
      const isMinLength = this.$v.form.cvv.cvvMinLength;
      const isMaxLength = this.$v.form.cvv.cvvMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.cvvLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.cvvLength");
      } else if (isDirty && !isNumeric) {
        error = this.$t("validation.cvvLength");
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
    onClickBackStep() {
      if (confirm(this.$t("validation.changesMaybeNotSaved"))) {
        this.$router.back();
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
      let paymentData = {};
      const separatedExpirationdate = this.form.expirationDate.split("/");
      const month = separatedExpirationdate[0];
      const year = separatedExpirationdate[1];

      paymentData.cardNumber = this.form.cardNumber;
      paymentData.month = month;
      paymentData.year = year;
      paymentData.cardCode = this.form.cvv;

      this.addPaymentMethod({
        paymentData: paymentData,
        makeDefault: this.form.makeDefault,
        type: "card",
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
  .input-card-number {
    @apply mt-6 w-full leading-6;
    .error-message {
      @apply mb-4;
    }
  }

  .input-group-line {
    @apply flex justify-between;

    .input-expiration-date,
    .input-card-firstname {
      @apply mr-2 w-6/12;
    }
    .input-cvv,
    .input-card-lastname {
      @apply ml-2 w-6/12;
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
