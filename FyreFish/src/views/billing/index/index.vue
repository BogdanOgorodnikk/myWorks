<template>
  <div>
    <OurPageModal v-model="isModalAddPaymentVisible" width="2xl" @closed="closeModal">
      <AddPaymentMethod @paymentAdded="closeModal" @paymentCancelled="closeModal" />
    </OurPageModal>
    <OurPageModal v-model="isModalDeletePaymentVisible" width="2xl" @closed="closeModal">
      <DeletePaymentMethod @paymentDeleted="closeModal" @paymentCancelled="closeModal" />
    </OurPageModal>

    <img
      v-if="isPropertyManager"
      src="@/assets/images/page/billing-pm.jpeg"
      style="min-width: 1400px"
      alt="services"
    />

    <OurPage v-else width="wide">
      <PageTitle />

      <div class="bill-wrapper">
        <OurCard class="card">
          <div class="card-title">{{ $t("page.bill.latestBill") }}</div>

          <div class="card-wrapper">
            <div class="card-bill-wrapper">
              <div class="card-bill-title">{{ $t("page.bill.billingPeriod") }}</div>

              <div class="card-bill-description">Jan 1, 2022 – Jan 31, 2022</div>
            </div>

            <div class="card-bill-wrapper">
              <div class="card-bill-title">{{ $t("page.bill.previousBalance") }}</div>

              <div class="card-bill-description">$0.00</div>
            </div>

            <div class="card-bill-wrapper">
              <div class="card-bill-title">{{ $t("page.bill.currentCharges") }}</div>

              <div class="card-bill-description">$87.10</div>
            </div>

            <div class="card-bill-wrapper">
              <div class="card-bill-title">{{ $t("page.bill.amountDue") }}</div>

              <div class="card-bill-description">$0.00</div>
            </div>

            <div class="card-bill-wrapper">
              <div class="card-bill-title">{{ $t("page.bill.autoPayDate") }}</div>

              <div class="card-bill-description">Jan 20, 2022</div>
            </div>
          </div>

          <router-link :to="{ name: 'Invoice' }" target="_blank" class="card-bill-link">{{
            $t("page.bill.viewInvoice")
          }}</router-link>

          <OurButton
            class="card-bill-button"
            variant="primary"
            :text="$t('button.makePayment')"
            @click="onClickMakePayment"
          />
        </OurCard>

        <MontlySpend />

        <DashboardMontlySpendByService />

        <OurCard class="card">
          <div class="card-title">{{ $t("page.bill.paymentHistory") }}</div>

          <perfect-scrollbar class="card-history">
            <div
              v-for="(payment, index) in historyPayments"
              :key="index"
              class="card-history-block"
            >
              <div class="card-history-wrapper">
                <div class="card-history-date">{{ payment.date }}</div>

                <div class="card-history-description">{{ payment.sum }}</div>
              </div>

              <div class="card-history-title">
                {{ $t("page.bill.confirmation") }} {{ payment.id }}
              </div>
            </div>
          </perfect-scrollbar>

          <div v-if="false" class="card-history-button">
            {{ $t("button.loadMore") }}
          </div>
        </OurCard>

        <OurCard class="card">
          <div class="card-title">{{ $t("page.bill.billingHistory") }}</div>

          <perfect-scrollbar class="card-history">
            <div v-for="(payment, index) in historyBilling" :key="index" class="card-history-block">
              <div class="card-history-wrapper">
                <div class="card-history-date">{{ payment.date }}</div>

                <div class="card-history-wrapper-item">
                  <div class="card-history-description">{{ payment.sum }}</div>

                  <router-link
                    :to="{ name: 'Invoice' }"
                    target="_blank"
                    class="card-history-view"
                    >{{ $t("button.view") }}</router-link
                  >
                </div>
              </div>

              <div class="card-history-title">{{ $t("page.bill.bill") }} {{ payment.id }}</div>
            </div>
          </perfect-scrollbar>

          <div v-if="false" class="card-history-button">
            {{ $t("button.loadMore") }}
          </div>
        </OurCard>

        <OurCard class="card card-payment">
          <div>
            <div class="card-payment-wrapper">
              <div class="card-title">{{ $t("page.bill.paymentMethods") }}</div>

              <div class="card-payment-wrapper-item">
                <div class="card-payment-title">{{ $t("label.autopay") }}</div>

                <OurSwitch v-model="isActivedAutopay" variant="primary" />
              </div>
            </div>

            <PaymentMethod
              v-for="option in paymentMethodOptions"
              :key="option.cardNumber"
              v-model="paymentMethod"
              :option="option"
              class="card-payment-methods"
            />
          </div>
          <div class="card-payment-link" @click="showDeletePaymentModal">
            {{ $t("page.bill.managePaymentMethods") }}
          </div>
          <OurButton
            class="card-payment-button"
            :text="$t('button.addPaymentMethod')"
            @click="showAddPaymentModal"
          />
        </OurCard>
      </div>
    </OurPage>
  </div>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";

