import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurStepper from "./index";

export default {
  title: `${CHAPTERS.ui} / Stepper`,
  component: OurStepper,
  args: {
    title: "Title",
    step: 1,
    totalSteps: 10,
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurStepper },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurStepper v-bind="$realProps" />
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};
