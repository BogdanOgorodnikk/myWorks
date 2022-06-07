import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurInput from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["icon"];

export default {
  title: `${CHAPTERS.ui} / Input`,
  component: OurInput,
  args: {
    label: "Label",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
    value: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurInput },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurInput 
        v-bind="$realProps"  
        @blur="onBlur"
        @input="onInput"
        @change="onChange"
        @keyup.enter="onKeyupEnter"
        @keyup="onKeyup"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
    onChange: action("change"),
    onKeyupEnter: action("keyupEnter"),
    onKeyup: action("keyup"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurInput, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurInput
        v-bind="$realProps"
        @blur="onBlur"
        @input="onInput"
        @change="onChange"
        @keyup.enter="onKeyupEnter"
        @keyup="onKeyup"
    >
      ${args.slotTemplate}
    </OurInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
    onChange: action("change"),
    onKeyupEnter: action("keyupEnter"),
    onKeyup: action("keyup"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurInput },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurInput
          v-for="(size, index) in sizes"
          :size="$realProps.size || size"
          :key="index"
          v-bind="$realProps"
          @blur="onBlur"
          @input="onInput"
          @change="onChange"
          @keyup.enter="onKeyupEnter"
          @keyup="onKeyup"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurInput>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
    onChange: action("change"),
    onKeyupEnter: action("keyupEnter"),
    onKeyup: action("keyup"),
  },
});

const ValidationRuleTemplate = (args, { argTypes }) => ({
  components: { OurInput },
  data: () => ({ rules: argTypes.validationRule.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurInput
          v-for="(rule, index) in rules"
          :validationRule="$realProps.validationRule || rule"
          :key="index"
          :description="rule"
          v-bind="$realProps"
          @blur="onBlur"
          @input="onInput"
          @change="onChange"
          @keyup.enter="onKeyupEnter"
          @keyup="onKeyup"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurInput>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onBlur: action("blur"),
    onInput: action("input"),
    onChange: action("change"),
    onKeyupEnter: action("keyupEnter"),
    onKeyup: action("keyup"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const description = DefaultTemplate.bind({});
description.args = { description: "some description text" };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error text" };

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { placeholder: "some placeholder text" };

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const validationRules = ValidationRuleTemplate.bind({});
validationRules.args = {};

export const slotIcon = SlotTemplate.bind({});
slotIcon.args = {
  slotTemplate: `
    <template #icon>
      <OurSvgIcon
        name="Address-card"
        color="dark-50"
        size="sm"
      />
    </template>
  `,
};
