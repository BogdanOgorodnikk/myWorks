import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurHint from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["default"];

export default {
  title: `${CHAPTERS.ui} / Text Hint`,
  component: OurHint,
  args: {
    slotTemplate: `
      <template #default>
        <p>
          <b>Lorem ipsum dolor sit amet,</b> 
          <u>consectetur adipiscing elit,</u> 
          <em>sed do eiusmod tempor incididunt 
          ut labore et dolore magna aliqua.</em>
          <a href="https://uk.wikipedia.org/wiki/Lorem_ipsum" target="_blank">Wikipedia</a>
        </p>
      </template>
    `,
    timeout: 0,
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurHint },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurHint v-bind="$realProps" @hidden="onHidden">
      ${args.slotTemplate}
    </OurHint>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onHidden: action("hidden"),
  },
});

const VariantsTemplate = (args, { argTypes }) => ({
  components: { OurHint },
  data: () => ({ variants: argTypes.variant.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurHint
        v-for="(variant, index) in variants"
        :variant="$realProps.variant || variant"
        v-bind="$realProps"
        @hidden="onHidden"
        :key="index"
      >
        ${args.slotTemplate}
      </OurHint>
    </div>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onHidden: action("hidden"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const variants = VariantsTemplate.bind({});
variants.args = {
  closeButton: true,
  slotTemplate: `
      <template #default>
        text
      </template>
    `,
};

export const closeButton = DefaultTemplate.bind({});
closeButton.args = {
  closeButton: true,
  slotTemplate: `
      <template #default>
        some text
      </template>
    `,
};

export const paragraphs = DefaultTemplate.bind({});
paragraphs.args = {
  slotTemplate: `
      <template #default>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
          ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit 
          esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
          occaecat cupidatat non proident, sunt in culpa qui officia 
          deserunt mollit anim id est laborum.
        </p>
      </template>
    `,
};

export const list = DefaultTemplate.bind({});
list.args = {
  slotTemplate: `
      <template #default>
        <div class="${WRAPPER_CLASSES}">
          <ul>
            <li> Lorem ipsum dolor </li>
            <li> Lorem ipsum dolor </li>
            <li> Lorem ipsum dolor </li>
          </ul>  
          
          <ol>
            <li> Lorem ipsum dolor </li>
            <li> Lorem ipsum dolor </li>
            <li> Lorem ipsum dolor </li>
          </ol>
        </div>
      </template>
    `,
};
