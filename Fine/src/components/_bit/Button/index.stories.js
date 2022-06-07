import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurButton from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["default", "icon-left", "icon-right"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Button`,
  component: OurButton,
  args: {
    text: "Button",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurButton v-bind="$realProps" @click="onClick">
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurButton>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurButton, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurButton v-bind="$realProps" @click="onClick">
      ${args.slotTemplate}
    </OurButton>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurButton },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurButton
        v-for="(variant, index) in variants"
        :variant="$realProps.variant || variant"
        :text="$realProps.text || variant"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurButton>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurButton },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurButton
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        :text="$realProps.text || size"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurButton>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const variants = VariantsTemplate.bind({});
variants.args = { text: "" };

export const sizes = SizesTemplate.bind({});
sizes.args = { text: "" };

export const pilled = VariantsTemplate.bind({});
pilled.args = { pill: true };

export const disabled = VariantsTemplate.bind({});
disabled.args = { disabled: true };

export const darkMode = VariantsTemplate.bind({});
darkMode.args = { darkMode: true };
darkMode.parameters = {
  backgrounds: { default: "dark" },
  docs: {
    description: {
      story: '🛑 Should be fixed in future. Now works only on `variant="transparent"`',
    },
  },
};

export const slotDefault = SlotTemplate.bind({});
slotDefault.args = {
  slotTemplate: `
    <template #default>
      🤘🤘🤘
    </template>
  `,
};

export const slotLeft = SlotTemplate.bind({});
slotLeft.args = {
  slotTemplate: `
    <template #icon-left>
      <OurSvgIcon
        name="Filter"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};

export const slotRight = SlotTemplate.bind({});
slotRight.args = {
  slotTemplate: `
    <template #icon-right>
      <OurSvgIcon
        name="Filter"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};
