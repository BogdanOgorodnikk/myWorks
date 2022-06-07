import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurMoneyInput from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["base-currency-icon"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Input Money`,
  component: OurMoneyInput,
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurMoneyInput },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurMoneyInput
        v-bind="$realProps"
        @input="onInput"
        @keyup="onKeyup"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurMoneyInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
    onKeyup: action("keyup"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurMoneyInput },
  data: () => ({ variants: argTypes.type.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}" >
      <div v-for="(variant, index) in variants" :key="index">
        <OurMoneyInput
            :type="$realProps.type || variant"
            v-bind="$realProps"
            @input="onInput"
            @keyup="onKeyup"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurMoneyInput>
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
    onKeyup: action("keyup"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurMoneyInput, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurMoneyInput
        v-bind="$realProps"
        @input="onInput"
        @keyup="onKeyup"
    >
      ${args.slotTemplate}
    </OurMoneyInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
    onKeyup: action("keyup"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {
  type: "convertible",
  baseCurrencySymbol: "₴",
  value: {
    initialCurrency: {
      symbol: "₴",
      sum: "",
      placeholder: "",
      label: "UAH",
    },
    convertibleCurrency: {
      symbol: "$",
      sum: "",
      placeholder: "",
      label: "",
    },
    firstRate: {
      symbol: "$",
      sum: "29",
      placeholder: "",
      label: "USD",
    },
  },
};

export const type = VariantsTemplate.bind({});
type.args = {};

export const separatedInitialCurrency = DefaultTemplate.bind({});
separatedInitialCurrency.args = { type: "convertible", separatedInitialCurrency: true };

export const hideLabel = DefaultTemplate.bind({});
hideLabel.args = { hideLabel: true };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };

export const positiveOnly = DefaultTemplate.bind({});
positiveOnly.args = { positiveOnly: true };

export const withMinus = DefaultTemplate.bind({});
withMinus.args = { withMinus: true };

export const slotBaseCurrencyIcon = SlotTemplate.bind({});
slotBaseCurrencyIcon.args = {
  slotTemplate: `
    <template #base-currency-icon>
      <OurSvgIcon
        name="Money"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};
