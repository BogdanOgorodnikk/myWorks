import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurCheckbox from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Input Checkbox`,
  component: OurCheckbox,
  args: {
    label: "Label",
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurCheckbox },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurCheckbox v-bind="$realProps" @input="onInput"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("onInput"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurCheckbox },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurCheckbox
          v-for="(size, index) in sizes"
          :size="$realProps.size || size"
          :label="size"
          :key="index"
          v-bind="$realProps"
          @input="onInput"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("onInput"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Sizes = SizesTemplate.bind({});
Sizes.args = {};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = { disabled: true };
