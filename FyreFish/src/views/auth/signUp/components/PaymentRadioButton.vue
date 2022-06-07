<template>
  <div class="payment-block">
    <label class="payment-radio" :class="selectedRadioButtonClass">
      <div class="left-border" />
      <div class="payment-radio-block">
        <div>
          <div class="payment-radio-title">{{ option.title }}</div>

          <div class="payment-radio-wrapper">
            <img
              v-for="(icon, index) in option.icons"
              :key="index"
              alt="credit-card"
              :src="cardIconSrc(icon)"
              class="icon"
            />
          </div>
        </div>

        <t-radio
          v-model="selectedPaymentType"
          class="payment-radio-button"
          name="payment-type"
          :value="option.value"
        />
      </div>
      <div class="right-border" />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => {},
    },

    value: {
      type: String,
      default: "",
    },
  },

  computed: {
    selectedPaymentType: {
      get() {
        return this.value;
      },

      set(paymentType) {
        this.$emit("input", paymentType);
      },
    },

    selectedRadioButtonClass() {
      return this.value === this.option.value ? "payment-radio-selected" : "";
    },
  },

  methods: {
    cardIconSrc(icon) {
      return require(`@/assets/images/paymentIcon/${icon}`);
    },
  },
};
</script>

<style lang="postcss" scoped>
.left-border {
  @apply absolute z-30;
  @apply rounded-l-lg bg-accent;
  @apply h-full w-0;
  @apply left-0;
}
.right-border {
  @apply absolute right-0 top-0 z-20;
  @apply rounded-r-lg bg-accent;
  @apply h-full w-0;
}
.payment-block {
  @apply relative;
}
.payment-radio {
  @apply flex;

  &-block {
    @apply flex w-full items-center justify-between;
    @apply py-4 pl-4 pr-6;
    @apply rounded-lg border border-gray-300 bg-white;
    @apply cursor-pointer;
    @apply relative z-40;
  }

  &-title {
    @apply text-base font-medium text-base-dark;
    @apply pb-2;
  }

  &-wrapper {
    @apply flex space-x-2;
  }

  &-button {
    @apply border border-solid border-gray-300;
    @apply h-6 w-6;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-base-deep-red ring-4 ring-red-200;
    }

    &:active {
      @apply border-base-deep-red bg-base-deep-red;
    }

    &:checked {
      @apply border-base-deep-red bg-base-deep-red;
    }
  }
}

.payment-radio-selected {
  @apply border-base-deep-red;

  .payment-radio-block {
    @apply mx-1 !p-4;
  }

  .right-border,
  .left-border {
    @apply w-3.5;
  }
}

.icon {
  @apply h-4 rounded-sm;
}
</style>
