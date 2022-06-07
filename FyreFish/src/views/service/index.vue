<template>
  <div>
    <img
      v-if="isPropertyManager"
      src="@/assets/images/page/services-pm.jpeg"
      style="min-width: 1400px"
      alt="services"
    />

    <OurPage v-else width="wide">
      <PageTitle />

      <div class="service-wrapper">
        <OurCard class="service-product-card">
          <div class="service-product-title">Active Products and Services</div>

          <div v-for="(product, index) in products" :key="`${index}`">
            <Product :product="product" />
            <Details :details="product.details" />
          </div>
        </OurCard>

        <div class="service-device">
          <OurCard>
            <div class="service-device-title">My Devices</div>

            <div class="service-device-table">
              <div class="service-device-table-head">
                <div class="service-device-table-head-label service-device-table-head-label-name">
                  Device
                </div>
                <div class="service-device-table-head-label service-device-table-head-label-type">
                  Type
                </div>
                <div class="service-device-table-head-label service-device-table-head-label-status">
                  Status
                </div>
                <div class="service-device-table-head-label service-device-table-head-label-state">
                  Pause
                </div>
              </div>

              <div class="service-device-table-line" />

              <div class="service-device-table-body">
                <div
                  v-for="(ownDevice, index) in ownDevices"
                  :key="index"
                  class="service-device-table-body-block"
                >
                  <div class="service-device-table-body-name">{{ ownDevice.device }}</div>

                  <div class="service-device-table-body-type">{{ ownDevice.type }}</div>

                  <div class="service-device-table-body-status">
                    <OurTag :text="ownDevice.status" :variant="ownDevice.tagVariant" />
                  </div>

                  <div class="service-device-table-body-state">
                    <img
                      v-if="ownDevice.pause"
                      class="service-device-table-body-image"
                      alt="player"
                      :src="playerIcon.pause"
                    />

                    <img
                      v-else
                      class="service-device-table-body-image"
                      alt="player"
                      :src="playerIcon.play"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="service-device-table-body-link">
              {{ $t("button.loadMore") }}
            </div>
          </OurCard>

          <OurCard>
            <div class="service-share-title">Shared Devices</div>

            <div class="service-share-table">
              <div class="service-share-table-head">
                <div class="service-share-table-head-label service-share-table-head-label-name">
                  Device
                </div>
                <div class="service-share-table-head-label service-share-table-head-label-type">
                  Type
                </div>
                <div class="service-share-table-head-label service-share-table-head-label-status">
                  Status
                </div>
              </div>

              <div class="service-share-table-line" />

              <div class="service-share-table-body">
                <div
                  v-for="(ownDevice, index) in sharedDevices"
                  :key="index"
                  class="service-share-table-body-block"
                >
                  <div class="service-share-table-body-name">{{ ownDevice.device }}</div>

                  <div class="service-share-table-body-type">{{ ownDevice.type }}</div>

                  <div class="service-share-table-body-status">
                    <OurTag :text="ownDevice.status" :variant="ownDevice.tagVariant" />
                  </div>
                </div>
              </div>
            </div>
          </OurCard>
        </div>
      </div>
    </OurPage>
  </div>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";

import Product from "@/views/shop/components/Product";
import Details from "./components/Details";
import { mapGetters } from "vuex";
import PageTitle from "@/components/PageTitle";

