<template>
  <div class="product" :class="selectedProductClass">
    <div class="product-wrapper">
      <div>
        <div class="product-title">{{ product.planName }}</div>

        <div class="product-description">{{ product.planId }}</div>
      </div>

      <OurCheckbox v-model="form.isSelectedProduct" size="lg" />
    </div>

    <div class="product-price">
      <div class="product-price-general">{{ generalPrice }}</div>

      <div v-if="product.quantityBased" class="product-price-user">
        <div class="product-price-user-title">{{ $t("page.signUp.pricePerUser") }}</div>

        <div class="product-price-user-amount">{{ monthlyCost }}</div>
      </div>

      <OurInput
        v-if="product.quantityBased"
        v-model="form.userAmount"
        validation-rule="number"
        :label="$t('label.numberOfUsers')"
        class="product-users-input"
        max-length="5"
        @change="onChangeUserAmount"
      />
    </div>

    <div class="product-terms">{{ $t("page.signUp.termsAndConditions") }}</div>
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
      isSelectedProduct: false,
      userAmount: "1",
    },
  }),

  computed: {
    generalPrice() {
      let userAmount = this.form.userAmount;

      if (userAmount < MIN_USER_AMOUNT) {
        userAmount = MIN_USER_AMOUNT;
      }

      const price = this.product?.price * Math.trunc(userAmount);

      const separatePrice = separatedMoney(price);

      return `$${separatePrice.integer}.${separatePrice.penny}`;
    },

    monthlyCost() {
      const price = separatedMoney(Number(this.product.price));

      return `$${price.integer}.${price.penny}`;
    },

    selectedProductClass() {
      return this.form.isSelectedProduct ? "product-selected" : "";
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  created() {
    this.checkIfIsSelectedProduct();
  },

  methods: {
    onChangeUserAmount() {
      if (this.form.userAmount < MIN_USER_AMOUNT) {
        this.form.userAmount = MIN_USER_AMOUNT;
      }

      this.form.userAmount = Math.trunc(this.form.userAmount);
    },

    checkIfIsSelectedProduct() {
      const selectedProduct = this.value.find((item) => item.planId === this.product.planId);

      this.form.isSelectedProduct = !!selectedProduct?.planId;
      this.form.userAmount = selectedProduct?.userAmount || "1";
    },

    onChangeForm() {
      let products = [];

      if (this.form.isSelectedProduct) {
        const currentProduct = {
          planId: this.product.planId,
          planName: this.product.planName,
          price: this.product.price,
          userAmount: this.form.userAmount,
        };

        const otherProducts = this.value.filter((item) => item.planId !== currentProduct.planId);

        products = [...otherProducts, currentProduct];
      } else {
        products = this.value.filter((item) => item.planId !== this.product.planId);
      }

      this.$emit("input", products);
    },
  },
};
</script>

<style lang="postcss" scoped>
.product {
  @apply rounded-lg border border-gray-200 bg-gray-50;
  @apply p-4;

  &-selected {
    @apply border-base-deep-red;
  }

  &-wrapper {
    @apply flex items-start justify-between;
  }

  &-title {
    @apply text-lg font-medium text-base-deep-red;
    @apply mb-1.5;
  }

  &-description {
    @apply text-base font-normal text-gray-500;
  }

  &-price {
    @apply flex items-center;
    @apply mt-4 space-x-6;

    &-general {
      @apply text-2xl font-bold text-base-deep-red;
    }

    &-user {
      @apply border-l border-gray-300;
      @apply py-1 pl-6;

      &-title {
        @apply text-sm font-normal text-gray-500;
        @apply mb-1;
      }

      &-amount {
        @apply text-base font-medium text-base-deep-red;
      }
    }
  }

  &-users-input {
    @apply w-[8.5rem];
  }

  &-terms {
    @apply inline-block;
    @apply text-sm font-normal text-gray-500;
    @apply border-b border-dashed border-gray-500;
    @apply mt-2.5 cursor-pointer;
  }
}
</style>
