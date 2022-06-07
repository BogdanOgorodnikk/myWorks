import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurPageModal from "./index";
import OurButton from "@ilevel/our.ui.button";

const SLOT_NAMES = ["header-left", "header-left-after", "default", "footer-left", "footer-right"]; // TODO: Find how to get it dynamically
const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Container Modal Page`,
  component: OurPageModal,
  args: {
    title: "Page Modal",
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurPageModal, OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurPageModal v-bind="$realProps" @input="onInput">
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurPageModal>
      <OurButton text="show modal" @click="onClick"/>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onClick() {
      this.value = true;
    },
    onInput(value) {
      this.value = value;
    },
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurPageModal, OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurPageModal v-bind="$realProps" @input="onInput">
        ${args.slotTemplate}
      </OurPageModal>
      <OurButton text="show modal" @click="onClick"/>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onClick() {
      this.value = true;
    },
    onInput(value) {
      this.value = value;
    },
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurPageModal, OurButton },
  data: () => ({ sizes: argTypes.width.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurPageModal v-bind="$realProps" @input="onInput">
        <template v-for="(slot) in $allSlots" v-slot:[slot]>
          <template v-if="$props[slot]">{{ $props[slot] }}</template>
        </template>
      </OurPageModal>
      <div class="${WRAPPER_CLASSES}">
        <OurButton   
            v-for="(size, index) in sizes"
            :key="index" :text="size" @click="onClick(size)"
        />
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    // TODO: Find how to do it dynamically and without errors
    onClick(value) {
      this.width = value;
      this.value = true;
    },
    onInput(value) {
      this.value = value;
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const sizes = SizesTemplate.bind({});
sizes.args = { text: "" };

export const backRoute = DefaultTemplate.bind({});
backRoute.args = { backRoute: { title: "route title" } };

export const slotDefault = SlotTemplate.bind({});
slotDefault.args = {
  slotTemplate: `
    <template #default>
      Some text
    </template>
  `,
};

export const slotHeaderLeft = SlotTemplate.bind({});
slotHeaderLeft.args = {
  slotTemplate: `
    <template #header-left>
      🤘🤘🤘
    </template>
  `,
};

export const slotHeaderLeftAfter = SlotTemplate.bind({});
slotHeaderLeftAfter.args = {
  slotTemplate: `
    <template #header-left-after>
      🤘🤘🤘
    </template>
  `,
};

export const slotFooterLeft = SlotTemplate.bind({});
slotFooterLeft.args = {
  slotTemplate: `
    <template #footer-left>
      🤘🤘🤘 
    </template>
  `,
};

export const slotFooterRight = SlotTemplate.bind({});
slotFooterRight.args = {
  slotTemplate: `
    <template #footer-right>
      🤘🤘🤘 
    </template>
  `,
};
