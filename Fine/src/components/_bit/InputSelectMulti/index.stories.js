import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";
import { action } from "@storybook/addon-actions";

import OurMultiselect from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6 w-full";
const COMPONENT_CLASS = "w-1/3";
const SLOT_NAMES = ["tag-title", "after-caret"];

export default {
  title: `${CHAPTERS.ui} / Input Select Multi`,
  component: OurMultiselect,
  args: {
    label: "Label",
    options: [
      {
        id: 1,
        label: "value 1",
      },
      {
        id: 2,
        label: "value 2",
      },
      {
        id: 3,
        label: "value 3",
      },
      {
        id: 4,
        label: "value 4",
      },
    ],
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
    value: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurMultiselect },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurMultiselect v-bind="$realProps" @input="onInput" @open="onOpen"> 
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurMultiselect>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
    },
    onOpen: action("open"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurMultiselect },
  data: () => ({ openDirections: argTypes.openDirection.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASS}" v-for="(openDirection, index) in openDirections" :key="index">
        <OurMultiselect
            v-bind="$realProps"
            :openDirection="$realProps.openDirection || openDirection"
            :label="openDirection"
            @input="onInput"
            @open="onOpen"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurMultiselect>
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
    },
    onOpen: action("open"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurMultiselect },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurMultiselect
        v-bind="$realProps"
        @input="onInput"
        @open="onOpen"
    >
      ${args.slotTemplate}
    </OurMultiselect>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
    },
    onOpen: action("open"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const openDirection = VariantsTemplate.bind({});
openDirection.args = {};

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { placeholder: "some placeholder text" };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error text" };

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const withoutAllowEmpty = DefaultTemplate.bind({});
withoutAllowEmpty.args = { allowEmpty: false };

export const withoutInternalSearch = DefaultTemplate.bind({});
withoutInternalSearch.args = { withInternalSearch: false };

export const optionsLimit2 = DefaultTemplate.bind({});
optionsLimit2.args = { optionsLimit: 2 };

export const description = DefaultTemplate.bind({});
description.args = { description: "some description text" };

export const sloTagTitle = SlotTemplate.bind({});
sloTagTitle.args = {
  slotTemplate: `
    <template #tag-title>
        🤘🤘🤘
    </template>
  `,
};

export const slotAfterCaret = SlotTemplate.bind({});
slotAfterCaret.args = {
  slotTemplate: `
    <template #after-caret>
        🤘
    </template>
  `,
};
