import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurRadioCard from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const SLOT_NAMES = ["icon"];

export default {
  title: `${CHAPTERS.ui} / Input Radio Card`,
  component: OurRadioCard,
  args: {
    value: "radio card 1",
    name: "radio",
    options: [
      {
        value: "radio card 1",
        description: "some description 1",
        iconName: "Air-ballon",
        title: "title 1",
      },
      {
        value: "radio card 2",
        description: "some description 2",
        iconName: "Air-ballon",
        title: "title 2",
      },
      {
        value: "radio card 3",
        description: "some description 3",
        iconName: "Air-ballon",
        title: "title 3",
      },
    ],
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurRadioCard },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurRadioCard
        v-bind="$realProps"
        @input="onInput"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurRadioCard>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
      action("input");
    },
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurRadioCard, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurRadioCard v-bind="$realProps" @input="onInput">
      ${args.slotTemplate}
    </OurRadioCard>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onInput(value) {
      this.value = value;
      action("input");
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const gridCols3 = DefaultTemplate.bind({});
gridCols3.args = {
  gridCols: 3,
  value: "radio card 4",
  name: "radio 2",
  options: [
    {
      value: "radio card 4",
      description: "some description 1",
      iconName: "Air-ballon",
      title: "title 1",
    },
    {
      value: "radio card 5",
      description: "some description 2",
      iconName: "Air-ballon",
      title: "title 2",
    },
    {
      value: "radio card 6",
      description: "some description 3",
      iconName: "Air-ballon",
      title: "title 3",
    },
  ],
};

export const withoutIcon = DefaultTemplate.bind({});
withoutIcon.args = {
  withIcon: false,
  value: "radio card 7",
  name: "radio 3",
  options: [
    {
      value: "radio card 7",
      description: "some description 1",
      iconName: "Air-ballon",
      title: "title 1",
    },
    {
      value: "radio card 8",
      description: "some description 2",
      iconName: "Air-ballon",
      title: "title 2",
    },
    {
      value: "radio card 9",
      description: "some description 3",
      iconName: "Air-ballon",
      title: "title 3",
    },
  ],
};

export const iconSlot = SlotTemplate.bind({});
iconSlot.args = {
  value: "radio card 10",
  name: "radio 4",
  options: [
    {
      value: "radio card 10",
      description: "some description 1",
      title: "title 1",
    },
    {
      value: "radio card 11",
      description: "some description 2",
      title: "title 2",
    },
  ],
  slotTemplate: `
    <template #icon>
      <OurSvgIcon
        name="Airplay"
        size="lg"
      />
    </template>
  `,
};
