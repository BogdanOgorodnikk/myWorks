import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurDateRangePicker from "./index";

const WRAPPER_CLASSES = "flex items-center";
const COMPONENT_CLASS = "mr-10";
const SLOT_NAMES = ["right"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Input Date Range Picker`,
  component: OurDateRangePicker,
  args: {
    value: {
      from: 1651813634,
      to: 1654492034,
    },
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurDateRangePicker },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDateRangePicker v-bind="$realProps" @input="onInput">
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurDateRangePicker>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurDateRangePicker },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDateRangePicker v-bind="$realProps" @input="onInput">
        ${args.slotTemplate}
      </OurDateRangePicker>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurDateRangePicker },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDateRangePicker 
          class="${COMPONENT_CLASS}"
          v-for="(variant, index) in variants"
          :variant="$realProps.variant || variant"
          v-bind="$realProps"
          :key="index"
          @input="onInput"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurDateRangePicker>
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
Default.args = {};

export const variants = VariantsTemplate.bind({});
variants.args = { value: {} };

export const label = DefaultTemplate.bind({});
label.args = { value: {}, variant: "input", label: "some label" };

export const slotRight = SlotTemplate.bind({});
slotRight.args = {
  variant: "input",
  slotTemplate: `
    <template #right>
      🤘
    </template>
  `,
};
