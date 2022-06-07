import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { mapGetters } from "vuex";

import OurLanguages from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Languages`,
  component: OurLanguages,
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurLanguages },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <OurLanguages v-bind="$realProps"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurLanguages },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  getters: [mapGetters],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurLanguages
          v-for="(variant, index) in variants"
          :variant="$realProps.variant || variant"
          :key="index"
          v-bind="$realProps"
      />
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const variant = VariantsTemplate.bind({});
variant.args = {};
