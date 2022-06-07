<template>
  <div>
    <div class="wrapper">
      <div
        v-if="isShownSeparatedInitialCurrency"
        class="separated-money-wrapper"
        :class="[moneyClass, disabledClass.initialCurrency]"
      >
        <label
          v-if="!hideLabel"
          class="separated-money-label"
          :for="`initialCurrency${id}`"
          :class="labelClass"
        >
          {{ label.initialCurrency }}
        </label>

        <t-input
          :id="`initialCurrency${id}`"
          ref="initialCurrency"
          class="separated-money-input"
          :placeholder="money.initialCurrency.placeholder"
          :value="money.initialCurrency.sum"
          data-cy="money-input-base-currency"
          :disabled="disabled.initialCurrency"
          inputmode="decimal"
          @keyup="onKeyupInput('base')"
          @blur="onBlur"
        />
      </div>

      <div class="money" :class="moneyClass">
        <div class="money-block currency-block">
          <div
            v-if="isShownInitialCurrency"
            class="money-wrapper"
            :class="disabledClass.initialCurrency"
          >
            <label
              v-if="!hideLabel"
              class="money-label"
              :for="`initialCurrency${id}`"
              :class="labelClass"
            >
              {{ label.initialCurrency }}
            </label>

            <t-input
              :id="`initialCurrency${id}`"
              ref="initialCurrency"
              class="money-input"
              :class="initialCurrencyClass"
              :placeholder="money.initialCurrency.placeholder"
              :value="money.initialCurrency.sum"
              data-cy="money-input-base-currency"
              :disabled="disabled.initialCurrency"
              inputmode="decimal"
              @keyup="onKeyupInput('base')"
              @blur="onBlur"
            />

            <slot name="base-currency-icon" />
          </div>

          <div
            :id="`convertibleCurrencyBlock${id}`"
            class="money-wrapper convertible-block"
            :class="disabledClass.convertibleCurrency"
          >
            <label
              v-if="!hideLabel"
              class="money-label"
              :for="`convertibleCurrency${id}`"
              :class="labelClass"
            >
              {{ label.convertibleCurrency }}
            </label>

            <t-input
              :id="`convertibleCurrency${id}`"
              ref="convertibleInput"
              class="money-input"
              :placeholder="money.convertibleCurrency.placeholder"
              :value="money.convertibleCurrency.sum"
              data-cy="money-input-convertible-currency"
              :disabled="disabled.convertibleCurrency"
              inputmode="decimal"
              @keyup="onKeyupInput('convertible')"
              @blur="onBlur"
            />
          </div>
        </div>

        <div class="money-block">
          <div class="money-wrapper rate-block" :class="disabledClass.firstRate">
            <label
              v-if="!hideLabel"
              class="money-label"
              :for="`firstRate${id}`"
              :class="labelClass"
            >
              {{ label.firstRate }}
            </label>

            <t-input
              :id="`firstRate${id}`"
              class="money-input"
              :placeholder="money.firstRate.placeholder"
              :value="money.firstRate.sum"
              data-cy="money-input-first-rate"
              :disabled="disabled.firstRate"
              inputmode="decimal"
              @keyup="onKeyupInput('base')"
              @blur="onBlur"
            />
          </div>

          <div
            v-if="separatedInitialCurrency"
            class="money-wrapper rate-block second-rate"
            :class="disabledClass.secondRate"
          >
            <label
              v-if="!hideLabel"
              class="money-label"
              :for="`secondRate${id}`"
              :class="labelClass"
            >
              {{ label.secondRate }}
            </label>

            <t-input
              :id="`secondRate${id}`"
              class="money-input"
              :value="money.secondRate.sum"
              :placeholder="money.secondRate.placeholder"
              data-cy="money-input-second-rate"
              :disabled="disabled.secondRate"
              inputmode="decimal"
              @keyup="onKeyupInput('base')"
              @blur="onBlur"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Cleave from "cleave.js";
import MoneyService, { DOUBLE_ZERO, SYMBOL_MINUS } from "@ilevel/our.service.money";
import { getRandomId } from "@ilevel/our.service.ui";
import { mapGetters } from "vuex";
import TInput from "vue-tailwind/dist/t-input";

