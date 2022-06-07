import "@/assets/css/index.pcss";
import "@/plugins/vue-perfect-scrollbar";
import "@/plugins/vue-cleave";
import "@/plugins/vuelidate";
import "@/plugins/vue-tailwind";
import "@/plugins/vue-tippy";
import i18n from "@/plugins/vue-i18n";
import "@/mixins/global.mixin";
import { addDecorator } from "@storybook/vue";
import twConfig from "../../tailwind.config.js";

addDecorator(() => ({
  i18n,
  beforeCreate: function () {
    this.$root._i18n = this.$i18n;
  },
  template: `<story/>`,
}));

export const parameters = {
  docs: {
    transformSource: (src) => {
      // This code removes <template> tags from preview source code block
      return src.substr(0, src.length - 12).substr(10);
    },
  },
  backgrounds: {
    default: "light",
    values: [
      { name: "white", value: twConfig.theme.colors.white },
      { name: "light", value: twConfig.theme.colors.base.light },
      { name: "dark", value: twConfig.theme.colors.base.dark },
    ],
  },
};
