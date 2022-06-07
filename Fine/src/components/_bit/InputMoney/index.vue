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
        <!-- @slot Use it to add base currency icon. -->
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
        <!-- @slot Use it to add base currency icon. -->
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
    /**
     * Set input money value.
     */
    value: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Set component type.
     * @values single, range, convertible
     */
    type: {
      type: String,
      default: SINGLE,
    },

    /**
     * Make initial currency separated.
     */
    separatedInitialCurrency: {
      type: Boolean,
      default: false,
    },

    /**
     * Set base сurrency symbol for CONVERTIBLE type (For example "₴". It's possible to use the symbol of any currency).
     */
    baseCurrencySymbol: {
      type: String,
      default: "",
    },

    /**
     * Hide / show label.
     */
    hideLabel: {
      type: Boolean,
      default: false,
    },

    /**
     * Set error text.
     */
    error: {
      type: String,
      default: "",
    },

    /**
     * Allows only positive values.
     */
    positiveOnly: {
      type: Boolean,
      default: false,
    },

    /**
     * Show / hide minus sign.
     */
    withMinus: {
      type: Boolean,
      default: false,
    },

    /**
     * Set the numeral decimal scale after the comma.
     */
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

    /**
     * Set disabled options for component types.
     */
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
