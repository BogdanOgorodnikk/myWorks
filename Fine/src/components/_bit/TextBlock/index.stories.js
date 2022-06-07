import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurTextBlock from "./index";

const WRAPPER_CLASSES = "flex items-start space-x-6";
const SLOT_NAMES = ["default"];

export default {
  title: `${CHAPTERS.ui} / Text Block`,
  component: OurTextBlock,
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
  args: {
    slotTemplate: `
    <template #default>
        <p>
          <b>Lorem ipsum dolor sit amet</b><u>, consectetur adipiscing elit,
          </u><em> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</em> 
          <a href="https://uk.wikipedia.org/wiki/Lorem_ipsum" target="_blank">Wikipedia</a>
        </p>
    </template>
  `,
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurTextBlock },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTextBlock v-bind="$realProps" >
      ${args.slotTemplate}
    </OurTextBlock>
  `,
  created() {
    this.$argTypes = argTypes;
  },
});

const SizesTemplate = (args, { argTypes }) => ({
  components: { OurTextBlock },
  data: () => ({ sizes: argTypes.size.options }),
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <div class="${WRAPPER_CLASSES}">
      <OurTextBlock
        v-for="(size, index) in sizes"
        :size="$realProps.size || size"
        v-bind="$realProps"
        :key="index"
      >
        ${args.slotTemplate}
      </OurTextBlock>
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

export const paragraphs = DefaultTemplate.bind({});
paragraphs.args = {
  slotTemplate: `
    <template #default>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
        culpa qui officia deserunt mollit anim id est laborum.
      </p>
      
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
        culpa qui officia deserunt mollit anim id est laborum.
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
