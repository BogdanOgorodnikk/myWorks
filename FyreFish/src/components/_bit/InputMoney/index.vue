<template>
  <div>
    <SingleInput
      v-if="isShownInput.single"
      ref="input"
      v-model="form"
      :hide-label="hideLabel"
      :cleave-settings="cleaveSettings"
      :error="error"
      :numeral-decimal-scale="numeralDecimalScale.initialCurrency"
      :disabled="disabled.initialCurrency"
      :with-minus="withMinus"
      @keyup="onKeyupInput"
    >
      <template #base-currency-icon>
        <slot name="base-currency-icon" />
      </template>
    </SingleInput>

    <RangeInput
      v-if="isShownInput.range"
      v-model="form"
      :hide-label="hideLabel"
      :cleave-settings="cleaveSettings"
      :error="error"
      :numeral-decimal-scale="numeralDecimalScale"
      :disabled="disabled"
    />

    <ConvertibleInput
      v-if="isShownInput.convertible"
      ref="input"
      v-model="form"
      :hide-label="hideLabel"
      :cleave-settings="cleaveSettings"
      :separated-initial-currency="separatedInitialCurrency"
      :error="error"
      :base-currency-symbol="baseCurrencySymbol"
      :numeral-decimal-scale="numeralDecimalScale"
      :disabled="disabled"
      :with-minus="withMinus"
    >
      <template #base-currency-icon>
        <slot name="base-currency-icon" />
      </template>
    </ConvertibleInput>
  </div>
</template>

<script>
import SingleInput from "./_components/SingleInput";
import RangeInput from "./_components/RangeInput";
import ConvertibleInput from "./_components/ConvertibleInput";

const SINGLE = "single";
const RANGE = "range";
const CONVERTIBLE = "convertible";

export default {
  components: {
    ConvertibleInput,
    RangeInput,
    SingleInput,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    type: {
      type: String,
      default: SINGLE,
    },

    separatedInitialCurrency: {
      type: Boolean,
      default: false,
    },

    baseCurrencySymbol: {
      type: String,
      default: "",
    },

    hideLabel: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    positiveOnly: {
      type: Boolean,
      default: false,
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
        startRange: 2,
        endRange: 2,
      }),
    },

    disabled: {
      type: Object,
      default: () => ({
        initialCurrency: false,
        convertibleCurrency: false,
        firstRate: false,
        secondRate: false,
        startRange: false,
        endRange: false,
      }),
    },
  },

  data: () => ({
    form: {},
    cleaveSettings: {
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
      delimiter: " ",
      numeralDecimalMark: ",",
      numeralPositiveOnly: false,
      rawValueTrimPrefix: true,
    },
  }),

  computed: {
    isShownInput() {
      return {
        single: this.type === SINGLE,
        range: this.type === RANGE,
        convertible: this.type === CONVERTIBLE,
      };
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  created() {
    this.cleaveSettings.numeralPositiveOnly = this.positiveOnly;
    this.form = this.value;
  },

  methods: {
    onChangeForm(form) {
      this.$emit("input", form);
    },

    onKeyupInput() {
      this.$emit("keyup");
    },
  },
};
</script>
