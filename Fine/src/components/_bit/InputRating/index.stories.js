import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurStarRating from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["counter", "right"];

export default {
  title: `${CHAPTERS.ui} / Input Rating`,
  component: OurStarRating,
  args: {
    label: "Label",
    value: 2,
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurStarRating },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurStarRating
        v-bind="$realProps"
        @input="onInput"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurStarRating>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurStarRating },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurStarRating
        v-bind="$realProps"
        @input="onInput"
    >
      ${args.slotTemplate}
    </OurStarRating>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onInput: action("input"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurStarRating },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurStarRating
          v-for="(size, index) in sizes"
          :size="$realProps.size || size"
          :key="index"
          v-bind="$realProps"
      >
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurStarRating>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const selectable = DefaultTemplate.bind({});
selectable.args = { selectable: true };

export const starsNumber = DefaultTemplate.bind({});
starsNumber.args = { value: 4, starsNumber: 7 };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };

export const withoutCounter = DefaultTemplate.bind({});
withoutCounter.args = { withCounter: false };

export const slotCounter = SlotTemplate.bind({});
slotCounter.args = {
  slotTemplate: `
    <template #counter>
      some counter
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
