<template>
  <div class="product" :class="signedProductClass">
    <div class="left-border" />

    <OurCard class="product-block">
      <div class="product-wrapper">
        <div>
          <div class="product-title">{{ product.name }}</div>

          <div class="product-description">{{ product.planId }}</div>
        </div>

        <div v-if="product.displaySubscribed" class="product-subscription">
          <OurSwitch v-model="form.isSubscribed" with-text size="lg" variant="green" />
        </div>
      </div>

      <div class="product-price-wrapper">
        <div class="product-price-title">{{ generalPrice }}</div>

        <div v-if="product.quantityBased" class="product-price-user">
          <div class="product-price-user-title">{{ $t("page.signUp.pricePerUser") }}</div>
          <div class="product-price-user-sum">{{ monthlyCost }}</div>
        </div>

        <div v-if="product.isDisabled" class="product-price-user">
          <div class="product-price-user-title">{{ $t("page.product.numberOfUsers") }}</div>
          <div class="product-price-user-amount">{{ form.quantity }}</div>
        </div>
        <OurInput
          v-if="product.quantityBased && !product.isDisabled"
          v-model="form.quantity"
          validation-rule="number"
          :label="$t('label.numberOfUsers')"
          class="product-price-input"
          max-length="5"
          @change="onChangequantity"
        />
      </div>

      <div class="product-footer">
        <OurButton
          variant="link"
          :text="$t('button.termsAndConditions')"
          class="product-footer-terms"
        />
        <div
          v-if="form.isSubscribed && product.displaySubscribed"
          class="product-footer-subscription-title"
        >
          {{ $t("title.subscribed") }}
        </div>
      </div>
    </OurCard>

    <div class="right-border" />
  </div>
</template>

<script>
import MoneyService from "@/services/money.service";

const { separatedMoney } = MoneyService;

const MIN_USER_AMOUNT = 1;

export default {
  props: {
    product: {
      type: Object,
      default: () => {},
    },

    value: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    form: {
      isSubscribed: false,
      quantity: "1",
    },
  }),

  computed: {
    signedProductClass() {
      return {
        "product-signed": this.form.isSubscribed,
      };
    },

    generalPrice() {
      const quantity = this.form.quantity < MIN_USER_AMOUNT ? MIN_USER_AMOUNT : this.form.quantity;

      const price = this.product?.price * Math.trunc(quantity);

      const separatePrice = separatedMoney(price);

      return `$${separatePrice.integer}.${separatePrice.penny}`;
    },

    monthlyCost() {
      const price = separatedMoney(Number(this.product.price));

      return `$${price.integer}.${price.penny}`;
    },
  },

  watch: {
    "form.isSubscribed": "emitValue",
    "product.isSubscribed": "updateLocalForm",
  },

  created() {
    this.updateLocalForm();
  },

  methods: {
    updateLocalForm() {
      this.form.quantity =
        this.product.quantity < MIN_USER_AMOUNT ? MIN_USER_AMOUNT : this.product.quantity;

      if (this.product.quantity) {
        this.form.quantity = this.product.quantity;
      }

      if (this.product.isSubscribed) {
        this.form.isSubscribed = this.product.isSubscribed;
      }
    },

    onChangequantity() {
      if (this.form.quantity < MIN_USER_AMOUNT) {
        this.form.quantity = MIN_USER_AMOUNT;
      }

      this.form.quantity = Math.trunc(this.form.quantity);
      this.emitValue();
    },

    emitValue() {
      this.$emit("input", Object.assign(this.product, this.form));
    },
  },
};
</script>

<style lang="postcss" scoped>
.product {
  @apply relative;

  &-block {
    @apply border border-gray-200 bg-gray-50;
    @apply mx-1 !p-4;
    @apply relative z-20;
  }

  &-wrapper {
    @apply flex justify-between;
  }

  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-description {
    @apply text-base font-normal text-gray-500;
    @apply mt-1.5;
  }

  &-subscription {
    @apply flex flex-col items-end;
  }

  &-price {
    &-wrapper {
      @apply flex items-center;
      @apply !mt-4;
    }

    &-title {
      @apply text-2xl font-bold text-base-deep-red;
      @apply pr-6;
    }

    &-user {
      @apply border-l border-gray-300;
      @apply pl-6 pr-6;

      &-title {
        @apply text-sm font-normal text-gray-500;
        @apply mb-1;
      }

      &-sum {
        @apply text-base font-medium text-base-deep-red;
      }

      &-amount {
        @apply text-base font-medium;
      }
    }

    &-input {
      @apply ml-6 w-[8.5rem];
    }

    &-text {
      @apply border-l border-gray-300;
      @apply pl-6;
    }
  }

  &-footer {
    @apply flex justify-between;

    &-subscription {
      @apply flex flex-col items-end;

      &-title {
        @apply text-lg font-medium text-base-dark;
        @apply mb-1;
      }
    }

    &-terms {
      @apply !mt-2.5;
    }
  }

  &-signed {
    .left-border {
      @apply absolute top-0 left-0;
      @apply z-10 h-full w-4;
      @apply rounded-l-2xl bg-base-deep-red;
    }

    .right-border {
      @apply absolute top-0 -right-2;
      @apply z-10 h-full w-4;
      @apply rounded-r-2xl bg-base-deep-red;
    }
  }
}
</style>
