import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { action } from "@storybook/addon-actions";

import OurSvgIcon from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / IconSvg`,
  component: OurSvgIcon,
  args: {
    name: "Active-call",
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurSvgIcon v-bind="$realProps" @click="onClick"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const ColorsTemplate = (args, { argTypes }) => ({
  components: { OurSvgIcon },
  data: () => ({ colors: argTypes.color.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSvgIcon
        v-for="(color, index) in colors"
        :color="$realProps.color || color"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      />
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
  components: { OurSvgIcon },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSvgIcon
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onClick: action("clicked"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurSvgIcon },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurSvgIcon
        v-for="(variant, index) in variants"
        :variant="$realProps.variant || variant"
        v-bind="$realProps"
        @click="onClick"
        :key="index"
      />
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

export const colors = ColorsTemplate.bind({});
colors.args = {};

export const sizes = SizesTemplate.bind({});
sizes.args = {};

export const variants = VariantsTemplate.bind({});
variants.args = { color: "red" };

export const tooltip = DefaultTemplate.bind({});
tooltip.args = { tooltip: "Some text" };

export const pill = DefaultTemplate.bind({});
pill.args = { pill: true, color: "red" };

export const interactive = DefaultTemplate.bind({});
interactive.args = { interactive: true };
