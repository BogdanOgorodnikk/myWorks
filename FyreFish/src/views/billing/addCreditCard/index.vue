<template>
  <OurPage>
    <div class="head-wrapper">
      <OurCard class="head-card-info">
        <div class="head-card-info-left">
          <div class="head-card-info-title">
            <span class="head-card-info-title-bold">{{ $t("title.accountNumber") }}</span
            >&nbsp;:
            <span class="head-card-info-title-bold">{{ accountNumber }}</span>
          </div>
          <div class="head-card-info-title">999 Main Ave</div>
        </div>
        <div class="head-card-info-right">
          <div class="head-card-info-right-button">Current</div>
        </div>
      </OurCard>
    </div>
    <AddCreditCard v-if="!paymentAdded" class="add-credit-card" @paymentAdded="onPaymentAdded">
    </AddCreditCard>
    <div v-else class="confirmation-text">{{ $t("title.confirmationPaymentAdded") }}</div>
  </OurPage>
</template>

<script>
import AddCreditCard from "../index/components/AddCreditCard";
import { mapState } from "vuex";

export default {
  components: {
    AddCreditCard,
  },

  data: () => ({
    paymentAdded: false,
  }),

  computed: {
    ...mapState(["accountNumber"]),
  },

  methods: {
    onPaymentAdded() {
      this.paymentAdded = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.head {
  &-wrapper {
    @apply flex justify-between;
  }

  &-card-info {
    @apply flex justify-between;

    &-right {
      @apply m-0 !important;

      &-button {
        @apply rounded-2xl bg-blue-100 py-2 px-4 text-xs font-semibold text-blue-800;
      }
    }

    &-title {
      @apply mt-1 text-base text-base font-normal text-gray-500;

      &-bold {
        @apply text-lg font-bold text-base-dark;
      }
    }
  }
}
.add-credit-card {
  @apply mt-4;
}
.confirmation-text {
  @apply mt-4 text-center text-base font-bold text-gray-500;
}
</style>
