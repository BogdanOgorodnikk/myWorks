<template>
  <div>
    <img
      v-if="isPropertyManager"
      src="@/assets/images/page/home-pm.jpeg"
      style="min-width: 1400px"
      alt="services"
    />

    <OurPage v-else width="wide">
      <PageTitle />

      <div class="dashboard-wrapper">
        <OurCard class="dashboard-bill">
          <div class="bill-title">{{ $t("page.bill.latestBill") }}</div>

          <div class="bill-block">
            <div class="bill-wrapper">
              <div class="bill-wrapper-title">{{ $t("page.bill.billingPeriod") }}</div>
              <div class="bill-wrapper-description">Jan 1, 2022 – Jan 31, 2022</div>
            </div>

            <div class="bill-wrapper">
              <div class="bill-wrapper-title">{{ $t("page.bill.previousBalance") }}</div>
              <div class="bill-wrapper-description">$0.00</div>
            </div>

            <div class="bill-wrapper">
              <div class="bill-wrapper-title">{{ $t("page.bill.currentCharges") }}</div>
              <div class="bill-wrapper-description">$87.10</div>
            </div>

            <div class="bill-wrapper">
              <div class="bill-wrapper-title">{{ $t("page.bill.amountDue") }}</div>
              <div class="bill-wrapper-description">$0.00</div>
            </div>

            <div class="bill-wrapper">
              <div class="bill-wrapper-title">{{ $t("page.bill.autoPayDate") }}</div>
              <div class="bill-wrapper-description">Jan 20, 2022</div>
            </div>
          </div>

          <router-link target="_blank" :to="{ name: 'Invoice' }" class="bill-link">{{
            $t("page.bill.viewInvoice")
          }}</router-link>

          <OurButton
            :text="$t('button.makePayment')"
            variant="primary"
            class="bill-button"
            @click="onClickMakePayment"
          />
        </OurCard>

        <OurCard class="dashboard-promotion">
          <div class="promotion-title">{{ $t("page.bill.promotions") }}</div>

          <div class="promotion-description">{{ $t("page.bill.noActivePromotions") }}</div>
        </OurCard>

        <OurCard class="dashboard-build">
          <div class="build-image" />

          <div class="build-title">
            {{ $t("page.bill.announcements") }}
          </div>

          <perfect-scrollbar class="build-scroll">
            <div class="build-wrapper">
              <div class="build-wrapper-date">01/22</div>
              <div class="build-wrapper-title">Fire Alam Testing February</div>
              <div class="build-wrapper-link">View</div>
            </div>

            <div class="build-wrapper">
              <div class="build-wrapper-date">01/18</div>
              <div class="build-wrapper-title">Recycling route changes</div>
              <div class="build-wrapper-link">View</div>
            </div>

            <div class="build-wrapper">
              <div class="build-wrapper-date">01/15</div>
              <div class="build-wrapper-title">Fire Alam Testing January</div>
              <div class="build-wrapper-link">View</div>
            </div>

            <div class="build-wrapper">
              <div class="build-wrapper-date">01/11</div>
              <div class="build-wrapper-title">Fire Alam Testing January</div>
              <div class="build-wrapper-link">View</div>
            </div>
          </perfect-scrollbar>
        </OurCard>
      </div>

      <div class="dashboard-cards">
        <router-link
          v-for="(card, index) in routerCards"
          :key="index"
          :to="{ name: card.pageName }"
          class="router-card"
        >
          <div class="router-card-title">{{ card.title }}</div>

          <img class="router-card-icon" :src="require(`@/assets/images/icons/${card.iconName}`)" />
        </router-link>
      </div>
    </OurPage>
  </div>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";
import { mapGetters } from "vuex";
import PageTitle from "@/components/PageTitle";

export default {
  components: {
    PageTitle,
  },

  data() {
    return {
      routerCards: [
        {
          title: this.$t("title.shop"),
          iconName: "CustomCart1.svg",
          pageName: "Shop",
        },
        {
          title: this.$t("title.billing"),
          iconName: "CustomCredit-card.svg",
          pageName: "Billing",
        },
        {
          title: this.$t("title.services"),
          iconName: "CustomService.svg",
          pageName: "Service",
        },
        {
          title: this.$t("title.account"),
          iconName: "CustomUser.svg",
          pageName: "Account",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["isPropertyManager"]),
  },

  methods: {
    onClickMakePayment() {
      this.$router.push({ name: "MakePayment" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.dashboard {
  &-wrapper {
    @apply flex space-x-2;
  }

  &-bill {
    @apply space-y-4;
  }

  &-cards {
    @apply mt-4 flex space-x-2;
  }
}

.bill {
  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-block {
    @apply space-y-2;
  }

  &-wrapper {
    @apply flex justify-between;

    &-title {
      @apply text-base font-normal text-gray-500;
    }

    &-description {
      @apply text-base font-bold text-base-dark;
    }
  }

  &-link {
    @apply block;
    @apply text-base font-medium text-base-deep-red underline;
  }

  &-button {
    @apply w-full;
  }
}

.promotion {
  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-description {
    @apply flex flex-col justify-center;
    @apply text-center text-base font-normal text-base-dark;
    @apply -mt-6 h-full !important;
  }
}

.build {
  &-image {
    @apply h-32 w-full;
    @apply bg-gray-100 bg-cover bg-center bg-no-repeat;
    background-image: url(/src/assets/images/building.jpg);
  }

  &-title {
    @apply text-center text-lg font-medium text-base-dark;
    @apply mt-4 pt-0.5 !important;
  }

  &-scroll {
    @apply h-14 space-y-4;
  }

  &-wrapper {
    @apply flex space-x-2;

    &-date {
      @apply text-base font-bold text-black;
    }

    &-title {
      @apply text-base font-normal text-black;
    }

    &-link {
      @apply text-base font-medium text-base-deep-red underline;
    }
  }
}

.router-card {
  @apply flex flex-col items-center;
  @apply rounded-2xl border-4 border-gray-600 bg-white text-center;
  @apply w-full p-6;
  @apply cursor-pointer;

  &-title {
    @apply text-2xl font-medium text-base-dark;
    @apply mb-2;
  }

  &-icon {
    @apply h-24 w-24;
  }
}
</style>
