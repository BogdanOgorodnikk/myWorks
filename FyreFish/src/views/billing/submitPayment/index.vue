<template>
  <OurPage>
    <AccountStatus />
    <OurCard>
      <div class="payment-title">
        {{ $t("title.makePayment") }}
      </div>

      <div class="payment-balance">
        <div class="payment-balance-method">
          {{ paymentMethod.name }}: {{ paymentMethod.cardNumber }}
        </div>
        <div class="payment-balance-number">{{ total }}</div>
      </div>

      <div class="payment-buttons">
        <OurButton variant="secondary" :text="$t('button.back')" @click="$router.go(-1)" />

        <OurButton
          variant="primary"
          :text="$t('button.payNow')"
          @click="onClickPaymentConfirmation"
        />
      </div>
    </OurCard>
  </OurPage>
</template>

<script>
import AccountStatus from "../index/components/AccountStatus";

export default {
  components: {
    AccountStatus,
  },

  data() {
    return {
      paymentMethod: {
        name: "Visa",
        label: this.$t("label.visa"),
        cardNumber: "**** **** **** 8986",
        cardIcon: "visa.png",
      },
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

  computed: {
    total() {
      let accumulator = 0;
      let total = this.paymentItems.reduce(
        (partialTotal, item) => partialTotal + parseInt(item.price),
        accumulator
      );

      return this.formatMoney(total);
    },
  },

  methods: {
    formatMoney(number) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);
    },

    onClickPaymentConfirmation() {
      this.$router.push({ name: "PaymentConfirmation" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.payment {
  &-title {
    @apply text-2lg font-bold text-base-dark;
  }

  &-balance {
    @apply flex justify-between;

    &-method {
      @apply text-gray-500;
    }

    &-number {
      @apply text-3xl font-bold;
    }
  }

  &-buttons {
    @apply flex justify-between;
  }
}
</style>