export default {
  components: {
    Product,
    Details,
    PageTitle,
  },

  data() {
    return {
      products: [
        {
          name: "Standard Business",
          planId: "Standard voice line with phone",
          price: "30.00",
          quantityBased: true,
          quantity: 3,
          isDisabled: true,
          isSubscribed: true,
          displaySubscribed: false,
          details: [
            {
              blocks: [
                {
                  title: "Line 1 DID",
                  description: "7823",
                },
                {
                  title: "Line 2 DID",
                  description: "7824",
                },
                {
                  title: "Line 3 DID",
                  description: "7825",
                },
              ],
            },
            {
              blocks: [
                {
                  title: "Line 1 SN",
                  description: "SD263467342",
                },
                {
                  title: "Line 2 SN",
                  description: "SD273436732",
                },
                {
                  title: "Line 3 SN",
                  description: "SD234732343",
                },
              ],
            },
          ],
        },
        {
          name: "Business Internet - 250 Mbps",
          planId: "Upgraded internet service at 250 Mbps",
          price: "180.00",
          quantityBased: false,
          isSubscribed: true,
          details: [
            {
              blocks: [
                {
                  title: "SSID",
                  description: "RedBison",
                },
                {
                  title: "Personal Key",
                  description: "JHFS6234JHHSD",
                },
              ],
            },
          ],
        },
      ],
      ownDevices: [
        {
          device: "00.00:6e:98:00:af",
          type: "Printer",
          status: "online",
          tagVariant: "green",
          pause: true,
        },
        {
          device: "IPhone",
          type: "Mobile",
          status: "offline",
          tagVariant: "red",
          pause: true,
        },
        {
          device: "Windows10a",
          type: "Computer",
          status: "online",
          tagVariant: "green",
          pause: false,
        },
      ],
      sharedDevices: [
        {
          device: "Top Floor",
          type: "Printer",
          status: "online",
          tagVariant: "green",
        },
        {
          device: "Boardroom",
          type: "TV Cast",
          status: "online",
          tagVariant: "green",
        },
        {
          device: "Mailroom",
          type: "Printer",
          status: "offline",
          tagVariant: "red",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["isPropertyManager"]),

    playerIcon() {
      return {
        play: require("@/assets/images/playerIcon/play.png"),
        pause: require("@/assets/images/playerIcon/pause.png"),
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.service {
  &-wrapper {
    @apply flex space-x-6;
  }

  &-product {
    &-title {
      @apply text-2lg font-bold text-base-dark;
    }
  }

  &-device {
    @apply w-100 flex-none space-y-6;

    &-title {
      @apply text-2lg font-bold text-base-dark;
    }

    &-table {
      &-head {
        @apply flex;

        &-label {
          @apply text-base font-medium text-base-dark;

          &-name {
            @apply mr-1.5 w-32 flex-none;
          }

          &-type {
            @apply mr-1 w-20 flex-none;
          }

          &-status {
            @apply mr-1 w-20 flex-none;
          }

          &-state {
            @apply w-full text-right;
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

        &-name {
          @apply text-base font-medium font-bold text-base-dark;
          @apply mr-2 w-32 flex-none;
        }

        &-type {
          @apply text-base font-normal text-base-dark;
          @apply mr-1 w-20 flex-none;
        }

        &-status {
          @apply mr-1 w-20 flex-none text-center;
        }

        &-image {
          @apply h-8 w-8;
          @apply mx-auto cursor-pointer;
        }

        &-state {
          @apply w-full;
        }

        &-link {
          @apply cursor-pointer text-center text-base font-medium text-base-deep-red underline;
        }
      }
    }
  }

  &-share {
    @apply w-100 flex-none space-y-6;

    &-title {
      @apply text-2lg font-bold text-base-dark;
    }

    &-table {
      &-head {
        @apply flex;

        &-label {
          @apply text-base font-medium text-base-dark;

          &-name {
            @apply mr-1.5 w-[8.5rem] flex-none;
          }

          &-type {
            @apply mr-1 w-24 flex-none;
          }

          &-status {
            @apply w-full pr-1 text-right;
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

        &-name {
          @apply text-base font-medium font-bold text-base-dark;
          @apply mr-1.5 w-[8.5rem] flex-none;
        }

        &-type {
          @apply text-base font-normal text-base-dark;
          @apply mr-1 w-24 flex-none;
        }

        &-status {
          @apply w-full text-right;
        }
      }
    }
  }
}
</style>
