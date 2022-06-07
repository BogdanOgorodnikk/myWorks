<template>
  <div>
    <OurPageModal
      v-model="isModalAddPaymentVisible"
      :title="$t('title.addPaymentMethod')"
      width="xl"
      @closed="onCloseModal"
    >
      <AddPaymentMethod @paymentAdded="onPaymentAdded" @paymentCancelled="onPaymentCancelled" />
    </OurPageModal>

    <OurPage>
      <AccountStatus />
      <OurCard>
        <div class="payment-balance">
          <div class="payment-balance-owed">
            <div class="payment-balance-owed-title">{{ $t("page.bill.balanceOwed") }}</div>
            <div class="payment-balance-owed-number">{{ total }}</div>
            <router-link
              :to="{ name: 'Invoice' }"
              class="payment-balance-owed-link"
              target="_blank"
            >
              {{ $t("page.bill.viewInvoice") }}
            </router-link>
          </div>
          <div class="payment-balance-input">
            <OurInput
              v-model="form.paymentAmount"
              :error="paymentAmountError"
              :label="$t('label.paymentAmount')"
              :placeholder="total"
            />
          </div>
        </div>

        <div class="payment-items-title">
          {{ $t("page.signUp.choosePaymentMethod") }}
        </div>

        <PaymentMethod
          v-for="(option, index) in paymentMethodOptions"
          :key="index"
          v-model="form.paymentMethod"
          :option="option"
          @input="onPaymentSelected"
        />

        <div class="payment-add" @click="showAddPaymentModal">
          <OurSvgIcon class="icon" folder="Navigation" name="Plus2" size="lg" />

          <div class="payment-add-wrapper">
            <div class="payment-add-title">{{ $t("button.addPaymentMethod") }}</div>

            <div class="payment-add-label">{{ $t("button.addPaymentMethodDescription") }}</div>
          </div>
        </div>

        <div class="payment-buttons">
          <OurButton variant="secondary" :text="$t('button.back')" @click="$router.go(-1)" />

          <OurButton
            variant="primary"
            :text="$t('button.makePayment')"
            :disabled="!isPaymentSelected"
            @click="onClickSubmitPayment"
          />
        </div>
      </OurCard>
    </OurPage>
  </div>
</template>

<script>
import PaymentMethod from "../index/components/PaymentMethod";
import AddPaymentMethod from "../index/components/AddPaymentMethod";
import AccountStatus from "../index/components/AccountStatus";
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import ValidationService from "@/services/validate.service";

const { currencyFormat } = ValidationService;

export default {
  components: {
    PaymentMethod,
    AddPaymentMethod,
    AccountStatus,
  },
  data() {
    return {
      isPaymentSelected: false,
      isModalAddPaymentVisible: false,
      form: {
        paymentAmount: "",
        paymentMethod: {},
      },
      paymentMethodOptions: [
        {
          label: this.$t("label.masterCard"),
          cardNumber: "**** **** **** 8193",
          cardIcon: "masterCard.png",
        },
        {
          label: this.$t("label.visa"),
          cardNumber: "**** **** **** 8986",
          cardIcon: "visa.png",
        },
      ],
      paymentItems: [
        {
          product: "Red Bison Internet",
          change: "-1",
          price: "0.00",
        },
        {
          product: "Telecomputer",
          change: "+1",
          price: "60.00",
        },
      ],
      account: {
        address: "999 Main Ave",
        status: "Current",
      },
    };
  },

  validations() {
    return {
      form: {
        paymentAmount: { required, currencyFormat },
      },
    };
  },

  computed: {
    ...mapGetters(["userLogin", "accountNumber", "accountStatus", "addressService"]),

    total() {
      let accumulator = 0;
      let total = this.paymentItems.reduce(
        (partialTotal, item) => partialTotal + parseInt(item.price),
        accumulator
      );

      return this.formatMoney(total);
    },

    paymentAmountError() {
      const isDirty = this.$v.form.paymentAmount.$dirty;
      const isFilled = this.$v.form.paymentAmount.required;
      const isCurrency = this.$v.form.paymentAmount.currencyFormat;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isCurrency) {
        error = this.$t("validation.paymentAmount");
      }

      return error;
    },
  },

  mounted() {
    this.getAccountInfos();
  },

  methods: {
    ...mapActions(["getAccountInfos"]),

    formatMoney(number) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);
    },

    onClickSubmitPayment() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.$router.push({ name: "SubmitPayment" });
    },

    onPaymentSelected() {
      this.isPaymentSelected = true;
    },

    showAddPaymentModal() {
      this.isModalAddPaymentVisible = true;
    },

    onCloseModal() {
      this.isModalAddPaymentVisible = false;
    },

    onPaymentAdded() {
      this.onCloseModal();
    },

    onPaymentCancelled() {
      this.onCloseModal();
    },
  },
};
</script>

<style lang="postcss" scoped>
.payment {
  &-title {
    @apply text-4xl font-medium text-base-dark;
    @apply mb-11;
  }

  &-balance {
    @apply flex justify-between;

    &-owed {
      &-title {
        @apply text-lg font-bold text-base-deep-red;
      }
      &-number {
        @apply text-3xl font-bold;
        @apply pt-2;
      }
      &-link {
        @apply text-base font-normal text-base-deep-red underline;
      }
    }
  }

  &-buttons {
    @apply flex justify-between;
  }

  &-add {
    @apply flex cursor-pointer pl-1.5;

    &-wrapper {
      @apply pl-2;
    }

    &-title {
      @apply text-lg font-medium text-base-dark;
    }

    &-label {
      @apply text-xs font-normal text-gray-500;
    }
  }

  &-items {
    @apply w-max space-y-2;

    &-title {
      @apply text-2lg font-bold text-base-dark;
    }
  }
}
</style>
