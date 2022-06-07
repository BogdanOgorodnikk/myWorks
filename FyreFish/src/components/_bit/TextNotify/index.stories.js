import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import NotifyService from "@ilevel/our.service.notify";

import OurNotify from "./index";
import OurButton from "@ilevel/our.ui.button";

export default {
  title: `${CHAPTERS.ui} / Notify`,
  component: OurNotify,
  args: {
    type: "success",
    title: "Some title",
    text: "Some text",
    duration: "short",
    ignoreDuplicates: false,
  },
  argTypes: {
    type: {
      description: "The type of notify.",
      defaultValue: { summary: "success" },
      options: ["success", "warning", "error"],
      control: {
        type: "radio",
      },
    },
    title: {
      description: "Set notify title.",
      defaultValue: { summary: "" },
      control: {
        type: "text",
      },
    },
    text: {
      description: "Set notify text.",
      defaultValue: { summary: "" },
      control: {
        type: "text",
      },
    },
    duration: {
      description: "The duration for notify.",
      defaultValue: { summary: "short" },
      options: ["short", "medium", "long", "permanent"], //4000, 8000, 12000, 300000
      control: {
        type: "radio",
      },
    },
    ignoreDuplicates: {
      description: "Blocks the possibility of duplicates of notify.",
      defaultValue: { summary: false },
      control: {
        type: "boolean",
      },
    },
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurNotify, OurButton },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div>
      <OurNotify v-bind="$realProps"/>
      <OurButton text="show notify" @click="onClick"/>
    </div>
 `,
  created() {
    this.$argTypes = argTypes;
  },

  methods: {
    onClick() {
      const settings = {
        type: args.type,
        title: args.title,
        text: args.text,
        duration: args.duration,
        ignoreDuplicates: args.ignoreDuplicates,
      };

      NotifyService.notify(settings);
    },
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};
