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
      return `Link ${value}`;
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const variants = VariantsTemplate.bind({});
variants.args = { text: "" };

export const sizes = SizesTemplate.bind({});
sizes.args = { text: "" };

export const dashed = VariantsTemplate.bind({});
dashed.args = { dashed: true };

export const url = DefaultTemplate.bind({});
url.args = { url: "https://storybook.js.org/docs/react/get-started/introduction" };

export const urlTargetBlank = DefaultTemplate.bind({});
urlTargetBlank.args = {
  url: "https://storybook.js.org/docs/react/get-started/introduction",
  targetBlank: true,
};
