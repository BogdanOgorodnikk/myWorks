import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurRadioGroup from "./index";

const SLOT_NAMES = ["description"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Input Radio Group`,
  component: OurRadioGroup,
  args: {
    label: "Label",
    name: "radio",
    options: [
      {
        title: "radio group 1",
        description: "some description 1",
        value: "1",
      },
      {
        title: "radio group 2",
        description: "some description 2",
        value: "2",
      },
      {
        title: "radio group 3",
        description: "some description 3",
        value: "3",
      },
    ],
    value: "1",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurRadioGroup },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurRadioGroup v-bind="$realProps" @input="onInput">
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurRadioGroup>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
      action("onInput");
    },
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurRadioGroup },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurRadioGroup v-bind="$realProps" @input="onInput">
      ${args.slotTemplate}
    </OurRadioGroup>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
      action("onInput");
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const disabled = DefaultTemplate.bind({});
disabled.args = { disabled: true };

export const descriptionSlot = SlotTemplate.bind({});
descriptionSlot.args = {
  name: "radio 2",
  options: [
    {
      title: "radio group 4",
    },
    {
      title: "radio group 5",
    },
  ],
  value: "radio group 4",
  valueKey: "title",
  slotTemplate: `
    <template #description>
       <div>slot description</div>
    </template>
  `,
};
