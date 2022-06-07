<template>
  <div class="register">
    <OurLogo class="register-logo" :path="logoPath" />

    <div class="register-title">{{ $t("title.signUp") }}</div>

    <div class="register-help-wrapper">
      <div class="register-help-title">{{ $t("title.help") }}</div>

      <OurLink
        dashed
        router-link
        :route="contactUsRoute"
        class="register-help-link"
        :text="$t('button.contactUs')"
        variant="secondary"
        size="lg"
      />
    </div>

    <OurCard class="card">
      <OurIconStepper class="icon-step" />

      <div class="card-title">{{ $t("page.signUp.choosePaymentMethod") }}</div>

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
            />

            <OurInput
              v-model="form.cvvCode"
              :error="cvvCodeError"
              class="payment-wrapper-item"
              :label="$t('label.cvvCode')"
              :placeholder="$t('placeholder.cvvCode')"
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

          <div class="payment-wrapper-item payment-checkboxes">
            <OurCheckbox
              v-model="form.usedServiceAddress"
              size="lg"
              :label="$t('label.useServiceAddress')"
              disabled
            />

            <OurCheckbox v-model="form.usedAutopay" size="lg" :label="$t('label.autopay')" />
          </div>
        </div>
      </div>

      <div v-else class="payment-wrapper">
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

      <div v-if="!form.usedServiceAddress" class="payment-address-block">
        <div class="separated-border" />

        <div class="card-title">{{ $t("page.signUp.yourBillingAddress") }}</div>

        <OurInput
          v-model="form.serviceAdress"
          :error="serviceAdressError"
          :label="$t('label.serviceAdress')"
        />

        <OurInput
          v-model="form.unitAdress"
          :error="unitAdressError"
          :label="$t('label.unitAdress')"
        />

        <div class="payment-wrapper">
          <OurInput v-model="form.city" :label="$t('label.city')" disabled />
          <OurInput v-model="form.stateProv" :label="$t('label.state')" disabled />
          <OurInput v-model="form.country" :label="$t('label.country')" disabled />
          <OurInput
            v-model="form.zipCode"
            :error="zipCodeError"
            :label="$t('label.ZIPCode')"
            :placeholder="$t('placeholder.ZIPCode')"
          />
        </div>
      </div>

      <div class="separated-border" />

      <div class="card-title">{{ $t("page.signUp.yourSelectedProducts") }}</div>

      <div>
        <div class="payment-products-wrapper">
          <div class="payment-products-title">{{ $t("page.signUp.product") }}</div>
          <div class="payment-products-number">{{ $t("page.signUp.qty") }}</div>
          <div class="payment-products-price">{{ $t("page.signUp.price") }}</div>
        </div>

        <div class="payment-products-separator" />

        <div class="payment-products-list">
          <div v-for="product in products" :key="product.planId" class="payment-products-list-item">
            <div class="payment-products-list-title">{{ product.planName }}</div>
            <div class="payment-products-list-number">{{ product.userAmount }}</div>
            <div class="payment-products-list-price">{{ prepareMoney(product.price) }}</div>
          </div>
        </div>

        <div class="payment-products-sum">
          <div class="payment-products-sum-title">{{ generalSum }}</div>

          <div class="payment-products-sum-description">{{ $t("page.signUp.perMonth") }}</div>
        </div>
      </div>
    </OurCard>

    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.back')"
        size="lg"
        @click="onClickBackToUserInformation"
      />

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.checkOut')"
        size="lg"
        @click="onClickSignUp"
      />
    </div>
  </div>
</template>

<script>
import OurIconStepper from "./components/OurIconStepper";
import PaymentRadioButton from "@/views/auth/signUp/components/PaymentRadioButton";
import { mapState } from "vuex";
import MoneyService from "@/services/money.service";
import { requiredIf } from "vuelidate/lib/validators";
import { layout } from "@/configs/ourApp.config";

const { separatedMoney } = MoneyService;

const CARD_PAYMENT_TYPE = "card";
const BANK_PAYMENT_TYPE = "bank";

