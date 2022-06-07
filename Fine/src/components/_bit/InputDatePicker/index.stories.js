import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurDatePicker from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["icon", "right"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Input Date Picker`,
  component: OurDatePicker,
  args: {
    label: "Label",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurDatePicker },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurDatePicker v-bind="$realProps" @input="onInput">
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurDatePicker>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurDatePicker },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDatePicker
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :label="getLable(size)"
        v-bind="$realProps"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurDatePicker>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    getLable(value) {
      return `Size ${value}`;
    },
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurDatePicker, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurDatePicker v-bind="$realProps">
      ${args.slotTemplate}
    </OurDatePicker>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const sizes = SizesTemplate.bind({});
sizes.args = { label: "" };

export const description = DefaultTemplate.bind({});
description.args = { description: "some description" };

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { placeholder: "some placeholder" };

export const value = DefaultTemplate.bind({});
value.args = { value: 1645653600 };

export const customDateFormat = DefaultTemplate.bind({});
customDateFormat.args = { customDateFormat: "d.m.Y", value: 1645653600 };

export const slotIcon = SlotTemplate.bind({});
slotIcon.args = {
  slotTemplate: `
    <template #icon>
      <OurSvgIcon
        name="Calculator"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};

export const slotRight = SlotTemplate.bind({});
slotRight.args = {
  slotTemplate: `
    <template #right>
        🤘🤘🤘
    </template>
  `,
};
