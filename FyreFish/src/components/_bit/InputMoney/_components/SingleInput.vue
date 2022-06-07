<template>
  <div>
    <div class="money" :class="moneyClass">
      <label v-if="!hideLabel" class="money-label" :for="`moneyInput${id}`" :class="labelClass">
        {{ label }}
      </label>

      <t-input
        :id="`moneyInput${id}`"
        ref="initialCurrency"
        class="money-input"
        :placeholder="money.initialCurrency.placeholder"
        :value="money.initialCurrency.sum"
        data-cy="money-input-base-currency"
        :disabled="disabled"
        inputmode="decimal"
        @keyup="onKeyupInput"
      />

      <slot name="base-currency-icon" />
    </div>

    <div v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Cleave from "cleave.js";
import { getRandomId } from "@ilevel/our.service.ui";
import MoneyService, { SYMBOL_MINUS, DOUBLE_ZERO } from "@ilevel/our.service.money";
import TInput from "vue-tailwind/dist/t-input";

export default {
  components: {
    TInput,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    cleaveSettings: {
      type: Object,
      default: () => ({}),
    },

    hideLabel: {
      type: Boolean,
      default: false,
    },

    id: {
      type: String,
      default: () => getRandomId(),
    },

    error: {
      type: String,
      default: "",
    },

    numeralDecimalScale: {
      type: Number,
      default: 2,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    withMinus: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    money: {
      initialCurrency: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
    },
  }),

  computed: {
    moneyClass() {
      return {
        "error-input": this.error,
        disabled: this.disabled,
      };
    },

    labelClass() {
      return {
        "error-label": this.error,
      };
    },

    label() {
      const comma = this.money?.initialCurrency?.symbol ? "," : "";

      return `${this.money?.initialCurrency?.label}${comma} ${this.money?.initialCurrency?.symbol}`;
    },

    i18n() {
      return {
        amount: this.$te("component.moneyInput.amount")
          ? this.$t("component.moneyInput.amount")
          : this.$t("amount"),
      };
    },

    isShownMinus() {
      return this.withMinus ? SYMBOL_MINUS : "";
    },
  },

  watch: {
    money: {
      handler: "onChangeMoney",
      deep: true,
    },
    value: {
      handler: "onChangeValue",
      deep: true,
    },
    withMinus: "onChangeWithMinus",
  },

  created() {
    this.prefillInput();
  },

  mounted() {
    this.cleaveMoneyInput = new Cleave(this.$el.querySelector(`#moneyInput${this.id}`), {
      ...this.cleaveSettings,
      numeralDecimalScale: this.numeralDecimalScale,
      prefix: this.isShownMinus,
    });

    this.money.initialCurrency.sum = this.cleaveMoneyInput.getFormattedValue();
  },

  methods: {
    onChangeWithMinus() {
      this.cleaveMoneyInput = new Cleave(this.$el.querySelector(`#moneyInput${this.id}`), {
        ...this.cleaveSettings,
        numeralDecimalScale: this.numeralDecimalScale,
        prefix: this.isShownMinus,
      });

      this.money.initialCurrency.sum = this.cleaveMoneyInput.getFormattedValue();
    },

    prefillInput() {
      const separatedSum = new MoneyService().separatedMoney(
        Number(this.value?.initialCurrency?.sum)
      );

      const sum =
        separatedSum.penny === DOUBLE_ZERO
          ? separatedSum.integer
          : `${separatedSum.integer}${separatedSum.delimiter}${separatedSum.penny}`;

      this.money.initialCurrency = {
        symbol: this.value?.initialCurrency?.symbol || "",
        sum: Number(sum) === 0 ? "" : sum,
        placeholder: this.value?.initialCurrency?.placeholder,
        label: this.value?.initialCurrency?.label || this.i18n.amount,
      };
    },

    onChangeMoney() {
      let preparedMoney = {
        initialCurrency: {
          label: this.money.initialCurrency.label,
          symbol: this.money.initialCurrency.symbol,
          placeholder: this.money.initialCurrency.placeholder,
          sum: this.cleaveMoneyInput.getRawValue(),
        },
      };

      if (this.value?.convertibleCurrency) {
        preparedMoney.convertibleCurrency = {
          symbol: this.value?.convertibleCurrency?.symbol || "",
          sum: this.value?.convertibleCurrency?.sum || "",
          placeholder: this.value?.convertibleCurrency?.placeholder || "",
          label: this.value?.convertibleCurrency?.label || "",
        };
      }

      if (this.value?.firstRate) {
        preparedMoney.firstRate = {
          symbol: this.value?.firstRate?.symbol || "",
          sum: this.value?.firstRate?.sum || "",
          placeholder: this.value?.firstRate?.placeholder || "",
          label: this.value?.firstRate?.label || "",
        };
      }

      if (this.value?.secondRate) {
        preparedMoney.secondRate = {
          symbol: this.value?.secondRate?.symbol || "",
          sum: this.value?.secondRate?.sum || "",
          placeholder: this.value?.secondRate?.placeholder || "",
          label: this.value?.secondRate?.label || "",
        };
      }

      this.$emit("input", preparedMoney);
    },

    onChangeValue(value) {
      this.cleaveMoneyInput.setRawValue(value.initialCurrency.sum);
      this.money.initialCurrency.sum = this.cleaveMoneyInput.getFormattedValue();
      this.money.initialCurrency.symbol = value.initialCurrency.symbol;
    },

    onKeyupInput() {
      this.money.initialCurrency.sum = this.cleaveMoneyInput.getFormattedValue();

      this.$nextTick(() => {
        this.$emit("keyup");
      });
    },
  },
};
</script>

<i18n>
en:
  amount: "Amount"
ru:
  amount: "Сумма"
ua:
  amount: "Сума"
</i18n>

<style lang="postcss" scoped>
.money {
  @apply rounded-lg border border-gray-300 bg-white;
  @apply px-4 py-2.5;
  @apply transition-all duration-100;
  @apply relative;

  &:hover {
    @apply border-gray-400;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  &-label {
    @apply block;
    @apply whitespace-nowrap text-sm font-normal text-gray-500;
    @apply pb-0.5;
  }

  &-input {
    @apply text-base font-medium text-base-dark;
    @apply rounded-none border-0 shadow-none ring-0;
    @apply p-0;

    &:focus {
      @apply ring-0;
    }
  }
}

.error-message {
  @apply text-xs font-normal text-red-500;
  @apply mt-2 pl-4;
}

.error-label {
  @apply text-red-500;
}

.error-input {
  @apply border-red-300;

  &:hover {
    @apply border-red-400;
  }

  &:focus-within {
    @apply border-red-500 ring-red-100;
  }
}

.disabled {
  @apply bg-gray-100;
  @apply cursor-not-allowed;

  &::v-deep {
    .money-input {
      @apply bg-gray-100;
      @apply text-base-dark opacity-100;
    }
  }
}
</style>
