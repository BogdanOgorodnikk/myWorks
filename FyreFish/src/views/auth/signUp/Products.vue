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

      <div class="card-title">{{ $t("page.signUp.selectProducts") }}</div>

      <div class="products">
        <Product
          v-for="product in products"
          :key="product.id"
          v-model="selectedProducts"
          :product="product"
        />
      </div>
    </OurCard>

    <div class="register-wrapper">
      <OurButton
        class="register-wrapper-button"
        variant="secondary"
        :text="$t('button.back')"
        size="lg"
        @click="onClickBackToSignUp"
      />

      <OurButton
        class="register-wrapper-button"
        :text="$t('button.next')"
        :disabled="!selectedProducts.length"
        size="lg"
        @click="onClickNextStep"
      />
    </div>
  </div>
</template>

<script>
import OurIconStepper from "./components/OurIconStepper";
import Product from "./components/Product";
import { mapMutations, mapState, mapActions } from "vuex";
import { layout } from "@/configs/ourApp.config";

export default {
  name: "SignUpProducts",

  components: {
    Product,
    OurIconStepper,
  },

  data() {
    return {
      selectedProducts: [],
    };
  },

  computed: {
    ...mapState(["auth"]),
    ...mapState("product", ["products"]),

    logoPath() {
      return layout.auth.logoPath;
    },

    contactUsRoute() {
      return { name: "ContactUs" };
    },
  },

  async created() {
    this.selectedProducts = this.auth.signUpData?.products || [];

    await this.getPublicProducts(this.auth.signUpData.id);
  },

  methods: {
    ...mapMutations(["SET_SIGN_UP_DATA"]),

    ...mapActions("product", ["getPublicProducts"]),

    onClickNextStep() {
      const signUpData = {
        ...this.auth.signUpData,
        products: this.selectedProducts,
      };

      this.SET_SIGN_UP_DATA(signUpData);

      this.$router.push({ name: "SignUpUserInformation" });
    },

    onClickBackToSignUp() {
      this.$router.push({ name: "SignUpBuildings" });
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

.products {
  @apply mt-6 space-y-6 !important;
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-8;
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
</style>
