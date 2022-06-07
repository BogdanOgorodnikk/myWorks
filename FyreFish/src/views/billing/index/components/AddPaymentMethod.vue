<template>
  <div>
    <OurCard class="card">
      <div class="payment-wrapper">
        <PaymentRadioButton
          v-for="button in paymentRadioButtons"
          :key="button.value"
          v-model="form.paymentType"
          class="payment-wrapper-item"
          :option="button"
        />
      </div>

      <div v-if="isCardPaymentType" class="payment-card-block">
        <div class="payment-wrapper">
          <OurInput
            v-model="form.cardNumber"
            :error="cardNumberError"
            class="payment-wrapper-item"
            :label="$t('label.creditCardNumber')"
            :placeholder="$t('placeholder.creditCardNumber')"
          />

          <div class="payment-wrapper payment-wrapper-item">
            <OurInput
              v-model="form.expirationDate"
              :error="expirationDateError"
              class="payment-wrapper-item"
              :label="$t('label.expirationDate')"
              :placeholder="$t('placeholder.expirationDate')"
              name="expirationDate"
            />

            <OurInput
              v-model="form.cvvCode"
              :error="cvvCodeError"
              class="payment-wrapper-item"
              :label="$t('label.cvvCode')"
              :placeholder="$t('placeholder.cvvCode')"
              type="password"
              name="ccvCode"
            />
          </div>
        </div>

        <div class="payment-wrapper">
          <OurInput
            v-model="form.nameOnCard"
            :error="nameOnCardError"
            class="payment-wrapper-item"
            :label="$t('label.nameOnCard')"
            :placeholder="$t('placeholder.nameOnCard')"
          />

          <div class="payment-wrapper-item">
            <div class="payment-switch-wrapper">
              <OurSwitch v-model="form.usedServiceAddress" with-text size="lg" variant="green" />
              <div class="payment-switch-wrapper-text">
                {{ $t("label.useServiceAddress") }}
              </div>
            </div>
            <div class="payment-switch-wrapper">
              <OurSwitch v-model="form.makeDefault" with-text size="lg" variant="green" />
              <div class="payment-switch-wrapper-text">
                {{ $t("label.makeDefault") }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="payment-card-block">
        <div class="payment-wrapper">
          <OurInput
            v-model="form.bankAccountNumber"
            :label="$t('label.bankAccountNumber')"
            :placeholder="$t('placeholder.bankAccountNumber')"
            :error="bankAccountNumberError"
            class="payment-wrapper-item"
          />

          <OurInput
            v-model="form.bankRoutingNumber"
            :label="$t('label.bankRoutingNumber')"
            :placeholder="$t('placeholder.bankRoutingNumber')"
            :error="bankRoutingNumberError"
            class="payment-wrapper-item"
          />
        </div>

        <div class="payment-wrapper">
          <div class="payment-wrapper-item">
            <OurSelect
              v-model="form.bankAccountType"
              :options="accountTypeOptions"
              class="input-card-account-type"
              :label="$t('label.accountType')"
            >
            </OurSelect>
          </div>
          <div class="payment-wrapper-item">
            <div class="payment-switch-wrapper">
              <OurSwitch v-model="form.usedServiceAddress" with-text size="lg" variant="green" />
              <div class="payment-switch-wrapper-text">
                {{ $t("label.useServiceAddress") }}
              </div>
            </div>
            <div class="payment-switch-wrapper">
              <OurSwitch v-model="form.makeDefault" with-text size="lg" variant="green" />
              <div class="payment-switch-wrapper-text">
                {{ $t("label.makeDefault") }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!form.usedServiceAddress" class="payment-address-block">
        <div class="separated-border" />

        <div class="card-title">{{ $t("title.yourBillingAddress") }}</div>

        <OurInput
          v-model="form.serviceAddressBilling"
          :error="serviceAddressError"
          :label="$t('label.streetAddress')"
        />

        <OurInput v-model="form.unitAddressBilling" :label="$t('label.unitAddress')" />

        <div class="payment-wrapper">
          <OurInput
            v-model="form.cityBilling"
            :error="cityError"
            :label="$t('label.city')"
            :placeholder="$t('placeholder.city')"
          />
          <OurSelect
            v-model="form.stateProvBilling"
            :options="stateOptions"
            open-direction="top"
            class="input-card-state"
            :label="$t('label.state')"
            :error="stateError"
          >
          </OurSelect>
          <OurSelect
            v-model="form.countryBilling"
            :options="countryOptions"
            open-direction="top"
            class="input-card-country"
            :label="$t('label.country')"
            :error="countryError"
          >
          </OurSelect>
          <OurInput
            v-model="form.zipCodeBilling"
            :error="zipCodeError"
            :label="$t('label.ZIPCode')"
            :placeholder="$t('placeholder.ZIPCode')"
          />
        </div>
      </div>
      <div v-else class="payment-address-block">
        <div class="card-separator" />
        <div class="card-title">{{ $t("title.yourBillingAddress") }}</div>

        <OurInput v-model="form.serviceAddress" :label="$t('label.streetAddress')" disabled />

        <OurInput v-model="form.unitAddress" :label="$t('label.unitAddress')" disabled />

        <div class="card-wrapper">
          <OurInput
            v-model="form.city"
            :label="$t('label.city')"
            :placeholder="townInformation.city"
            disabled
          />
          <OurInput
            v-model="form.stateProv"
            class="input-card-state"
            :label="$t('label.state')"
            :placeholder="townInformation.stateProv"
            disabled
          />
          <OurInput
            v-model="form.country"
            class="input-card-country"
            :label="$t('label.country')"
            :placeholder="townInformation.country"
            disabled
          />
          <OurInput
            v-model="form.zipCode"
            :label="$t('label.ZIPCode')"
            :placeholder="$t('placeholder.ZIPCode')"
            disabled
          />
        </div>
      </div>
    </OurCard>
    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.back')"
        size="lg"
        @click="onClickBack"
      />

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.addPayment')"
        size="lg"
        @click="onClickAddPayment"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import PaymentRadioButton from "@/views/auth/signUp/components/PaymentRadioButton";
import { required } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";
import { UsaStates } from "usa-states";
import provinces from "provinces-ca";

const {
  creditCardMinLength,
  creditCardMaxLength,
  cvvMinLength,
  cvvMaxLength,
  expirationDateFormat,
  expirationDateYearInFuture,
  isNumeric,
  routingNumberLength,
  accountNumberLength,
} = ValidationService;
const usaStatesArray = new UsaStates().arrayOf("names").map((item) => ({ id: item, label: item }));
const provincesArray = provinces
  .filter((province) => !province.territory)
  .map((item) => ({ id: item.name, label: item.name }));
const PAYMENT_TYPE = { card: "card", bank: "bank" };
const EXPIRATION_DATE_FORMAT = { separatorIndex: 2, separatorCharacter: "/" };

export default {
  name: "AddPaymentMethod",

  components: {
    PaymentRadioButton,
  },

  data() {
    return {
      countryOptions: [
        { id: "usa", label: "USA" },
        { id: "canada", label: "Canada" },
      ],
      accountTypeOptions: [
        { id: "checking", label: "Checking" },
        { id: "businesschecking", label: "Business Checking" },
      ],
      form: {
        paymentType: PAYMENT_TYPE.card,
        cardNumber: "",
        expirationDate: "",
        cvvCode: "",
        nameOnCard: "",
        usedServiceAddress: true,
        makeDefault: true,
        serviceAddress: "",
        serviceAddressBilling: "",
        unitAddress: "",
        unitAddressBilling: "",
        zipCode: "",
        zipCodeBillng: "",
        bankAccountNumber: "",
        bankRoutingNumber: "",
        bankAccountType: "checking",
        stateProv: "",
        stateProvBilling: "",
        country: "",
        countryBilling: "",
        city: "",
        cityBilling: "",
      },
      paymentRadioButtons: [
        {
          title: this.$t("label.creditCard"),
          icons: ["visa.png", "americanExpress.png", "masterCard.png"],
          value: PAYMENT_TYPE.card,
        },
        {
          title: this.$t("label.bankAccount"),
          icons: ["bank.png"],
          value: PAYMENT_TYPE.bank,
        },
      ],
    };
  },

  validations() {
    let validationObj = { form: {} };

    if (this.isCardPaymentType) {
      const currentValidation = {
        form: {
          cardNumber: { required, isNumeric, creditCardMinLength, creditCardMaxLength },
          expirationDate: {
            required,
            expirationDateFormat,
            expirationDateYearInFuture: expirationDateYearInFuture(EXPIRATION_DATE_FORMAT),
          },
          cvvCode: { required, isNumeric, cvvMinLength, cvvMaxLength },
          nameOnCard: { required },
        },
      };

      validationObj.form = { ...validationObj.form, ...currentValidation.form };
    } else {
      const currentValidation = {
        form: {
          bankRoutingNumber: { required, isNumeric, routingNumberLength },
          bankAccountNumber: { required, isNumeric, accountNumberLength },
        },
      };

      validationObj.form = { ...validationObj.form, ...currentValidation.form };
    }

    if (!this.form.usedServiceAddress) {
      const currentValidation = {
        form: {
          serviceAddressBilling: { required },
          zipCodeBilling: { required },
          cityBilling: { required },
          stateProvBilling: { required },
          countryBilling: { required },
        },
      };

      validationObj.form = { ...validationObj.form, ...currentValidation.form };
    }

    return validationObj;
  },

  computed: {
    ...mapState(["auth"]),

    ...mapGetters(["addressService"]),

    serviceAddress() {
      return this.addressService[0] || {};
    },

    stateOptions() {
      return this.form.countryBilling === "usa" ? usaStatesArray : provincesArray;
    },

    townInformation() {
      return {
        stateProv: this.auth.signUpData.stateProv,
        country: this.auth.signUpData.country,
        city: this.auth.signUpData.city,
      };
    },

    stateError() {
      const isDirty = this.$v.form.stateProvBilling.$dirty;
      const isFilled = this.$v.form.stateProvBilling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    countryError() {
      const isDirty = this.$v.form.countryBilling.$dirty;
      const isFilled = this.$v.form.countryBilling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    zipCodeError() {
      const isDirty = this.$v.form.zipCodeBilling.$dirty;
      const isFilled = this.$v.form.zipCodeBilling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    cityError() {
      const isDirty = this.$v.form.cityBilling.$dirty;
      const isFilled = this.$v.form.cityBilling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    serviceAddressError() {
      const isDirty = this.$v.form.serviceAddressBilling.$dirty;
      const isFilled = this.$v.form.serviceAddressBilling.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    bankRoutingNumberError() {
      if (this.isCardPaymentType) return "";
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

    bankAccountNumberError() {
      if (this.isCardPaymentType) return "";
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

    nameOnCardError() {
      if (!this.isCardPaymentType) return "";
      const isDirty = this.$v.form.nameOnCard.$dirty;
      const isFilled = this.$v.form.nameOnCard.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    cvvCodeError() {
      if (!this.isCardPaymentType) return "";
      const isDirty = this.$v.form.cvvCode.$dirty;
      const isFilled = this.$v.form.cvvCode.required;
      const isNumeric = this.$v.form.cvvCode.isNumeric;
      const isMinLength = this.$v.form.cvvCode.cvvMinLength;
      const isMaxLength = this.$v.form.cvvCode.cvvMaxLength;

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

    cardNumberError() {
      if (!this.isCardPaymentType) return "";
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
      if (!this.isCardPaymentType) return "";
      const isDirty = this.$v.form.expirationDate.$dirty;
      const isFilled = this.$v.form.expirationDate.required;
      const isNotDate = this.$v.form.expirationDate.expirationDateFormat;
      const isNotInFuture = this.$v.form.expirationDate.expirationDateYearInFuture;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isNotDate) {
        error = this.$t("validation.dateformat");
      } else if (isDirty && !isNotInFuture) {
        error = this.$t("validation.dateformatFuture");
      }

      return error;
    },

    isCardPaymentType() {
      return this.form.paymentType === PAYMENT_TYPE.card;
    },
  },

  watch: {
    "form.expirationDate"() {
      this.formatExpirationDate();
    },
    "form.countryBilling"() {
      this.form.stateProvBilling = "";
    },
    serviceAddress() {
      this.fillForm();
    },
  },

  created() {
    this.fillForm();
  },

  mounted() {
    this.getAccountInfos();
  },

  methods: {
    ...mapActions(["getAccountInfos"]),

    ...mapActions({
      addPaymentMethod: "billing/addPaymentMethod",
    }),

    formatExpirationDate() {
      if (this.form.expirationDate.includes(EXPIRATION_DATE_FORMAT.separatorCharacter)) return;

      if (this.form.expirationDate.length === EXPIRATION_DATE_FORMAT.separatorIndex) {
        this.form.expirationDate += EXPIRATION_DATE_FORMAT.separatorCharacter;
      } else if (
        this.form.expirationDate.length > EXPIRATION_DATE_FORMAT.separatorIndex &&
        this.form.expirationDate[EXPIRATION_DATE_FORMAT.separatorIndex] !==
          EXPIRATION_DATE_FORMAT.separatorCharacter
      ) {
        this.form.expirationDate =
          this.form.expirationDate.slice(0, EXPIRATION_DATE_FORMAT.separatorIndex) +
          EXPIRATION_DATE_FORMAT.separatorCharacter +
          this.form.expirationDate.slice(EXPIRATION_DATE_FORMAT.separatorIndex);
      }
    },

    fillForm() {
      this.form.serviceAddress = this.serviceAddress.street;
      this.form.unitAddress = this.serviceAddress.premise;
      this.form.city = this.serviceAddress.city;
      this.form.stateProv = this.serviceAddress.stateProv;
      this.form.country = this.serviceAddress.country;
      this.form.zipCode = this.serviceAddress.postalCode;
    },

    onClickBack() {
      this.$emit("paymentCancelled");
    },

    onClickAddPayment() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.sendPaymentDataToAnet();
    },

    sendPaymentDataToAnet() {
      let paymentData = {};

      if (this.isCardPaymentType) {
        const separatedExpirationdate = this.form.expirationDate.split("/");
        const [month, year] = separatedExpirationdate;

        paymentData.cardNumber = this.form.cardNumber;
        paymentData.month = month;
        paymentData.year = year;
        paymentData.cardCode = this.form.cvvCode;
      } else {
        paymentData.accountNumber = this.form.bankAccountNumber;
        paymentData.routingNumber = this.form.bankRoutingNumber;
        paymentData.nameOnAccount = this.form.lastName + this.form.firstName;
        paymentData.accountType = this.form.bankAccountType;
      }

      this.addPaymentMethod({
        paymentData: paymentData,
        makeDefault: this.form.makeDefault,
        type: this.isCardPaymentType ? PAYMENT_TYPE.card : PAYMENT_TYPE.bank,
        callbackSuccess: () => {
          this.$emit("paymentAdded");
        },
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full !important;
  @apply space-y-8;

  &-wrapper {
    @apply flex space-x-6;

    .input-card-country {
      @apply w-96;
    }
    .input-card-state {
      @apply w-[32rem];
    }
  }

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }

  &-block {
    @apply mt-6 space-y-6 !important;
  }

  &-input {
    @apply w-full;
  }

  &-separator {
    @apply border-t border-dashed border-gray-300;
  }
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-4;
  }

  &-logo {
    @apply justify-center;

    &::v-deep {
      .logo {
        @apply w-[14.6875rem];
      }
    }
  }

  &-help {
    &-title {
      @apply text-lg font-normal text-gray-500;
    }

    &-wrapper {
      @apply flex items-center justify-center;
      @apply mb-8;
    }

    &-link {
      @apply pt-px pl-1.5;
    }
  }

  &-wrapper {
    @apply flex justify-between;
    @apply max-w-2xl;
    @apply mx-auto px-6;

    &-button {
      @apply mt-6 w-auto !important;
    }
  }
}

.payment {
  &-wrapper {
    @apply flex space-x-6;

    &-item {
      @apply w-full;
    }
    .input-card-country {
      @apply w-96;
    }
    .input-card-state {
      @apply w-[32rem];
    }
  }

  &-switch-wrapper {
    @apply my-2 flex;

    &-text {
      @apply my-auto ml-4 flex-1;
    }
  }

  &-card-block {
    @apply space-y-6;
  }

  &-address-block {
    @apply space-y-6;
  }

  &-products {
    &-wrapper {
      @apply flex;
    }

    &-separator {
      @apply border-b border-base-deep-red;
      @apply my-4;
    }

    &-title,
    &-number,
    &-price {
      @apply text-base font-medium text-base-dark;
    }

    &-title {
      @apply w-4/5;
    }

    &-number {
      @apply w-[10%] text-center;
    }

    &-price {
      @apply w-[10%] text-right;
    }

    &-list {
      @apply space-y-2;

      &-item {
        @apply flex;
      }

      &-title {
        @apply text-base font-normal text-base-dark;
        @apply w-4/5;
      }

      &-number {
        @apply text-base font-normal text-base-dark;
        @apply w-[10%] text-center;
      }

      &-price {
        @apply text-base font-medium text-base-dark;
        @apply w-[10%] text-right;
      }
    }

    &-sum {
      @apply mt-4 text-right;

      &-title {
        @apply text-2xl font-bold text-base-deep-red;
      }

      &-description {
        @apply text-sm font-normal text-gray-500;
      }
    }
  }
}

.separated-border {
  @apply border-b border-dashed border-gray-300;
}
</style>
