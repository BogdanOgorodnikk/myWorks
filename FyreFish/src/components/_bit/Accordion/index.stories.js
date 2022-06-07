import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurAccordion from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Accordion`,
  component: OurAccordion,
  args: {
    title: "some title",
    items: [
      { title: "title 1", description: "first description" },
      { title: "title 2", description: "second description" },
    ],
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurAccordion },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurAccordion v-bind="$realProps" @click="onClick" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurAccordion },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurAccordion
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :title="size"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Sizes = SizesTemplate.bind({});
Sizes.args = {};
