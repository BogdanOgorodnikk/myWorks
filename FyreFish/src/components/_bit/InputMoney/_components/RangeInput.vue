<template>
  <div>
    <div class="money" :class="moneyClass">
      <div class="money-wrapper" :class="disabledClass.startRange">
        <label v-if="!hideLabel" class="money-label" :for="`startRange${id}`" :class="labelClass">
          {{ label.startRange }}
        </label>

        <t-input
          :id="`startRange${id}`"
          class="money-input"
          :placeholder="money.startRange.placeholder"
          :value="money.startRange.sum"
          data-cy="start-money-range-input"
          :disabled="disabled.startRange"
          inputmode="decimal"
          @change="onChangeInput"
        />
      </div>

      <div class="money-wrapper" :class="disabledClass.endRange">
        <label v-if="!hideLabel" class="money-label" :for="`endRange${id}`" :class="labelClass">
          {{ label.endRange }}
        </label>

        <t-input
          :id="`endRange${id}`"
          class="money-input"
          :placeholder="money.endRange.placeholder"
          :value="money.endRange.sum"
          data-cy="end-money-range-input"
          :disabled="disabled.endRange"
          inputmode="decimal"
          @change="onChangeInput"
        />
      </div>
    </div>

    <div v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Cleave from "cleave.js";
import { getRandomId } from "@ilevel/our.service.ui";
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
      type: Object,
      default: () => ({
        startRange: 2,
        endRange: 2,
      }),
    },

    disabled: {
      type: Object,
      default: () => ({
        startRange: false,
        endRange: false,
      }),
    },
  },

  data: () => ({
    money: {
      startRange: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
      endRange: {
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
      };
    },

    disabledClass() {
      return {
        startRange: this.disabled.startRange ? "disabled" : "",
        endRange: this.disabled.endRange ? "disabled" : "",
      };
    },

    labelClass() {
      return {
        "error-label": this.error,
      };
    },

    i18n() {
      return {
        amount: this.$te("component.moneyInput.amount")
          ? this.$t("component.moneyInput.amount")
          : this.$t("amount"),
      };
    },

    label() {
      const separatedSymbol =
        this.money?.startRange?.symbol || this.money?.startRange?.symbol ? "," : "";

      const startRange = `${this.money?.startRange?.label}${separatedSymbol} ${this.money?.startRange?.symbol}`;
      const endRange = `${this.money?.endRange?.label}${separatedSymbol} ${this.money?.endRange?.symbol}`;

      return {
        startRange,
        endRange,
      };
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
  },

  created() {
    this.prefillInput();
  },

  mounted() {
    this.cleaveStartRange = new Cleave(this.$el.querySelector(`#startRange${this.id}`), {
      ...this.cleaveSettings,
      numeralDecimalScale: this.numeralDecimalScale.startRange,
    });

    this.cleaveStartRange.setRawValue(this.money.startRange.sum);

    this.cleaveEndRange = new Cleave(this.$el.querySelector(`#endRange${this.id}`), {
      ...this.cleaveSettings,
      numeralDecimalScale: this.numeralDecimalScale.endRange,
    });

    this.cleaveEndRange.setRawValue(this.money.endRange.sum);
  },

  methods: {
    prefillInput() {
      this.money.startRange = {
        symbol: this.value?.startRange?.symbol || "",
        sum: this.value?.startRange?.sum,
        placeholder: this.value?.startRange?.placeholder,
        label: this.value?.startRange?.label || this.i18n.amount,
      };

      this.money.endRange = {
        symbol: this.value?.endRange?.symbol || "",
        sum: this.value?.endRange?.sum,
        placeholder: this.value?.endRange?.placeholder,
        label: this.value?.endRange?.label || this.i18n.amount,
      };
    },

    onChangeMoney() {
      let newMoney = {};

      newMoney.startRange = this.cleaveStartRange.getRawValue();

      newMoney.endRange = this.cleaveEndRange.getRawValue();

      this.$emit("input", newMoney);
    },

    onChangeValue(value) {
      this.cleaveStartRange.setRawValue(value.startRange);
      this.cleaveEndRange.setRawValue(value.endRange);
    },

    onChangeInput() {
      this.money.startRange.sum = this.cleaveStartRange.getFormattedValue();

      this.money.endRange.sum = this.cleaveEndRange.getFormattedValue();
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
  @apply flex w-full;
  @apply rounded-lg border border-gray-300 bg-white;
  @apply transition-all duration-100;
  @apply overflow-hidden;

  &:hover {
    @apply border-gray-400;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  &-wrapper {
    @apply flex-auto;
    @apply px-4 py-2.5;
    @apply relative;

    &:first-child {
      &::after {
        content: "";
        @apply absolute top-2 right-0;
        @apply bg-gray-300;
        @apply h-[2.625rem] w-px;
      }
    }
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
