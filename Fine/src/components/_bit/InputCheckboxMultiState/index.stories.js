import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurMultiStateCheckbox from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Input Checkbox Multi State`,
  component: OurMultiStateCheckbox,
  args: {
    label: "Label",
    value: false,
    optionsData: [
      {
        code: false,
        label: "checkbox 1",
      },
      {
        code: true,
        label: "checkbox 2",
      },
      {
        code: null,
        label: "checkbox 3",
      },
    ],
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurMultiStateCheckbox },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurMultiStateCheckbox v-bind="$realProps" @input="onInput"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("onInput"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurMultiStateCheckbox },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurMultiStateCheckbox
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

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const value = DefaultTemplate.bind({});
value.args = { value: null };
