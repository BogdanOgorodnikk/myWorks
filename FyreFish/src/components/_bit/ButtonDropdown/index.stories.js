import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";
import { action } from "@storybook/addon-actions";

import OurDropdown from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["items"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Button Dropdown`,
  component: OurDropdown,
  args: {
    text: "Button Dropdown",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurDropdown },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurDropdown
        v-bind="$realProps"
        @mousedown="onMousedown"
        @focus="onFocus"
        @keydown="onKeydown"
        @blur="onBlur"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurDropdown>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onMousedown: action("mousedown"),
    onFocus: action("focus"),
    onKeydown: action("keydown"),
    onBlur: action("blur"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurDropdown },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurDropdown
        v-bind="$realProps"
         @mousedown="onMousedown"
         @focus="onFocus"
         @keydown="onKeydown"
         @blur="onBlur"
    >
      ${args.slotTemplate}
    </OurDropdown>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onMousedown: action("mousedown"),
    onFocus: action("focus"),
    onKeydown: action("keydown"),
    onBlur: action("blur"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurDropdown },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDropdown
        v-for="(variant, index) in variants"
        :variant="$realProps.variant || variant"
        :text="$realProps.text || variant"
        v-bind="$realProps"
        @mousedown="onMousedown"
        @focus="onFocus"
        @keydown="onKeydown"
        @blur="onBlur"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurDropdown>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onMousedown: action("mousedown"),
    onFocus: action("focus"),
    onKeydown: action("keydown"),
    onBlur: action("blur"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurDropdown },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurDropdown
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="$realProps.text || size"
        v-bind="$realProps"
        @mousedown="onMousedown"
        @focus="onFocus"
        @keydown="onKeydown"
        @blur="onBlur"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurDropdown>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onMousedown: action("mousedown"),
    onFocus: action("focus"),
    onKeydown: action("keydown"),
    onBlur: action("blur"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = { text: "" };

export const Sizes = SizesTemplate.bind({});
Sizes.args = { text: "" };

export const Slot = SlotTemplate.bind({});
Slot.args = {
  slotTemplate: `
    <template #items>
      🤘🤘🤘 🤘🤘🤘
    </template>
  `,
};

export const WithoutDropdownIcon = VariantsTemplate.bind({});
WithoutDropdownIcon.args = { dropdownIcon: false };
