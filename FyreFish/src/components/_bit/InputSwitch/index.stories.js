import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurSwitch from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Input Switch`,
  component: OurSwitch,
  args: {
    value: false,
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurSwitch },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurSwitch v-bind="$realProps" @input="onInput" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput() {
      action("input");
      this.value = !this.value;
    },
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurSwitch },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSwitch
        v-for="(variant, index) in variants"
        :variant="$realProps.variant || variant"
        v-bind="$realProps"
        @input="onInput"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput() {
      action("input");
      this.value = !this.value;
    },
  },
});

const LabelVariantsTemplate = (args, { argTypes }) => ({
  components: { OurSwitch },
  data: () => ({ labelVariants: argTypes.labelVariant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSwitch
        v-for="(labelVariant, index) in labelVariants"
        :labelVariant="$realProps.variant || labelVariant"
        v-bind="$realProps"
        @input="onInput"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput() {
      action("input");
      this.value = !this.value;
    },
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurSwitch },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSwitch
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        v-bind="$realProps"
        @input="onInput"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput() {
      action("input");
      this.value = !this.value;
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = { value: true, withIcon: true };

export const LabelVariants = LabelVariantsTemplate.bind({});
LabelVariants.args = { value: true };

export const Sizes = SizesTemplate.bind({});
Sizes.args = { text: "" };

export const Icon = DefaultTemplate.bind({});
Icon.args = { withIcon: true };
