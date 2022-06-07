<template>
  <OurPage width="wide">
    <div class="head-wrapper">
      <div>
        <OurCard class="head-card-info">
          <div class="head-card-info-title">Bill To: Fleece Linings Inc,</div>
          <div class="head-card-info-title">100 W Walnut St, 200,</div>
          <div class="head-card-info-title">Pasadena CA 91103</div>
        </OurCard>
        <div class="print-wrapper" @click="print">
          <OurSvgIcon name="File" class="info-icon" size="md" />
          <span class="print-text">{{ $t("title.printInvoice") }}</span>
        </div>
      </div>

      <div class="head-enterprise">
        <img class="head-enterprise-image" :src="logoPath" alt="logo" />

        <div class="head-enterprise-title">Red Bison Technology Group, LLC</div>
        <div class="head-enterprise-title">P.O. Box 1358</div>
        <div class="head-enterprise-title">Mercer Island, WA 98040</div>
      </div>
    </div>

    <OurCard class="invoice-summary">
      <div class="invoice-summary-title">{{ $t("title.summary") }}</div>

      <div class="invoice-summary-wrapper">
        <div class="invoice-summary-general-info">
          <div class="invoice-summary-general-block">
            <div class="invoice-summary-general-title">
              {{ $t("title.account") }}:
              <span class="invoice-summary-general-title-span">216345328</span>
            </div>
            <div class="invoice-summary-general-title">
              {{ $t("title.dateIssued") }}:
              <span class="invoice-summary-general-title-span">Jan 20, 2022</span>
            </div>
            <div class="invoice-summary-general-title">
              {{ $t("title.invoice") }}:
              <span class="invoice-summary-general-title-span">9182372</span>
            </div>
            <div class="invoice-summary-general-title">
              {{ $t("title.dateDue") }}:
              <span class="invoice-summary-general-title-span">Jan 20, 2022</span>
            </div>
          </div>

          <div class="invoice-summary-general-block">
            <div class="invoice-summary-general-title invoice-summary-general-address">
              {{ $t("title.serviceAddress") }}:
              <span class="invoice-summary-general-title-span">
                100 W Walnut St, 200 Pasadena, CA USA 91103
              </span>
            </div>
          </div>
        </div>

        <div class="invoice-summary-money-info">
          <div class="invoice-summary-money-info-block">
            <div class="invoice-summary-money-info-title">{{ $t("title.previousBalance") }}</div>
            <div class="invoice-summary-money-info-description">$0.00</div>
          </div>

          <div class="invoice-summary-money-info-block">
            <div class="invoice-summary-money-info-title">{{ $t("title.paymentsReceived") }}</div>
            <div class="invoice-summary-money-info-description">$0.00</div>
          </div>

          <div class="invoice-summary-money-info-block">
            <div class="invoice-summary-money-info-title">{{ $t("title.balanceForward") }}</div>
            <div class="invoice-summary-money-info-description">$0.00</div>
          </div>

          <div class="invoice-summary-money-info-block">
            <div class="invoice-summary-money-info-title">{{ $t("title.newCharges") }}</div>
            <div class="invoice-summary-money-info-description">$87.10</div>
          </div>

          <div class="invoice-summary-paid-line">
            <div class="invoice-summary-paid-line-block-text">
              <span class="invoice-summary-paid-line-text"> PAID </span>
            </div>
            <div class="invoice-summary-paid-line-block-value">
              <span class="invoice-summary-paid-line-value"> $120.20 </span>
            </div>
            <div class="invoice-summary-paid-line-right-border" />
          </div>
        </div>
      </div>
    </OurCard>

    <OurCard class="details-card">
      <div class="details-card-title">
        {{ $t("title.details") }}
      </div>

      <div class="details-table">
        <div class="details-table-head">
          <div class="details-table-head-item details-table-head-item-name">
            {{ $t("title.description") }}
          </div>
          <div class="details-table-head-item details-table-head-item-date">
            {{ $t("title.serviceDates") }}
          </div>
          <div class="details-table-head-item details-table-head-item-count">
            {{ $t("title.qty") }}
          </div>
          <div class="details-table-head-item details-table-head-item-unit">
            {{ $t("title.units") }}
          </div>
          <div class="details-table-head-item details-table-head-item-sum">
            {{ $t("title.$/Unit") }}
          </div>
          <div class="details-table-head-item">{{ $t("title.discount") }}</div>
          <div class="details-table-head-item">{{ $t("title.price") }}</div>
        </div>

        <div class="details-table-line" />

        <div class="details-table-body">
          <div class="details-table-body-block">
            <div class="details-table-body-item details-table-body-item-name">
              Business Internet 250
            </div>
            <div class="details-table-body-item details-table-body-item-date">
              01/20/2022 - 01/31/2022
            </div>
            <div class="details-table-body-item details-table-body-item-count">1</div>
            <div class="details-table-body-item details-table-body-item-unit">Svc</div>
            <div class="details-table-body-item details-table-body-item-sum">180.00</div>
            <div class="details-table-body-item details-table-body-item-discount">0.00</div>
            <div class="details-table-body-item">58.06</div>
          </div>

          <div class="details-table-body-block">
            <div class="details-table-body-item details-table-body-item-name">
              Standard Business Voice
            </div>
            <div class="details-table-body-item details-table-body-item-date">
              01/20/2022 - 01/31/2022
            </div>
            <div class="details-table-body-item details-table-body-item-count">3</div>
            <div class="details-table-body-item details-table-body-item-unit">Line</div>
            <div class="details-table-body-item details-table-body-item-sum">30.00</div>
            <div class="details-table-body-item details-table-body-item-discount">0.00</div>
            <div class="details-table-body-item">29.04</div>
          </div>
        </div>

        <div class="details-table-line" />

        <div class="details-table-footer">
          <div class="details-table-footer-block">
            <div class="details-table-footer-title">{{ $t("page.bill.subtotal") }}</div>
            <div class="details-table-footer-title">87.10</div>
          </div>

          <div class="details-table-footer-block">
            <div class="details-table-footer-title">{{ $t("page.bill.taxesAndFees") }}</div>
            <div class="details-table-footer-title">0.00</div>
          </div>

          <div class="details-table-footer-block">
            <div class="details-table-footer-title">{{ $t("page.bill.totalNewCharges") }}</div>
            <div class="details-table-footer-title">87.10</div>
          </div>
        </div>
      </div>
    </OurCard>

    <OurCard class="memo-card">
      <div class="memo-card-title">{{ $t("title.memo") }}</div>

      <div class="memo-wrapper">
        <div class="memo-item">
          <div class="memo-item-title">{{ $t("page.bill.pleaseRemitPaymentsTo") }}</div>
          <div class="memo-item-title">
            Red Bison Technology Group P.O. Box 1358 Mercer Island, WA 98040
          </div>
        </div>

        <div class="memo-item-thank">{{ $t("page.bill.thankYouForUsingRedBison") }}</div>
      </div>
    </OurCard>
  </OurPage>
