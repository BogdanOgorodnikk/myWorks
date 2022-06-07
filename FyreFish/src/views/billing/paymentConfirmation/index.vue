<template>
  <OurPage>
    <AccountStatus />
    <OurCard>
      <div class="payment-title">
        {{ $t("title.makePayment") }}
      </div>

      <div class="payment-balance">
        <div class="payment-balance-description">{{ $t("page.bill.paymentAmount") }}</div>
        <div class="payment-balance-number">{{ total }}</div>
      </div>

      <div class="payment-balance">
        <div class="payment-balance-description">{{ $t("page.bill.accountBalance") }}</div>
        <div class="payment-balance-number">{{ balance }}</div>
      </div>
    </OurCard>

    <div class="payment-text">
      {{ $t("page.bill.paymentConfirmation") }}
    </div>
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
        balance: "0.00",
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

    balance() {
      return this.formatMoney(this.account.balance);
    },
  },

  methods: {
    formatMoney(number) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);
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
    @apply mt-2 !important;

    &-description {
      @apply pt-1 text-gray-500;
    }

    &-number {
      @apply text-3xl font-bold;
    }
  }

  &-buttons {
    @apply flex justify-between;
  }

  &-text {
    @apply mt-4 text-center text-gray-500;
  }
}
</style>