import DashboardMontlySpendByService from "./components/DashboardMontlySpendByService";
import PaymentMethod from "./components/PaymentMethod";
import { mapGetters, mapState } from "vuex";
import MontlySpend from "./components/MontlySpend";
import AddPaymentMethod from "../index/components/AddPaymentMethod";
import DeletePaymentMethod from "../index/components/DeletePaymentMethod";
import PageTitle from "@/components/PageTitle";

export default {
  components: {
    DashboardMontlySpendByService,
    PaymentMethod,
    MontlySpend,
    AddPaymentMethod,
    DeletePaymentMethod,
    PageTitle,
  },

  data() {
    return {
      isModalAddPaymentVisible: false,
      isModalDeletePaymentVisible: false,
      isActivedAutopay: true,
      paymentMethod: {},
      historyPayments: [
        {
          date: "Jan 20 2022 – 1:00pm",
          sum: "$87.10",
          id: "AU82764837643",
        },
      ],
      historyBilling: [
        {
          date: "Jan 20 2022 – 1:00pm",
          sum: "$87.10",
          id: "2374632",
        },
      ],
    };
  },

  computed: {
    ...mapState("billing", ["paymentMethodOptions"]),
    ...mapGetters(["isPropertyManager"]),

    chartImagePath() {
      return {
        circle: require("@/assets/images/bill/CircleChart.png"),
      };
    },
    isModalVisible() {
      return this.isModalAddPaymentVisible || this.isModalDeletePaymentVisible;
    },
  },

  methods: {
    onClickMakePayment() {
      this.$router.push({ name: "MakePayment" });
    },
    showAddPaymentModal() {
      this.isModalAddPaymentVisible = true;
    },
    showDeletePaymentModal() {
      this.isModalDeletePaymentVisible = true;
    },
    closeModal() {
      this.isModalAddPaymentVisible = false;
      this.isModalDeletePaymentVisible = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.bill-wrapper {
  @apply mt-6 grid grid-cols-3 gap-x-2 gap-y-4;
}

.card {
  @apply h-80 space-y-4;

  &-payment {
    @apply flex flex-col justify-between;

    &-link {
      @apply block;
      @apply cursor-pointer text-center text-base font-normal text-base-deep-red underline;
    }
  }

  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-wrapper {
    @apply space-y-2;
  }

  &-bill {
    &-wrapper {
      @apply flex justify-between;
    }

    &-title {
      @apply text-base font-normal text-gray-500;
    }

    &-description {
      @apply text-base font-bold text-base-dark;
    }

    &-link {
      @apply block;
      @apply text-base font-normal text-base-deep-red underline;
    }

    &-button {
      @apply w-full;
    }
  }

  &-history {
    @apply h-36 space-y-4 pr-4;

    &-wrapper {
      @apply flex items-center justify-between;

      &-item {
        @apply flex items-center;
      }
    }

    &-view {
      @apply text-base font-bold text-base-deep-red underline;
      @apply cursor-pointer pl-2;
    }

    &-date {
      @apply text-base font-bold text-gray-500;
    }

    &-description {
      @apply text-base font-medium text-base-dark;
    }

    &-title {
      @apply text-base font-normal text-gray-500;
    }

    &-button {
      @apply text-base font-normal text-base-deep-red underline;
      @apply mx-auto mt-16 mb-2.5 !important;
      @apply w-max cursor-pointer;
    }
  }

  &-payment {
    &-wrapper {
      @apply flex items-center justify-between;

      &-item {
        @apply flex items-center justify-between;
      }
    }

    &-title {
      @apply text-base font-normal text-black;
      @apply pr-4;
    }

    &-button {
      @apply w-full;
    }
  }
}
</style>
