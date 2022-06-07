import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurPhoneInput from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["arrow-icon"];

export default {
  title: `${CHAPTERS.ui} / Input Phone`,
  component: OurPhoneInput,
  args: {
    label: "Label",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
    value: { control: { type: "text" } },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurPhoneInput },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurPhoneInput 
        v-bind="$realProps"
        @input="onInput"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurPhoneInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurPhoneInput },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurPhoneInput
          v-for="(size, index) in sizes"
          :size="$realProps.size || size"
          :key="index"
          v-bind="$realProps"
          @input="onInput"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurPhoneInput>
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
  components: { OurPhoneInput },
  data: () => ({ variants: argTypes.mode.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurPhoneInput
          v-for="(variant, index) in variants"
          :mode="$realProps.mode || variant"
          :key="index"
          v-bind="$realProps"
          @input="onInput"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurPhoneInput>
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
  components: { OurPhoneInput, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurPhoneInput 
        v-bind="$realProps"
        @input="onInput"
    >
      ${args.slotTemplate}
    </OurPhoneInput>
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

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const modeVariants = VariantsTemplate.bind({});
modeVariants.args = {};

export const description = DefaultTemplate.bind({});
description.args = { description: "some description" };

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const placeholder = DefaultTemplate.bind({});
placeholder.args = { dialCode: false, placeholder: "some placeholder" };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };

export const withoutFlags = DefaultTemplate.bind({});
withoutFlags.args = { flags: false };

export const withoutDialCode = DefaultTemplate.bind({});
withoutDialCode.args = { dialCode: false };

export const onlyCountries = DefaultTemplate.bind({});
onlyCountries.args = { onlyCountries: ["UA", "USA", "UN", "PL", "SK", "NL"] };

export const preferredCountries = DefaultTemplate.bind({});
preferredCountries.args = { preferredCountries: ["UA", "PL"] };

export const slotArrowIcon = SlotTemplate.bind({});
slotArrowIcon.args = {
  slotTemplate: `
    <template #arrow-icon>
       <OurSvgIcon
        name="Angle-down"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};
