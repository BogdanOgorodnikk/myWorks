import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";

import OurPagination from "./index";

export default {
  title: `${CHAPTERS.ui} / Pagination`,
  component: OurPagination,
  args: {
    total: 90,
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurPagination },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurPagination v-bind="$realProps" @pageChange="onChange"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onChange(value) {
      this.currentPage = value;
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const perPage1 = DefaultTemplate.bind({});
perPage1.args = { perPage: 1 };
