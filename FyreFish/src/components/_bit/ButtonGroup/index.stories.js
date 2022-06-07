import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurButtonGroup from "./index";

export default {
  title: `${CHAPTERS.ui} / Button Group`,
  component: OurButtonGroup,
  args: {
    name: "name",
    options: [
      { value: "value-1", name: "Active-call", label: "label 1" },
      { value: "value-2", name: "Add-music", label: "label 2" },
      { value: "value-3", name: "Add-user", label: "label 3" },
      { value: "value-4", name: "Address-card", label: "label 4" },
    ],
  },
  argTypes: {
    value: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurButtonGroup },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurButtonGroup v-bind="$realProps" @input="onInput"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Icon = DefaultTemplate.bind({});
Icon.args = {
  options: [
    { value: "value-1", name: "Active-call" },
    { value: "value-2", name: "Add-music" },
    { value: "value-3", name: "Add-user" },
    { value: "value-4", name: "Address-card" },
  ],
};

export const Label = DefaultTemplate.bind({});
Label.args = {
  options: [
    { value: "value-1", label: "label 1" },
    { value: "value-2", label: "label 2" },
    { value: "value-3", label: "label 3" },
    { value: "value-4", label: "label 4" },
  ],
};
