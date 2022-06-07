<template>
  <div>
    <OurPageModal v-model="isConfirmModalVisible" width="xs" @closed="closeConfirmModal">
      <OurCard>
        <div class="modal-confirm-title">
          {{ $t("title.changeApplied") }}
        </div>
        <div class="modal-confirm-text">
          Thank you! An email containing your package and instructions on how to use your services
          has been sent to you inbox.
        </div>
        <div>
          <OurButton
            class="modal-confirm-button"
            data-cy="accept-button"
            :text="$t('button.close')"
            @click="closeConfirmModal"
          />
        </div>
      </OurCard>
    </OurPageModal>

    <OurConfirmModal
      v-model="isModalVisible"
      class="modal-confirm-delete"
      width="xl"
      :title="$t('title.saveChanges') + '?'"
      :action-button-text="$t('button.saveChanges')"
      footer-reverse
      @actionConfirmed="acceptModal"
      @closed="closeModal"
    >
      <div class="sure-to-delete">
        <div class="shop-card-table">
          <div class="shop-card-table-head">
            <div class="shop-card-table-head-label shop-card-table-head-label-name">Product</div>
            <div class="shop-card-table-head-label shop-card-table-head-label-change">Change</div>
            <div class="shop-card-table-head-label shop-card-table-head-label-price">Price</div>
          </div>

          <div class="shop-card-table-line" />

          <div class="shop-card-table-body">
            <div
              v-for="(product, index) in products"
              :key="index"
              class="shop-card-table-body-block"
            >
              <div v-if="getChange(product)" class="shop-card-table-body-wrapper">
                <div class="shop-card-table-body-name">{{ product.name }}</div>

                <div class="shop-card-table-body-change">{{ getChange(product).quantity }}</div>

                <div class="shop-card-table-body-price">
                  {{ formatPrice(getChange(product).price) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OurConfirmModal>
    <img
      v-if="isPropertyManager"
      src="@/assets/images/page/shop-pm.jpeg"
      style="min-width: 1400px"
      alt="services"
    />

    <OurPage v-else width="wide">
      <PageTitle />

      <div class="shop-wrapper">
        <div class="shop-wrapper-item">
          <OurCard class="product-place">
            <div class="product-place-wrapper">
              <div class="product-place-image" />

              <div>
                <div class="product-place-title">Fake Commercial Plaza</div>
                <div class="product-place-description">100 W Walnut St Pasadena CA 91103</div>
              </div>
            </div>
          </OurCard>

          <OurCard class="product-list">
            <div class="product-list-title">{{ $t("page.shop.selectProducts") }}</div>

            <Product v-for="(product, index) in products" :key="index" :product="product" />

            <div v-if="false" class="view-more">{{ $t("button.viewMore") }}</div>
          </OurCard>
        </div>
        <div>
          <OurCard class="shop-card">
            <div class="shop-card-title">{{ $t("title.servicesChanged") }}</div>
            <div class="shop-card-table">
              <div class="shop-card-table-head">
                <div class="shop-card-table-head-label shop-card-table-head-label-name">
                  Product
                </div>
                <div class="shop-card-table-head-label shop-card-table-head-label-change">
                  Change
                </div>
                <div class="shop-card-table-head-label shop-card-table-head-label-price">Price</div>
              </div>

              <div class="shop-card-table-line" />

              <div class="shop-card-table-body">
                <div
                  v-for="(product, index) in products"
                  :key="index"
                  class="shop-card-table-body-block"
                >
                  <div v-if="getChange(product)" class="shop-card-table-body-wrapper">
                    <div class="shop-card-table-body-name">{{ product.name }}</div>

                    <div class="shop-card-table-body-change">{{ getChange(product).quantity }}</div>

                    <div class="shop-card-table-body-price">
                      {{ formatPrice(getChange(product).price) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="shop-card-buttons">
              <OurButton
                class="card-bill-button"
                variant="secondary"
                :text="$t('button.discardChanges')"
                @click="discardChanges"
              />
              <OurButton
                class="card-bill-button"
                variant="primary"
                :text="$t('button.saveChanges')"
                :disabled="isButtonActivated"
                @click="saveChanges"
              />
            </div>
          </OurCard>
          <OurCard class="promotions-card">
            <div class="promotions-card-title">{{ $t("title.promotions") }}</div>

            <div class="promotions-card-description">
              {{ $t("description.noActivePromotions") }}
            </div>
          </OurCard>
        </div>
      </div>
    </OurPage>
  </div>
</template>

<script>
import Product from "./components/Product";
import { mapGetters } from "vuex";
import PageTitle from "@/components/PageTitle";

export default {
  components: {
    Product,
    PageTitle,
  },

  data() {
    return {
      isModalVisible: false,
      isConfirmModalVisible: false,
      products: [
        {
          name: "Business Internet - 50 Mbps",
          planId: "Basic internet service at 50 Mbps",
          price: "0.00",
          quantityBased: false,
          initIsSubscribed: false,
          isSubscribed: false,
        },
        {
          name: "Business Internet - 250 Mbps",
          planId: "Upgraded internet service at 250 Mbps",
          price: "180.00",
          quantityBased: false,
          initIsSubscribed: true,
          isSubscribed: true,
          displaySubscribed: true,
        },
        {
          name: "Standard Business Voice",
          planId: "Standard voice line with phone",
          price: "30.00",
          quantityBased: true,
          initQuantity: 3,
          quantity: 3,
          initIsSubscribed: true,
          isSubscribed: true,
          displaySubscribed: true,
        },
        {
          name: "Executive Business Voice",
          planId: "Executive voice line with phone",
          price: "45.00",
          quantityBased: true,
          initQuantity: 1,
          quantity: 1,
          initIsSubscribed: true,
          isSubscribed: true,
        },
        {
          name: "Administrator Business Voice",
          planId: "Administrator voice line with phone",
          price: "70.00",
          quantityBased: true,
          initQuantity: 1,
          quantity: 1,
          initIsSubscribed: true,
          isSubscribed: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["isPropertyManager"]),
    isButtonActivated() {
      for (let index = 0; index < this.products.length; index++) {
        if (this.getChange(this.products[index])) {
          return false;
        }
      }

      return true;
    },
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");

      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    getChange(product) {
      let quantity = product.initQuantity || 1;
      let price = product.price * quantity;

      if (product.isSubscribed && product.initQuantity > product.quantity) {
        quantity = product.initQuantity - product.quantity;
        price = product.price * quantity;

        return { quantity: -quantity, price: -price };
      } else if (product.isSubscribed && product.initQuantity < product.quantity) {
        quantity = product.quantity - product.initQuantity;
        price = product.price * quantity;

        return { quantity: quantity, price: price };
      } else if (product.initIsSubscribed && !product.isSubscribed) {
        return { quantity: -quantity, price: -price };
      } else if (!product.initIsSubscribed && product.isSubscribed) {
        return { quantity: quantity, price: price };
      }

      return false;
    },

    discardChanges() {
      this.products.forEach((product) => {
        product.quantity = product.initQuantity;
        product.isSubscribed = product.initIsSubscribed;
      });
    },

    saveChanges() {
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
    },

    acceptModal() {
      this.isConfirmModalVisible = true;
      this.products.forEach((product) => {
        product.initQuantity = product.quantity;
        product.initIsSubscribed = product.isSubscribed;
      });
    },

    closeConfirmModal() {
      this.isConfirmModalVisible = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal-confirm {
  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
  &-button {
    @apply ml-auto;
  }
}

.shop {
  &-wrapper {
    @apply flex space-x-6;

    &-item {
      @apply w-full;
    }
  }
}

.product {
  &-place {
    &-wrapper {
      @apply flex items-center;
      @apply space-x-6;
    }

    &-image {
      @apply h-[4.5rem] w-[6.75rem];
      @apply rounded-lg bg-cover bg-center bg-no-repeat;
      background-image: url("/src/assets/images/building.jpg");
    }

    &-title {
      @apply text-lg font-medium text-base-dark;
    }

    &-description {
      @apply text-base font-normal text-gray-500;
    }
  }

  &-list {
    @apply mt-4;

    &-title {
      @apply text-2lg font-bold text-base-dark;
    }
  }
}

.shop-card {
  @apply h-max w-auto;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
  &-table {
    &-head {
      @apply flex;

      &-label {
        @apply text-base font-medium text-base-dark;

        &-name {
          @apply mr-1.5 w-52 flex-none font-bold;
        }

        &-change {
          @apply mr-1 w-20 flex-none font-bold;
        }

        &-price {
          @apply mr-1 w-20 flex-none text-right font-bold;
        }
      }
    }

    &-line {
      @apply border-b border-base-deep-red;
      @apply my-4;
    }

    &-body {
      @apply space-y-2;

      &-block {
        @apply flex items-center;
      }

      &-wrapper {
        @apply flex;
      }

      &-name {
        @apply text-base font-medium text-base-dark;
        @apply mr-2 w-52 flex-none;
      }

      &-change {
        @apply text-center text-base font-normal text-base-dark;
        @apply mr-1 w-20 flex-none;
      }

      &-price {
        @apply mr-1 w-20 flex-none text-right font-bold;
      }
    }
  }
  &-buttons {
    @apply flex justify-between;
  }
}
.promotions-card {
  @apply mt-4 h-max w-auto;

  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-description {
    @apply text-center text-base font-normal text-black;
    @apply !my-12 w-96;
  }
}

.view-more {
  @apply text-center text-lg font-medium text-base-deep-red;
  @apply border-b border-base-deep-red;
  @apply w-max cursor-pointer;
  @apply mx-auto;
}
</style>
