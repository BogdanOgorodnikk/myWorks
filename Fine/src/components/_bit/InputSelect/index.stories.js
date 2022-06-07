import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";
import { action } from "@storybook/addon-actions";

import OurSelect from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6 w-full";
const COMPONENT_CLASS = "w-1/3";
const SLOT_NAMES = ["singleLabel", "option", "after-caret"];

export default {
  title: `${CHAPTERS.ui} / Input Select`,
  component: OurSelect,
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
  components: { OurSelect },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurSelect v-bind="$realProps" @input="onInput" @remove="onRemove" @open="onOpen" @change="onChange"> 
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurSelect>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
    },
    onRemove: action("remove"),
    onOpen: action("open"),
    onChange: action("change"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurSelect },
  data: () => ({ openDirections: argTypes.openDirection.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div class="${COMPONENT_CLASS}" v-for="(openDirection, index) in openDirections" :key="index">
        <OurSelect
            v-bind="$realProps"
            :openDirection="$realProps.openDirection || openDirection"
            :label="openDirection"
            @input="onInput"
            @remove="onRemove"
            @open="onOpen"
            @change="onChange"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurSelect>
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
    onRemove: action("remove"),
    onOpen: action("open"),
    onChange: action("change"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurSelect },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurSelect
        v-bind="$realProps"
        @input="onInput"
        @remove="onRemove"
        @open="onOpen"
        @change="onChange"
    >
      ${args.slotTemplate}
    </OurSelect>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
    },
    onRemove: action("remove"),
    onOpen: action("open"),
    onChange: action("change"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const openDirection = VariantsTemplate.bind({});
openDirection.args = {};

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error text" };

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { placeholder: "some placeholder text" };

export const withoutInternalSearch = DefaultTemplate.bind({});
withoutInternalSearch.args = { withInternalSearch: false };

export const description = DefaultTemplate.bind({});
description.args = { description: "some description text" };

export const optionsLimit2 = DefaultTemplate.bind({});
optionsLimit2.args = { optionsLimit: 2 };

export const allowEmpty = DefaultTemplate.bind({});
allowEmpty.args = { allowEmpty: true };

export const slotSingleLabel = SlotTemplate.bind({});
slotSingleLabel.args = {
  slotTemplate: `
    <template #singleLabel>
        🤘🤘🤘
    </template>
  `,
};

export const slotOption = SlotTemplate.bind({});
slotOption.args = {
  slotTemplate: `
    <template #option>
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
