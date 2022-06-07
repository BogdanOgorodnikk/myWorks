<template>
  <div :class="theme">
    <div class="money-block" :class="moneyClass">
      <OurSvgIcon v-if="isDebitObligation" name="Debit" size="2xs" />

      <OurSvgIcon v-if="isCreditObligation" name="Credit" size="2xs" />

      <span :data-cy="`${itemType}-sum`" class="sum">
        <span v-if="currencySymbolPosition.left" class="currency-symbol">
          {{ currencySymbol }}
        </span>

        <span v-if="item.sum">{{ typeSymbol }}</span>

        <span>{{ preparedMoney.integer }}</span>

        <span v-if="!integer" class="penny"
          >{{ preparedMoney.delimiter }}{{ preparedMoney.penny }}
        </span>

        <span v-if="currencySymbolPosition.right" class="currency-symbol">
          {{ currencySymbol }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import MoneyService from "@ilevel/our.service.money";
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurMoney",
  components: {
    OurSvgIcon,
  },

  props: {
    item: {
      type: Object,
      default: () => ({
        type: "income",
        sum: 0,
        obligation: "debit",
        currencySymbol: "",
      }),
      required: true,
    },

    planned: {
      type: Boolean,
      default: false,
    },

    integer: {
      type: Boolean,
      default: false,
    },

    negativeSign: {
      type: Boolean,
      default: true,
    },

    positiveSign: {
      type: Boolean,
      default: true,
    },

    currencySymbolAlign: {
      type: String,
      default: "right",
    },

    size: {
      type: String,
      default: "md",
    },
  },

  computed: {
    isDebitObligation() {
      return this.item.obligation === "debit";
    },

    isCreditObligation() {
      return this.item.obligation === "credit";
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

      if (this.positiveSign) {
        types.income = "+";
      }

      if (this.negativeSign) {
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

    moneyClass() {
      return {
        "text-gray-600": this.item.sum === 0,
        "text-green-600": this.itemType === "income" && this.item.sum,
        "text-red-600": this.itemType === "expense" && this.item.sum,
        planned: this.planned,
        "size-xs": this.size === "xs",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "size-xl": this.size === "xl",
        "size-xxl": this.size === "xxl",
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

.size {
  &-xs {
    .sum {
      @apply text-xs;
    }
  }

  &-md {
    .sum {
      @apply text-sm;
    }
  }

  &-lg {
    .sum {
      @apply text-base;
    }
  }

  &-xl {
    .sum {
      @apply text-lg;
    }
  }

  &-xxl {
    .sum {
      @apply text-4xl;
    }
  }
}

.planned {
  .sum {
    @apply ml-0;

    &:before {
      content: "( ";
    }

    &:after {
      content: ")";
    }
  }
}
</style>
