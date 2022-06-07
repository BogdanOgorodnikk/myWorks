<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.mergingIntoTransfer')"
    :action-button-text="$t('button.merge')"
    :disable-accept-button="!isAllSuitable"
    @actionConfirmed="onConfirmMergeTransactions"
  >
    <div class="merge-requirements-title">
      {{ $t("page.transactions.mergeRequirements") }}
    </div>

    <div class="merge-requirements-block">
      <div
        v-for="(option, index) in mergeRequirementsItems"
        :key="index"
        class="merge-requirements-wrapper"
      >
        <OurSvgIcon v-if="option.isSuitable" name="Check" class="icon-accept" />

        <OurSvgIcon v-else name="Close" class="icon-declined" />

        <div class="merge-requirements-rules">
          <div class="merge-requirements-rules-title">{{ option.title }}</div>

          <div v-if="option.description" class="merge-requirements-rules-description">
            {{ option.description }}
          </div>
        </div>
      </div>
    </div>
  </OurConfirmModal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { fromUnixTime, format } from "date-fns";
import { TRANSACTION_TYPE } from "@/api/transaction";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isAllSuitable: false,
      mergeRequirementsItems: [
        {
          title: this.$t("page.transactions.differentAccounts"),
          description: "",
          isSuitable: false,
        },
        {
          title: this.$t("page.transactions.differentTypes"),
          description: this.$t("page.transactions.incomeAndExpense"),
          isSuitable: false,
        },
        {
          title: this.$t("page.transactions.similarDate"),
          description: "",
          isSuitable: false,
        },
        {
          title: this.$t("page.transactions.similarStatus"),
          description: this.$t("page.transactions.acceptOrDeclined"),
          isSuitable: false,
        },
        {
          title: this.$t("page.transactions.similarAmount"),
          description: this.$t("page.transactions.accountCurrencySimilar"),
          isSuitable: false,
        },
      ],
    };
  },

  computed: {
    ...mapState("transaction", ["transactions"]),

    isShownModal: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },

    checkedItems() {
      return this.items.filter((item) => item.isChecked);
    },
  },

  watch: {
    isShownModal: "onChangeShownModal",
  },

  methods: {
    ...mapActions("transaction", ["mergeTransactionIntoTransfer"]),

    onChangeShownModal() {
      if (this.isShownModal) {
        let [
          accountRequirements,
          typesRequirements,
          dateRequirements,
          statusRequirements,
          amountRequirements,
        ] = this.mergeRequirementsItems;

        const [firstItem, secondItem] = this.checkedItems;
        const firstTransaction = this.transactions.find((item) => item.id === firstItem.id);
        const secondTransaction = this.transactions.find((item) => item.id === secondItem.id);
        const firstDate = format(fromUnixTime(firstTransaction.paymentDate), "d.M.Y");
        const secondDate = format(fromUnixTime(secondTransaction.paymentDate), "d.M.Y");

        accountRequirements.isSuitable =
          firstTransaction.bankAccount.id !== secondTransaction.bankAccount.id;
        typesRequirements.isSuitable =
          firstTransaction.category.type !== secondTransaction.category.type &&
          firstTransaction.category.type !== TRANSACTION_TYPE.transfer &&
          secondTransaction.category.type !== TRANSACTION_TYPE.transfer;
        dateRequirements.isSuitable = firstDate === secondDate;
        statusRequirements.isSuitable =
          firstTransaction.paymentConfirmed === secondTransaction.paymentConfirmed;
        amountRequirements.isSuitable =
          firstTransaction.bankAccount.currency.id === secondTransaction.bankAccount.currency.id
            ? firstTransaction.sum === secondTransaction.sum
            : true;

        this.isAllSuitable =
          accountRequirements.isSuitable &&
          typesRequirements.isSuitable &&
          dateRequirements.isSuitable &&
          statusRequirements.isSuitable &&
          amountRequirements.isSuitable;
      }
    },

    async onConfirmMergeTransactions() {
      const [firstItem, secondItem] = this.checkedItems;

      const transactionsId = {
        firstId: firstItem.id,
        secondId: secondItem.id,
      };

      await this.mergeTransactionIntoTransfer(transactionsId);
    },
  },
};
</script>

<style lang="postcss" scoped>
.merge-requirements {
  &-title {
    @apply text-base font-normal text-base-dark;
    @apply mb-4;
  }

  &-block {
    @apply space-y-3;
  }

  &-wrapper {
    @apply flex items-center space-x-2;
  }

  &-rules {
    &-title {
      @apply text-base font-medium text-base-dark;
    }

    &-description {
      @apply text-xs font-normal text-gray-450;
    }
  }
}

.icon {
  &-accept {
    &::v-deep g [fill] {
      @apply text-green-600;
    }
  }

  &-declined {
    &::v-deep g [fill] {
      @apply text-red-600;
    }
  }
}
</style>