</template>

<script>
export default {
  computed: {
    logoPath() {
      return require("@/assets/images/logos/LogoWIthLetter.svg");
    },
  },

  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style lang="postcss" scoped>
.head {
  &-wrapper {
    @apply flex justify-between;

    .print-wrapper {
      @apply mt-6 ml-6 flex w-fit cursor-pointer;
    }

    .print-text {
      @apply ml-2 text-gray-500 underline;
    }
  }

  &-card-info {
    @apply h-fit w-96 space-y-2;

    &-title {
      @apply text-base font-normal text-gray-500;
    }
  }

  &-enterprise {
    @apply space-y-2;

    &-image {
      @apply w-100;
    }

    &-title {
      @apply text-right text-base font-normal text-gray-500;
    }
  }
}

.invoice-summary {
  @apply mt-6;

  &-title {
    @apply text-2xl font-bold text-base-bright-red;
  }

  &-wrapper {
    @apply flex justify-between space-x-6;
  }

  &-general {
    @apply w-full;

    &-info {
      @apply flex justify-between;
      @apply w-full space-x-4;
    }

    &-address {
      @apply text-right;
    }

    &-block {
      @apply w-full space-y-2;
    }

    &-title {
      @apply text-base font-bold text-gray-500;

      &-span {
        @apply font-normal;
      }
    }
  }
  &-paid-line {
    @apply flex justify-between;

    &-block-text {
      @apply flex h-10 items-center rounded-xl bg-base-gray;
    }
    &-text {
      @apply px-2.5 text-2xl text-white;
    }
    &-block-value {
      @apply z-10 ml-auto -mr-0.5 flex h-10 items-center rounded-lg bg-white px-2;
    }
    &-value {
      @apply text-2xl font-bold;
    }
    &-right-border {
      @apply w-1.5 rounded-r-lg bg-base-gray;
    }
  }
  &-money-info {
    @apply w-full space-y-2;

    &-block {
      @apply flex justify-between;
    }

    &-title {
      @apply text-base font-normal text-base-bright-red;
    }

    &-description {
      @apply text-base font-normal text-gray-500;
    }

    &-total {
      @apply font-bold text-base-deep-red;
    }
  }
}

.details {
  &-card {
    @apply mt-4;

    &-title {
      @apply text-2xl font-bold text-base-bright-red;
    }
  }

  &-table {
    &-head {
      @apply flex justify-between;

      &-item {
        @apply w-auto flex-none;
        @apply text-base font-bold text-black;

        &-name {
          @apply w-48;
        }

        &-date {
          @apply w-48 pl-1;
        }

        &-count {
          @apply w-4 pl-1;
        }

        &-unit {
          @apply w-8 pl-4;
        }

        &-sum {
          @apply w-20 pl-6 text-center;
        }
        &-discount {
          @apply w-20 text-center;
        }
      }
    }

    &-body {
      @apply space-y-2;

      &-block {
        @apply flex justify-between;
      }

      &-item {
        @apply w-auto flex-none;
        @apply text-base font-normal text-black;

        &-name {
          @apply w-48;
        }

        &-date {
          @apply w-48;
        }

        &-count {
          @apply w-4;
        }

        &-unit {
          @apply w-8;
        }

        &-sum {
          @apply w-14;
        }
        &-discount {
          @apply w-12;
        }
      }
    }

    &-footer {
      @apply ml-auto max-w-sm;
      @apply space-y-2;

      &-block {
        @apply flex justify-between;
      }

      &-title {
        @apply text-base font-normal text-black;
      }
    }

    &-line {
      @apply border-t border-base-deep-red;
      @apply my-2;
    }
  }
}

.memo {
  &-card {
    @apply mt-4;

    &-title {
      @apply text-2xl font-bold text-base-bright-red;
    }
  }

  &-wrapper {
    @apply flex items-center justify-between;
  }

  &-item {
    @apply space-y-2;

    &-title {
      @apply w-80 text-base font-normal text-gray-500;
    }

    &-thank {
      @apply text-4xl font-normal text-black;
    }
  }
}
</style>
