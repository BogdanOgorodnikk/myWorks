<template>
  <div class="payment-block">
    <label class="payment-wrapper" :class="selectedRadioButtonClass">
      <div class="payment-wrapper-item">
        <t-radio
          v-model="selectedPaymentMethod"
          class="payment-radio"
          name="payment-method-radio"
          :value="option"
        />

        <img alt="credit-card" :src="cardIconPath" class="payment-card-icon" />
      </div>

      <div>
        <div class="payment-card-number">{{ option.cardNumber }}</div>

        <div class="payment-card-name">{{ option.label }}</div>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    option: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    selectedPaymentMethod: {
      get() {
        return this.value;
      },

      set(paymentMethod) {
        this.$emit("input", paymentMethod);
      },
    },

    selectedRadioButtonClass() {
      return this.value === this.option ? "payment-selected" : "";
    },

    cardIconPath() {
      return require(`@/assets/images/paymentIcon/${this.option.cardIcon}`);
    },
  },
};
</script>

<style lang="postcss" scoped>
.payment {
  &-block {
    @apply space-y-4;
  }

  &-wrapper {
    @apply flex justify-between;
    @apply cursor-pointer p-2;

    &-item {
      @apply flex items-center;
    }
  }

  &-selected {
    @apply rounded-lg border-l-4 border-r-4 border-base-deep-red;
  }

  &-radio {
    @apply border border-solid border-gray-300;
    @apply h-6 w-6;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-base-deep-red ring-4 ring-red-200;
    }

    &:checked {
      @apply border-base-deep-red bg-base-deep-red;
    }
  }

  &-card {
    &-icon {
      @apply h-6 w-12 rounded-sm;
      @apply pl-4;
    }

    &-number {
      @apply text-base font-medium text-gray-400;
    }

    &-name {
      @apply text-right text-xs font-normal text-gray-500;
      @apply pt-1;
    }
  }
}
</style>
