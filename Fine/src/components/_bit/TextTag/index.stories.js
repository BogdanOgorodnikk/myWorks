import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurTag from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Tag`,
  component: OurTag,
  args: {
    text: "Tag",
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurTag },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTag v-bind="$realProps" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurTag },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurTag   
          v-for="(variant, index) in variants"
          :variant="$realProps.variant || variant"
          :text="$realProps.text || variant"
          v-bind="$realProps"
          :key="index" 
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurTag },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurTag
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="getText(size)"
        v-bind="$realProps"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    getText(value) {
      return `Tag ${value}`;
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = { text: "" };

export const Sizes = SizesTemplate.bind({});
Sizes.args = { text: "" };

export const Tooltip = DefaultTemplate.bind({});
Tooltip.args = { tooltipText: "some tooltip text" };
