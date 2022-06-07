import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurButtonExtendItem from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Button Extend Item`,
  component: OurButtonExtendItem,
  args: {
    text: "Button Extend Item",
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurButtonExtendItem },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurButtonExtendItem v-bind="$realProps" @click="onClick" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurButtonExtendItem },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurButtonExtendItem
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="$realProps.text || size"
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
Sizes.args = { text: "" };

export const Disabled = DefaultTemplate.bind({});
Disabled.args = { disabled: true };

export const Icon = DefaultTemplate.bind({});
Icon.args = { iconName: "Active-call" };
