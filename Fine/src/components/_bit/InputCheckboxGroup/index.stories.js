import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurCheckboxGroup from "./index";

export default {
  title: `${CHAPTERS.ui} / Input Checkbox Group`,
  component: OurCheckboxGroup,
  args: {
    label: "Label",
    options: [
      {
        label: "checkbox 1",
        description: "some description 1",
        id: "1",
      },
      {
        label: "checkbox 2",
        description: "some description 2",
        id: "2",
      },
      {
        label: "checkbox 3",
        description: "some description 3",
        id: "3",
      },
    ],
    value: ["1"],
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurCheckboxGroup },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurCheckboxGroup v-bind="$realProps" @input="onInput"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do value change dynamically
    onInput: action("onInput"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };
