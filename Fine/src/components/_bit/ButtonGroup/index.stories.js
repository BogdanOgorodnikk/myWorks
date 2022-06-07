import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurButtonGroup from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Button Group`,
  component: OurButtonGroup,
  args: {
    value: "1",
    options: [
      { value: "1", name: "Active-call", label: "label 1" },
      { value: "2", name: "Add-music", label: "label 2" },
      { value: "3", name: "Add-user", label: "label 3" },
      { value: "4", name: "Address-card", label: "label 4" },
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

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurButtonGroup },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurButtonGroup
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="$realProps.text || size"
        v-bind="$realProps"
        @input="onInput"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurButtonGroup>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = { name: "first name" };

export const sizes = SizesTemplate.bind({});
sizes.args = {
  name: "second name",
  options: [
    { value: "5", name: "Active-call" },
    { value: "6", name: "Add-music" },
  ],
};

export const icon = DefaultTemplate.bind({});
icon.args = {
  name: "third name",
  value: "7",
  options: [
    { value: "7", name: "Active-call" },
    { value: "8", name: "Add-music" },
  ],
};

export const label = DefaultTemplate.bind({});
label.args = {
  name: "third name",
  value: "9",
  options: [
    { value: "9", label: "label 1" },
    { value: "10", label: "label 2" },
  ],
};
