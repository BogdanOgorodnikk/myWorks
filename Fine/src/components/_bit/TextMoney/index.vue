<template>
  <div :class="theme">
    <div class="money-block" :class="moneyClasses">
      <OurSvgIcon
        v-if="isDebitObligation"
        name="Debit"
        :size="icons.size"
        :tooltip="icons.debitTooltip"
        color="gray"
      />

      <OurSvgIcon
        v-if="isCreditObligation"
        name="Credit"
        :size="icons.size"
        :tooltip="icons.creditTooltip"
        color="gray"
      />

      <span :data-cy="`${itemType}-sum`" class="sum">
        <span v-if="currencySymbolPosition.left" class="currency-symbol">
          {{ currencySymbol }}
        </span>

        <span v-if="item.sum">{{ typeSymbol }}</span>

        <span>{{ preparedMoney.integer }}</span>

        <span v-if="!integer" class="penny"
          >{{ preparedMoney.delimiter }}{{ preparedMoney.penny }}
        </span>

        <span v-if="currencySymbolPosition.right" class="currency-symbol">{{
          currencySymbol
        }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import MoneyService, {
  DEBIT_OBLIGATION,
  CREDIT_OBLIGATION,
  MONEY_SIGN_TYPE,
} from "@ilevel/our.service.money";
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurMoney",
  components: {
    OurSvgIcon,
  },

  props: {
    /**
     * Set component item.
     */
    item: {
      type: Object,
      default: () => ({
        type: "income",
        sum: 0,
        obligation: DEBIT_OBLIGATION,
        currencySymbol: "",
      }),
      required: true,
    },

    /**
     * Set params for credit and debit icons.
     */
    icons: {
      type: Object,
      default: () => ({
        creditTooltip: "",
        debitTooltip: "",
        size: "2xs",
      }),
    },

    /**
     * Make sum planned (add brackets).
     */
    planned: {
      type: Boolean,
      default: false,
    },

    /**
     * Make sum integer.
     */
    integer: {
      type: Boolean,
      default: false,
    },

    /**
     * Set sign for sum.
     * @values default, positive, negative
     */
    sign: {
      type: String,
      default: "default",
    },

    /**
     * Set align for currency symbol.
     * @values right, left
     */
    currencySymbolAlign: {
      type: String,
      default: "right",
    },

    /**
     * Set text size of sum.
     * @values sm, md, lg, xl, 2xl
     */
    size: {
      type: String,
      default: "md",
    },
  },

  computed: {
    isDebitObligation() {
      return this.item.obligation === DEBIT_OBLIGATION;
    },

    isCreditObligation() {
      return this.item.obligation === CREDIT_OBLIGATION;
    },

    currencySymbolPosition() {
      return {
        left: this.currencySymbolAlign === "left",
        right: this.currencySymbolAlign === "right",
      };
    },

    itemType() {
      const itemType = this.item.sum >= 0 ? "income" : "expense";

      return this.item.type || itemType;
    },

    typeSymbol() {
      let types = {};
      const sign = this.sign;

      if (sign === MONEY_SIGN_TYPE.positive) {
        types.income = "+";
      } else if (sign === MONEY_SIGN_TYPE.negative) {
        types.expense = "–";
      }

      return types[this.itemType] || "";
    },

    preparedMoney() {
      return new MoneyService().separatedMoney(Math.abs(this.item.sum));
    },

    currencySymbol() {
      return this.item.currencySymbol || "";
    },

    theme() {
      return getTheme();
    },

    moneyClasses() {
      return {
        "text-gray-600": this.item.sum === 0,
        "text-green-600": this.itemType === "income" && this.item.sum,
        "text-red-600": this.itemType === "expense" && this.item.sum,
        planned: this.planned,
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "size-xl": this.size === "xl",
        "size-2xl": this.size === "2xl",
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.money-block {
  @apply mb-1 flex items-center justify-end;
  @apply whitespace-nowrap;

  .sum {
    @apply ml-2;
  }

  .penny {
    @apply text-xs;
  }
}

.planned {
  @apply !text-opacity-75;

  .sum {
    &:before {
      content: "(";
    }

    &:after {
      content: ")";
    }
  }
}

.size-sm {
  .sum {
    @apply text-xs;
  }
}

.size-md {
  .sum {
    @apply text-sm;
  }
}

.size-lg {
  .sum {
    @apply text-base;
  }
}

.size-xl {
  .sum {
    @apply text-lg;
  }
}

.size-2xl {
  .sum {
    @apply text-4xl;
  }
}
</style>
