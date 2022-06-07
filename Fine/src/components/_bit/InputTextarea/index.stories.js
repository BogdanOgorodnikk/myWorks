import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurTextarea from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const COMPONENT_CLASS = "w-1/3";
const SLOT_NAMES = ["icon"];

export default {
  title: `${CHAPTERS.ui} / Input Textarea`,
  component: OurTextarea,
  args: {
    label: "Label",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
    value: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurTextarea },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTextarea 
        v-bind="$realProps"
        @blur="onBlur"
        @input="onInput"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurTextarea>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurTextarea, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTextarea
        v-bind="$realProps"
        @blur="onBlur"
        @input="onInput"
    >
      ${args.slotTemplate}
    </OurTextarea>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurTextarea },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASS}" v-for="(size, index) in sizes" :key="index">
        <OurTextarea
            :size="$realProps.size || size"
            v-bind="$realProps"
            @blur="onBlur"
            @input="onInput"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurTextarea>
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { placeholder: "some placeholder text" };

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error text" };

export const description = DefaultTemplate.bind({});
description.args = { description: "some description text" };

export const rows1 = DefaultTemplate.bind({});
rows1.args = { rows: 1 };

export const slotIcon = SlotTemplate.bind({});
slotIcon.args = {
  slotTemplate: `
    <template #icon>
      <OurSvgIcon
        name="Air-ballon"
        color="dark-50"
        size="sm"
      />
    </template>
  `,
};
