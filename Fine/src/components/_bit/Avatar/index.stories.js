import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurAvatar from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";

export default {
  title: `${CHAPTERS.ui} / Avatar`,
  component: OurAvatar,
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurAvatar },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurAvatar v-bind="$realProps" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurAvatar },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurAvatar
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        v-bind="$realProps"
        :key="index"
      />
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

export const userName = DefaultTemplate.bind({});
userName.args = { userName: "Name" };