export default {
  name: "SignUpPayment",

  components: {
    PaymentRadioButton,
    OurIconStepper,
  },

  data() {
    return {
      products: [],
      form: {
        paymentType: CARD_PAYMENT_TYPE,
        cardNumber: "",
        expirationDate: "",
        cvvCode: "",
        nameOnCard: "",
        usedServiceAddress: true,
        usedAutopay: true,
        serviceAdress: "",
        unitAdress: "",
        zipCode: "",
        bankAccountNumber: "",
        bankRoutingNumber: "",
        stateProv: "",
        country: "",
        city: "",
      },
      paymentRadioButtons: [
        {
          title: this.$t("label.creditCard"),
          icons: ["visa.png", "americanExpress.png", "masterCard.png"],
          value: CARD_PAYMENT_TYPE,
        },
        {
          title: this.$t("label.bankAccount"),
          icons: ["bank.png"],
          value: BANK_PAYMENT_TYPE,
        },
      ],
    };
  },

  validations: {
    form: {
      cardNumber: {
        required: requiredIf(function () {
          return this.isCardPaymentType;
        }),
      },
      expirationDate: {
        required: requiredIf(function () {
          return this.isCardPaymentType;
        }),
      },
      cvvCode: {
        required: requiredIf(function () {
          return this.isCardPaymentType;
        }),
      },
      nameOnCard: {
        required: requiredIf(function () {
          return this.isCardPaymentType;
        }),
      },
      bankAccountNumber: {
        required: requiredIf(function () {
          return !this.isCardPaymentType;
        }),
      },
      bankRoutingNumber: {
        required: !requiredIf(function () {
          return this.isCardPaymentType;
        }),
      },
      serviceAdress: {
        required: requiredIf(function () {
          return !this.form.usedServiceAddress;
        }),
      },
      unitAdress: {
        required: requiredIf(function () {
          return !this.form.usedServiceAddress;
        }),
      },
      zipCode: {
        required: requiredIf(function () {
          return !this.form.usedServiceAddress;
        }),
      },
    },
  },

  computed: {
    ...mapState(["auth"]),

    unitAdressError() {
      const isDirty = this.$v.form.unitAdress.$dirty;
      const isFilled = this.$v.form.unitAdress.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    zipCodeError() {
      const isDirty = this.$v.form.zipCode.$dirty;
      const isFilled = this.$v.form.zipCode.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    serviceAdressError() {
      const isDirty = this.$v.form.serviceAdress.$dirty;
      const isFilled = this.$v.form.serviceAdress.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    bankRoutingNumberError() {
      const isDirty = this.$v.form.bankRoutingNumber.$dirty;
      const isFilled = this.$v.form.bankRoutingNumber.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    bankAccountNumberError() {
      const isDirty = this.$v.form.bankAccountNumber.$dirty;
      const isFilled = this.$v.form.bankAccountNumber.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    nameOnCardError() {
      const isDirty = this.$v.form.nameOnCard.$dirty;
      const isFilled = this.$v.form.nameOnCard.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    cvvCodeError() {
      const isDirty = this.$v.form.cvvCode.$dirty;
      const isFilled = this.$v.form.cvvCode.required;

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

    expirationDateError() {
      const isDirty = this.$v.form.expirationDate.$dirty;
      const isFilled = this.$v.form.expirationDate.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    isCardPaymentType() {
      return this.form.paymentType === CARD_PAYMENT_TYPE;
    },

    generalSum() {
      let sum = 0;

      this.products.forEach((item) => {
        if (item.userAmount) {
          sum += item.price * item.userAmount;
        } else {
          sum += item.price;
        }
      });

      return this.prepareMoney(sum);
    },

    logoPath() {
      return layout.auth.logoPath;
    },

    contactUsRoute() {
      return { name: "ContactUs" };
    },
  },

  watch: {
    "form.paymentType": "onChangePaymentType",
  },

  created() {
    this.prefillForm();
  },

  methods: {
    prefillForm() {
      this.form.stateProv = this.auth.signUpData?.stateProv || "";
      this.form.country = this.auth.signUpData?.country || "";
      this.form.city = this.auth.signUpData?.city || "";

      this.products = [...(this.auth.signUpData.products || [])];
    },

    onChangePaymentType() {
      this.form.usedServiceAddress = true;
      this.form.usedAutopay = true;
    },

    prepareMoney(money) {
      const price = separatedMoney(Number(money));

      return `$${price.integer}.${price.penny}`;
    },

    onClickBackToUserInformation() {
      this.$router.push({ name: "SignUpUserInformation" });
    },

    onClickSignUp() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.$router.push({ name: "SignUpSuccess" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full max-w-2xl !important;
  @apply space-y-8;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-8;
  }

  &-logo {
    @apply mb-4 justify-center;

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
  }

  &-card-block {
    @apply space-y-6;
  }

  &-checkboxes {
    @apply space-y-2;
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
