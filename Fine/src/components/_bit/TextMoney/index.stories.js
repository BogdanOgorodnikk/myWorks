import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { CREDIT_OBLIGATION, DEBIT_OBLIGATION } from "@ilevel/our.service.money";

import OurMoney from "./index";

const WRAPPER_CLASSES = "flex items-center space-x-6";
const COMPONENT_CLASSES = "flex justify-center w-1/6";

export default {
  title: `${CHAPTERS.ui} / Text Money`,
  component: OurMoney,
  args: {
    item: {
      type: "income",
      sum: 10,
      obligation: DEBIT_OBLIGATION,
      currencySymbol: "$",
    },
    icons: {
      creditTooltip: "some credit tooltip",
      debitTooltip: "some debit tooltip",
      size: "xs",
    },
    sign: "positive",
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurMoney },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${COMPONENT_CLASSES}">
      <OurMoney v-bind="$realProps" />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurMoney },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASSES}" v-for="(size, index) in sizes" :key="index">
        <OurMoney
          :size="$realProps.size || size"
          v-bind="$realProps"
        />
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SignsTemplate = (args, { argTypes }) => ({
  components: { OurMoney },
  data: () => ({ signs: argTypes.sign.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASSES}" v-for="(sign, index) in signs" :key="index">
        <OurMoney
          :sign="sign"
          v-bind="$realProps"
        />
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SymbolAlignTemplate = (args, { argTypes }) => ({
  components: { OurMoney },
  data: () => ({ symbolsAlign: argTypes.currencySymbolAlign.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASSES}" v-for="(symbolAlign, index) in symbolsAlign" :key="index">
        <OurMoney
          :currencySymbolAlign="$realProps.symbolAlign || symbolAlign"
          v-bind="$realProps"
        />
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const otherValues = DefaultTemplate.bind({});
otherValues.args = {
  item: {
    type: "expense",
    sum: -10,
    obligation: CREDIT_OBLIGATION,
    currencySymbol: "$",
  },
  sign: "negative",
};

export const sizes = SizesTemplate.bind({});
sizes.args = {
  item: {
    type: "income",
    sum: 0,
    obligation: "",
    currencySymbol: "$",
  },
  sign: "default",
};

export const sign = SignsTemplate.bind({});
sign.args = {};

export const currencySymbolAlign = SymbolAlignTemplate.bind({});
currencySymbolAlign.args = {};

export const planned = DefaultTemplate.bind({});
planned.args = { planned: true };

export const integer = DefaultTemplate.bind({});
integer.args = { integer: true };
