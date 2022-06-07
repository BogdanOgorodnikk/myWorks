import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";
import { mapGetters } from "vuex";

import OurFileInput from "./index";

const SLOT_NAMES = ["default"]; // TODO: Find how to get it dynamically
const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Input File`,
  component: OurFileInput,
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurFileInput },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <OurFileInput
        v-bind="$realProps"
        @changeFiles="onChangeFiles"
    >
      <template v-for="(slot) in $allSlots" v-slot:[slot]>
        <template v-if="$props[slot]">{{ $props[slot] }}</template>
      </template>
    </OurFileInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onChangeFiles: action("changeFiles"),
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurFileInput },
  data: () => ({ sizes: argTypes.buttonSize.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div v-for="(size, index) in sizes" :key="index">
        <OurFileInput
            :buttonSize="$realProps.size || size"
            v-bind="$realProps"
            @changeFiles="onChangeFiles"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurFileInput>
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onChangeFiles: action("changeFiles"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurFileInput },
  data: () => ({ variants: argTypes.buttonVariant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <div v-for="(variant, index) in variants" :key="index">
        <OurFileInput
            :buttonVariant="$realProps.buttonVariant || variant"
            v-bind="$realProps"
            @changeFiles="onChangeFiles"
        >
          <template v-for="(slot) in $allSlots" v-slot:[slot]>
            <template v-if="$props[slot]">{{ $props[slot] }}</template>
          </template>
        </OurFileInput>
      </div>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onChangeFiles: action("changeFiles"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurFileInput },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <OurFileInput
        v-bind="$realProps"
        @changeFiles="onChangeFiles"
    >
      ${args.slotTemplate}
    </OurFileInput>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onChangeFiles: action("changeFiles"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const imageUpload = DefaultTemplate.bind({});
imageUpload.args = { isImageUpload: true };

export const buttonSizes = SizesTemplate.bind({});
buttonSizes.args = {};

export const buttonVariants = VariantsTemplate.bind({});
buttonVariants.args = {};

export const imageURL = DefaultTemplate.bind({});
imageURL.args = {
  imageURL: "https://cdn.iconscout.com/icon/premium/png-256-thumb/publish-1767385-1505249.png",
};

export const multiple = DefaultTemplate.bind({});
multiple.args = { multiple: true };

export const withoutIcon = DefaultTemplate.bind({});
withoutIcon.args = { withIcon: false };

export const error = DefaultTemplate.bind({});
error.args = { error: "some error" };

export const slotDefault = SlotTemplate.bind({});
slotDefault.args = {
  slotTemplate: `
    <template #default>
      🤘🤘🤘
    </template>
  `,
};
