import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurLink from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Button Link`,
  component: OurLink,
  args: {
    text: "Button Link",
  },
  argTypes: {
    route: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurLink },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurLink v-bind="$realProps"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurLink },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurLink
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
  components: { OurLink },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurLink
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="$realProps.text || size"
        v-bind="$realProps"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = { text: "" };

export const Sizes = SizesTemplate.bind({});
Sizes.args = { text: "" };

export const Dashed = VariantsTemplate.bind({});
Dashed.args = { dashed: true };

export const URL = DefaultTemplate.bind({});
URL.args = { url: "https://storybook.js.org/docs/react/get-started/introduction" };

export const URLTargetBlank = DefaultTemplate.bind({});
URLTargetBlank.args = {
  url: "https://storybook.js.org/docs/react/get-started/introduction",
  targetBlank: true,
};
