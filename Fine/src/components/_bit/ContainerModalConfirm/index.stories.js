import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurConfirmModal from "./index";
import OurButton from "@ilevel/our.ui.button";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["header", "default"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Container Modal Confirm`,
  component: OurConfirmModal,
  args: {
    title: "Modal Confirm",
    actionButtonText: "Confirm text",
    slotTemplate: `
      <template #default>
       Confirm this action ?
      </template>
    `,
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurConfirmModal, OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurConfirmModal v-bind="$realProps" @input="onInput">
        ${args.slotTemplate}
      </OurConfirmModal>
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
  components: { OurConfirmModal, OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurConfirmModal v-bind="$realProps" @input="onInput">
        ${args.slotTemplate}
      </OurConfirmModal>
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
  components: { OurConfirmModal, OurButton },
  data: () => ({ sizes: argTypes.width.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurConfirmModal v-bind="$realProps" @input="onInput">
        ${args.slotTemplate}
      </OurConfirmModal>
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

export const slotHeader = SlotTemplate.bind({});
slotHeader.args = {
  slotTemplate: `
    <template #header>
      🤘🤘🤘
    </template>
  `,
};
