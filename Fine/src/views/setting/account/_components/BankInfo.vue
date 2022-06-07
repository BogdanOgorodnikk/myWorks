<template>
  <div class="wrapper">
    <OurBankIcon class="bank-image" :bank="selectedBank" />

    <div class="bank">
      <p class="bank-title">
        {{ bankName }} <span v-if="bankAccount" class="bank-card">{{ lastNumbersOfCard }}</span>
      </p>

      <div v-if="isShownActionWrapper" class="action-wrapper">
        <div v-if="shownStatus.canceled" class="bank-status bank-status-cancel">
          <OurSvgIcon class="icon-cancel" name="Close" size="xs" />

          <div class="bank-status-title bank-status-title-cancel">{{ statusTitle }}</div>
        </div>

        <div v-if="shownStatus.accepted" class="bank-status bank-status-accept">
          <OurSvgIcon class="icon-accept" name="Check" size="xs" />

          <div class="bank-status-title bank-status-title-accept">{{ statusTitle }}</div>
        </div>

        <div v-if="shownStatus.doubleAccepted" class="bank-status bank-status-accept">
          <OurSvgIcon class="icon-accept" name="Double-check" size="xs" />

          <div class="bank-status-title bank-status-title-accept">{{ statusTitle }}</div>
        </div>

        <div v-if="action" class="action" @click="onClickTakeAction">{{ action }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import OurBankIcon from "@/components/BankIcon";
const NUMBER_DIGITS_WHICH_LEFT = 4;

import { BANK_CODES } from "@/api/bankAccount";

export default {
  components: {
    OurBankIcon,
  },

  props: {
    bank: {
      type: String,
      default: "",
    },

    bankTitle: {
      type: String,
      default: "",
    },

    bankAccount: {
      type: String,
      default: "",
    },

    statusType: {
      type: String,
      default: "",
    },

    statusTitle: {
      type: String,
      default: "",
    },

    action: {
      type: String,
      default: "",
    },
  },

  computed: {
    lastNumbersOfCard() {
      const cardLength = this.bankAccount.length;
      const newCardLength = cardLength - NUMBER_DIGITS_WHICH_LEFT;

      const lastNumbers = this.bankAccount.substring(cardLength, newCardLength);

      return `*${lastNumbers}`;
    },

    isShownActionWrapper() {
      return this.statusType || this.action;
    },

    shownStatus() {
      return {
        canceled: this.statusType === "canceled",
        accepted: this.statusType === "accepted",
        doubleAccepted: this.statusType === "doubleAccepted",
      };
    },

    selectedBank() {
      const bankCode = this.bank;

      let selectedBank;

      if (bankCode === BANK_CODES.monobankPersonal) {
        selectedBank = BANK_CODES.monobankPersonal;
      } else if (bankCode === BANK_CODES.privatPersonal) {
        selectedBank = BANK_CODES.privatPersonal;
      } else if (bankCode === BANK_CODES.privatBusiness) {
        selectedBank = BANK_CODES.privatBusiness;
      }

      return selectedBank;
    },

    bankName() {
      const bankCode = this.bank;

      let bankName;

      if (bankCode === BANK_CODES.monobankPersonal) {
        bankName = this.$t("label.monoBank");
      } else if (bankCode === BANK_CODES.privatPersonal) {
        bankName = this.$t("label.privatBankPersonal");
      } else if (bankCode === BANK_CODES.privatBusiness) {
        bankName = this.$t("label.privatBankBusiness");
      }

      return bankName;
    },
  },

  methods: {
    onClickTakeAction() {
      this.$emit("сlickTakeAction");
    },
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex items-center;
}

.bank-image {
  @apply mr-4;
}

.action-wrapper {
  @apply flex items-center;
  @apply mt-1;
}

.bank-title {
  @apply text-base font-medium text-base-dark;
}

.bank-card {
  @apply text-xs font-normal text-gray-700;
}

.bank-status {
  @apply flex items-center;
  @apply py-0.5 pr-2 pl-1.5;
  @apply mr-2 rounded-full;
}

.bank-status-cancel {
  @apply bg-gray-100;
}

.bank-status-accept {
  @apply bg-green-100;
}

.bank-status-title {
  @apply text-xs font-normal;
  @apply pl-1;
}

.bank-status-title-cancel {
  @apply text-gray-500;
}

.bank-status-title-accept {
  @apply text-green-500;
}

.icon-cancel::v-deep g [fill] {
  @apply fill-current text-gray-500;
}

.icon-accept::v-deep g [fill] {
  @apply fill-current text-green-500;
}

.action {
  @apply text-xs font-normal text-base-dark;
  @apply border border-t-0 border-l-0 border-r-0 border-dashed border-base-dark;
  @apply cursor-pointer;
}
</style>