const FIND_SPACE_REG_EXP = /\s/g;
const FIND_COMMA_REG_EXP = /,/;
const DECIMAL_PLACES = 4;

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

    id: {
      type: String,
      default: () => getRandomId(),
    },

    hideLabel: {
      type: Boolean,
      default: false,
    },

    baseCurrencySymbol: {
      type: String,
      default: "",
    },

    separatedInitialCurrency: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    withMinus: {
      type: Boolean,
      default: false,
    },

    numeralDecimalScale: {
      type: Object,
      default: () => ({
        initialCurrency: 2,
        convertibleCurrency: 2,
        firstRate: 4,
        secondRate: 4,
      }),
    },

    disabled: {
      type: Object,
      default: () => ({
        initialCurrency: false,
        convertibleCurrency: false,
        firstRate: false,
        secondRate: false,
      }),
    },
  },

  data: () => ({
    isPreparedCleaveElements: false,
    money: {
      initialCurrency: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
      convertibleCurrency: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
      firstRate: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
      secondRate: {
        symbol: "",
        sum: "",
        placeholder: "",
        label: "",
      },
    },
    minConvertibleCurrencyWidth: "",
  }),

  computed: {
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    isShownSeparatedInitialCurrency() {
      return this.separatedInitialCurrency && !this.isMobileDevice;
    },

    isShownInitialCurrency() {
      return !this.separatedInitialCurrency || this.isMobileDevice;
    },

    disabledClass() {
      return {
        initialCurrency: this.disabled.initialCurrency ? "disabled" : "",
        convertibleCurrency: this.disabled.convertibleCurrency ? "disabled" : "",
        firstRate: this.disabled.firstRate ? "disabled" : "",
        secondRate: this.disabled.secondRate ? "disabled" : "",
      };
    },

    moneyClass() {
      return {
        "error-input": this.error,
      };
    },

    labelClass() {
      return {
        "error-label": this.error,
      };
    },

    label() {
      const initialCurrency = `${this.money?.initialCurrency?.label}, ${this.money?.initialCurrency?.symbol}`;
      const firstRate = `${this.money?.firstRate?.label}, ${this.money?.firstRate?.symbol}`;
      const secondRate = `${this.money?.secondRate?.label}, ${this.money?.secondRate?.symbol}`;
      const convertibleCurrency = `${this.money?.convertibleCurrency?.label},
       ${this.money?.convertibleCurrency?.symbol}`;

      return {
        initialCurrency,
        convertibleCurrency,
        firstRate,
        secondRate,
      };
    },

    initialCurrencyClass() {
      const isShownSlot = !!this.$slots["base-currency-icon"];

      return isShownSlot ? "base-currency-wrapper" : "";
    },

    i18n() {
      return {
        rate: this.$te("component.moneyInput.rate")
          ? this.$t("component.moneyInput.rate")
          : this.$t("rate"),
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

    separatedInitialCurrency: "onChangeSeparatedInitialCurrency",
    isPreparedCleaveElements: "onChangeCalculateBaseCurrency",
    "money.initialCurrency.symbol": "onChangeCalculateBaseCurrency",
    "money.convertibleCurrency.symbol": "onChangeCalculateBaseCurrency",
    "money.convertibleCurrency.sum": "onChangeConvertibleCurrencySum",
    withMinus: "onChangeWithMinus",
  },

  created() {
    this.prefillInput();
  },

  mounted() {
    this.cleaveInitialCurrency = new Cleave(this.$el.querySelector(`#initialCurrency${this.id}`), {
      ...this.cleaveSettings,
      numeralDecimalScale: this.numeralDecimalScale.initialCurrency,
      prefix: this.isShownMinus,
    });

    this.cleaveConvertibleCurrency = new Cleave(
      this.$el.querySelector(`#convertibleCurrency${this.id}`),
      {
        ...this.cleaveSettings,
        numeralDecimalScale: this.numeralDecimalScale.convertibleCurrency,
        prefix: this.isShownMinus,
      }
    );

    this.cleaveFirstRate = new Cleave(this.$el.querySelector(`#firstRate${this.id}`), {
      ...this.cleaveSettings,
      numeralPositiveOnly: true,
      numeralDecimalScale: this.numeralDecimalScale.firstRate,
    });

    if (this.separatedInitialCurrency) {
      this.cleaveSecondRate = new Cleave(this.$el.querySelector(`#secondRate${this.id}`), {
        ...this.cleaveSettings,
        numeralPositiveOnly: true,
        numeralDecimalScale: this.numeralDecimalScale.secondRate,
      });
    }

    this.money.initialCurrency.sum = this.cleaveInitialCurrency.getFormattedValue();
    this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
    this.money.firstRate.sum = this.cleaveFirstRate.getFormattedValue();

    if (this.separatedInitialCurrency) {
      this.money.secondRate.sum = this.cleaveSecondRate.getFormattedValue();
    }

    this.isPreparedCleaveElements = true;
  },

  methods: {
    onChangeWithMinus() {
      this.cleaveInitialCurrency = new Cleave(
        this.$el.querySelector(`#initialCurrency${this.id}`),
        {
          ...this.cleaveSettings,
          numeralDecimalScale: this.numeralDecimalScale.initialCurrency,
          prefix: this.isShownMinus,
        }
      );

      this.cleaveConvertibleCurrency = new Cleave(
        this.$el.querySelector(`#convertibleCurrency${this.id}`),
        {
          ...this.cleaveSettings,
          numeralDecimalScale: this.numeralDecimalScale.convertibleCurrency,
          prefix: this.isShownMinus,
        }
      );

      this.money.initialCurrency.sum = this.cleaveInitialCurrency.getFormattedValue();
      this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
    },

    onChangeCalculateBaseCurrency() {
      this.calculateCurrency("base");

      if (!this.separatedInitialCurrency) {
        this.calculateConvertibleInputWidth();
      }
    },

    onChangeConvertibleCurrencySum() {
      if (!this.separatedInitialCurrency) {
        this.calculateConvertibleInputWidth();
      }
    },

    onChangeSeparatedInitialCurrency() {
      const rateCleaveSettings = {
        ...this.cleaveSettings,
        numeralPositiveOnly: true,
        numeralDecimalScale: 4,
      };

      if (this.separatedInitialCurrency) {
        this.$nextTick(() => {
          this.cleaveSecondRate = new Cleave(
            this.$el.querySelector(`#secondRate${this.id}`),
            rateCleaveSettings
          );

          this.cleaveInitialCurrency = new Cleave(
            this.$el.querySelector(`#initialCurrency${this.id}`),
            this.cleaveSettings
          );
        });
      } else {
        this.$nextTick(() => {
          this.cleaveInitialCurrency = new Cleave(
            this.$el.querySelector(`#initialCurrency${this.id}`),
            this.cleaveSettings
          );
        });
      }
    },

    onBlur() {
      const firstRate = this.money.firstRate.sum;
      const initialCurrency = this.cleaveInitialCurrency.getRawValue();

      if (this.separatedInitialCurrency) {
        const secondRate = this.money.secondRate.sum;

        if (Number(secondRate) === 0 && Number(firstRate) === 0) {
          this.money.firstRate.sum = "";
          this.money.secondRate.sum = "";

          const currencyCoefficient =
            this.value.secondRate?.placeholder / this.value.firstRate?.placeholder;
          const convertibleCurrency = this.prepareSum(
            initialCurrency * Number(currencyCoefficient)
          );

          this.cleaveConvertibleCurrency.setRawValue(convertibleCurrency || "");
          this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
        } else if (Number(firstRate) === 0) {
          this.money.firstRate.sum = "";

          const currencyCoefficient =
            this.value.secondRate?.sum / this.value.firstRate?.placeholder;
          const convertibleCurrency = this.prepareSum(
            initialCurrency * Number(currencyCoefficient)
          );

          this.cleaveConvertibleCurrency.setRawValue(convertibleCurrency || "");
          this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
        } else if (Number(secondRate) === 0) {
          this.money.secondRate.sum = "";

          const currencyCoefficient =
            this.value.secondRate?.placeholder / this.value.firstRate?.sum;
          const convertibleCurrency = this.prepareSum(
            initialCurrency * Number(currencyCoefficient)
          );

          this.cleaveConvertibleCurrency.setRawValue(convertibleCurrency || "");
          this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
        }
      } else {
        if (Number(firstRate) === 0 && firstRate !== "") {
          this.money.firstRate.sum = "";
          let convertibleCurrency;

          if (this.baseCurrencySymbol === this.money.initialCurrency.symbol) {
            convertibleCurrency = this.prepareSum(
              initialCurrency / Number(this.value.firstRate?.placeholder)
            );
          } else {
            convertibleCurrency = this.prepareSum(
              initialCurrency * Number(this.value.firstRate?.placeholder)
            );
          }

          this.cleaveConvertibleCurrency.setRawValue(convertibleCurrency || "");
          this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
        }
      }
    },

    prefillInput() {
      let preparedInitialCurrency = "";
      let preparedConvertibleCurrency = "";
      let preparedFirstRate = "";

      if (this.value?.initialCurrency?.sum) {
        preparedInitialCurrency = this.prepareSum(this.value?.initialCurrency?.sum);
      }

      if (this.value?.convertibleCurrency?.sum) {
        preparedConvertibleCurrency = this.prepareSum(this.value?.convertibleCurrency?.sum);
      }

      if (this.value?.firstRate?.sum) {
        preparedFirstRate = this.prepareSum(this.value?.firstRate?.sum, DECIMAL_PLACES);
      }

      this.money.initialCurrency = {
        symbol: this.value?.initialCurrency?.symbol || "",
        sum: preparedInitialCurrency,
        placeholder: this.value?.initialCurrency?.placeholder,
        label: this.value?.initialCurrency?.label || this.i18n.amount,
      };

      this.money.convertibleCurrency = {
        symbol: this.value?.convertibleCurrency?.symbol || "",
        sum: preparedConvertibleCurrency,
        placeholder: this.value?.convertibleCurrency?.placeholder,
        label: this.value?.convertibleCurrency?.label || this.i18n.amount,
      };

      this.money.firstRate = {
        symbol: this.value?.firstRate?.symbol || "",
        sum: preparedFirstRate,
        placeholder: this.prepareSum(this.value?.firstRate?.placeholder, DECIMAL_PLACES),
        label: this.value?.firstRate?.label || this.i18n.rate,
      };

      if (this.separatedInitialCurrency) {
        let preparedSecondRate = "";

        if (this.value?.secondRate?.sum) {
          preparedSecondRate = this.prepareSum(this.value?.secondRate?.sum, DECIMAL_PLACES);
        }

        this.money.secondRate = {
          symbol: this.value?.secondRate?.symbol || "",
          sum: preparedSecondRate,
          placeholder: this.prepareSum(this.value?.secondRate?.placeholder, DECIMAL_PLACES),
          label: this.value?.secondRate?.label || this.i18n.rate,
        };
      }
    },

    onChangeMoney() {
      let newMoney = {};

      let preparedInitialCurrency = this.money.initialCurrency.sum.replace(FIND_SPACE_REG_EXP, "");

      preparedInitialCurrency = preparedInitialCurrency.replace(FIND_COMMA_REG_EXP, ".");

      newMoney.initialCurrency = {
        sum: this.cleaveInitialCurrency?.getRawValue() || preparedInitialCurrency,
        symbol: this.money.initialCurrency.symbol,
      };

      newMoney.convertibleCurrency = {
        sum: this.cleaveConvertibleCurrency?.getRawValue(),
        symbol: this.money.convertibleCurrency.symbol,
      };

      this.cleaveFirstRate.setRawValue(this.money.firstRate.sum);

      newMoney.firstRate = {
        sum: this.cleaveFirstRate.getRawValue(),
        symbol: this.money.firstRate.symbol,
        placeholder: this.value.firstRate?.placeholder,
      };

      if (this.separatedInitialCurrency) {
        this.cleaveSecondRate?.setRawValue(this.money.secondRate.sum);

        newMoney.secondRate = {
          sum: this.cleaveSecondRate?.getRawValue(),
          symbol: this.money.secondRate.symbol,
          placeholder: this.value.secondRate?.placeholder,
        };
      }

      this.$emit("input", newMoney);
    },

    onChangeValue(value) {
      if (value.initialCurrency.symbol !== this.money.initialCurrency.symbol) {
        this.money.initialCurrency.symbol = value.initialCurrency?.symbol;
      }

      if (value.convertibleCurrency.symbol !== this.money.convertibleCurrency.symbol) {
        this.money.convertibleCurrency.symbol = value.convertibleCurrency?.symbol;
      }

      if (value.firstRate.symbol !== this.money.firstRate.symbol) {
        const firstRateSum = this.prepareSum(value?.firstRate?.sum, DECIMAL_PLACES);

        this.money.firstRate.sum = Number(firstRateSum) === 0 ? "" : firstRateSum;
        this.money.firstRate.symbol = value.firstRate?.symbol;
        this.money.firstRate.placeholder = this.prepareSum(
          value?.firstRate?.placeholder,
          DECIMAL_PLACES
        );

        this.money.convertibleCurrency.sum = this.prepareSum(value?.convertibleCurrency?.sum);
        this.cleaveConvertibleCurrency.setRawValue(value?.convertibleCurrency?.sum);
      }

      if (
        this.separatedInitialCurrency &&
        value.secondRate?.symbol !== this.money.secondRate?.symbol
      ) {
        const secondRateSum = this.prepareSum(value?.secondRate?.sum, DECIMAL_PLACES);

        this.money.secondRate.label = value.secondRate?.label || this.money.secondRate.label;
        this.money.secondRate.sum = Number(secondRateSum) === 0 ? "" : secondRateSum;
        this.money.secondRate.symbol = value.secondRate?.symbol;
        this.money.secondRate.placeholder = this.prepareSum(
          value?.secondRate?.placeholder,
          DECIMAL_PLACES
        );

        this.money.convertibleCurrency.sum = this.prepareSum(value?.convertibleCurrency?.sum);
        this.cleaveConvertibleCurrency.setRawValue(value?.convertibleCurrency?.sum);
      }
    },

    prepareSum(sum, decimalPlaces) {
      const separatedSum = new MoneyService().separatedMoney(Number(sum), decimalPlaces);

      return separatedSum.penny === DOUBLE_ZERO
        ? separatedSum.integer
        : `${separatedSum.integer}${separatedSum.delimiter}${separatedSum.penny}`;
    },

    onKeyupInput(currencyType) {
      this.calculateCurrency(currencyType);

      this.money.initialCurrency.sum = this.cleaveInitialCurrency.getFormattedValue();
      this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
      this.money.firstRate.sum = this.cleaveFirstRate.getFormattedValue();

      if (this.separatedInitialCurrency) {
        this.money.secondRate.sum = this.cleaveSecondRate.getFormattedValue();
      }
    },

    calculateConvertibleInputWidth() {
      if (this.separatedInitialCurrency || this.isMobileDevice) {
        return;
      }

      if (!this.minConvertibleCurrencyWidth) {
        this.minConvertibleCurrencyWidth = this.$el.querySelector(
          `#convertibleCurrencyBlock${this.id}`
        ).clientWidth;
      }

      const length = this.cleaveConvertibleCurrency.element.value.length;
      const minWidth = this.minConvertibleCurrencyWidth;
      const maxWidth = this.$el.querySelector(".money").offsetWidth;
      const initialCurrencyWidth = this.$el.querySelector(`#initialCurrency${this.id}`).offsetWidth;

      const maxConvertibleCurrencyWidth = maxWidth - initialCurrencyWidth;
      const oneSymbolPixelCount = 12;

      let width = length * oneSymbolPixelCount;

      if (minWidth > width) {
        width = minWidth;
      }

      if (width >= maxConvertibleCurrencyWidth) {
        return (this.$el.querySelector(
          `#convertibleCurrencyBlock${this.id}`
        ).style.width = `${maxConvertibleCurrencyWidth}px`);
      }

      this.$el.querySelector(`#convertibleCurrencyBlock${this.id}`).style.width = `${width}px`;

      const currentWidth = this.$el.querySelector(
        `#convertibleCurrencyBlock${this.id}`
      ).offsetWidth;

      if (minWidth >= currentWidth) {
        this.$el.querySelector(`#convertibleCurrencyBlock${this.id}`).style.width = `${minWidth}px`;
      }
    },

    calculateCurrency(currencyType) {
      let initialCurrency = this.cleaveInitialCurrency.getRawValue();
      let convertibleCurrency = this.cleaveConvertibleCurrency.getRawValue();
      let firstRate = Number(this.cleaveFirstRate.getRawValue());

      let secondRate;
      let secondRatePlaceholder;
      let firstRatePlaceholder = this.money.firstRate.placeholder.replace(FIND_SPACE_REG_EXP, "");

      firstRatePlaceholder = firstRatePlaceholder.replace(FIND_COMMA_REG_EXP, ".");

      if (this.separatedInitialCurrency) {
        secondRate = Number(this.cleaveSecondRate?.getRawValue());
        secondRatePlaceholder = this.money.secondRate.placeholder.replace(FIND_SPACE_REG_EXP, "");
        secondRatePlaceholder = secondRatePlaceholder.replace(FIND_COMMA_REG_EXP, ".");
      }

      if (currencyType === "base") {
        let convertibleCurrency;

        if (!initialCurrency) {
          return this.cleaveConvertibleCurrency.setRawValue("");
        }

        if (this.separatedInitialCurrency) {
          const currencyCoefficient =
            (secondRate || secondRatePlaceholder) / (firstRate || firstRatePlaceholder);

          convertibleCurrency = initialCurrency * currencyCoefficient;
        } else {
          if (this.baseCurrencySymbol === this.money.initialCurrency.symbol) {
            convertibleCurrency = initialCurrency / (firstRate || firstRatePlaceholder);
          } else {
            convertibleCurrency = initialCurrency * (firstRate || firstRatePlaceholder);
          }
        }

        this.cleaveConvertibleCurrency.setRawValue(this.prepareSum(convertibleCurrency));
        this.money.convertibleCurrency.sum = this.cleaveConvertibleCurrency.getFormattedValue();
      }

      if (currencyType === "convertible") {
        let initialCurrency;

        if (!convertibleCurrency) {
          return this.cleaveInitialCurrency.setRawValue(initialCurrency);
        }

        if (this.separatedInitialCurrency) {
          const currencyCoefficient =
            (secondRate || secondRatePlaceholder) / (firstRate || firstRatePlaceholder);

          initialCurrency = convertibleCurrency / currencyCoefficient;
        } else {
          if (this.baseCurrencySymbol === this.money.initialCurrency.symbol) {
            initialCurrency = convertibleCurrency * (firstRate || firstRatePlaceholder);
          } else {
            initialCurrency = convertibleCurrency / (firstRate || firstRatePlaceholder);
          }
        }

        this.cleaveInitialCurrency.setRawValue(this.prepareSum(initialCurrency));
        this.money.initialCurrency.sum = this.cleaveInitialCurrency.getFormattedValue();

        this.calculateConvertibleInputWidth();
      }
    },
  },
};
</script>

<i18n>
en:
  rate: "Rate"
  amount: "Amount"
ru:
  rate: "Курс"
  amount: "Сумма"
ua:
  rate: "Курс"
  amount: "Сума"
</i18n>

<style lang="postcss" scoped>
.wrapper {
  @apply flex;
}

.base-currency-wrapper {
  @apply pr-8 !important;
}

.money {
  @apply flex w-full flex-col md:flex-row;
  @apply rounded-lg border border-gray-300 bg-white;
  @apply transition-all duration-100;
  @apply overflow-hidden;

  &:hover {
    @apply border-gray-400;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  &-block {
    @apply flex;

    &:first-child {
      @apply border-b border-dashed border-gray-300 md:border-b-0;
    }
  }

  &-wrapper {
    @apply px-4 py-2.5;
    @apply relative;
    @apply w-full md:w-auto;

    &:first-child {
      @apply flex-auto;
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

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &:focus {
      @apply ring-0;
    }
  }
}

.separated-money {
  &-wrapper {
    @apply rounded-lg border border-gray-300 bg-white;
    @apply mr-6 px-4 pt-2 pb-2.5;
    @apply w-2/4;
    @apply transition-all duration-100;

    &:hover {
      @apply border-gray-400;
    }

    &:focus-within {
      @apply border-gray-500 ring-4 ring-gray-300;
    }
  }

  &-input {
    @apply text-base font-medium text-base-dark;
    @apply rounded-none border-0 shadow-none ring-0;
    @apply p-0;

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &:focus {
      @apply ring-0;
    }
  }

  &-label {
    @apply block;
    @apply whitespace-nowrap text-sm font-normal text-gray-500;
    @apply pb-0.5;
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

.rate-block {
  @apply w-full md:w-[5.75rem];
}

.convertible-block {
  @apply w-full pr-4 md:w-24;

  &::before {
    content: "";
    @apply absolute top-2 -left-px;
    @apply bg-gray-300;
    @apply h-[2.625rem] w-px;
  }

  &::after {
    content: "";
    @apply absolute top-2 right-0;
    @apply bg-gray-300;
    @apply h-0 w-0 md:h-[2.625rem] md:w-px;
  }
}

.second-rate {
  &::before {
    content: "";
    @apply absolute top-2 -left-px;
    @apply bg-gray-300;
    @apply h-[2.625rem] w-px;
  }
}

.currency-block {
  @apply flex-auto overflow-hidden;
}

.disabled {
  @apply bg-gray-100;
  @apply cursor-not-allowed;

  &::v-deep {
    .money-input,
    .separated-money-input {
      @apply bg-gray-100;
      @apply text-base-dark opacity-100;

      &:focus {
        @apply ring-0;
      }
    }
  }
}
</style>
