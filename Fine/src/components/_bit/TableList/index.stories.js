import { action } from "@storybook/addon-actions";
import storybookMixins from "@ilevel/our.storybook.mixin";
import { CHAPTERS } from "@ilevel/our.storybook.constants";
import { generateArgTypesSettingsForSlots } from "@ilevel/our.storybook.service";

import OurTableList from "./index";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const SLOT_NAMES = ["icons"]; // TODO: Find how to get it dynamically

export default {
  title: `${CHAPTERS.ui} / Table List`,
  component: OurTableList,
  args: {
    list: [
      {
        name: "name 1",
        id: 1,
        children: [
          { name: "name 1.1", id: 1.1 },
          { name: "name 1.2", id: 1.2 },
          { name: "name 1.3", id: 1.3 },
        ],
      },
      {
        name: "name 2",
        id: 2,
        children: [
          { name: "name 2.1", id: 2.1 },
          { name: "name 2.2", id: 2.2 },
        ],
      },
      {
        name: "name 3",
        id: 3,
      },
    ],
  },
  argTypes: {
    ...generateArgTypesSettingsForSlots(SLOT_NAMES),
  },
};

const DefaultTemplate = (args, { argTypes }) => ({
  components: { OurTableList },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTableList v-bind="$realProps" @dragSort="onDragSort" @clickEdit="onClickEdit" @clickDelete="onClickDelete"/>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onDragSort(value) {
      this.list = value;
    },
    onClickEdit: action("clickEdit"),
    onClickDelete: action("clickDelete"),
  },
});

const SlotTemplate = (args, { argTypes }) => ({
  components: { OurTableList, OurSvgIcon },
  props: Object.keys(argTypes),
  mixins: [storybookMixins],
  template: `
    <OurTableList v-bind="$realProps" @dragSort="onDragSort" @clickEdit="onClickEdit" @clickDelete="onClickDelete">
      ${args.slotTemplate}
    </OurTableList>
  `,
  created() {
    this.$argTypes = argTypes;
  },
  methods: {
    onDragSort(value) {
      this.list = value;
    },
    onClickEdit: action("clickEdit"),
    onClickDelete: action("clickDelete"),
  },
});

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const nesting = DefaultTemplate.bind({});
nesting.args = { nesting: true };

export const slotIcons = SlotTemplate.bind({});
slotIcons.args = {
  slotTemplate: `
    <template #icons>
       <OurSvgIcon
        name="Air-ballon"
        color="dark-50"
        size="md"
       />
    </template>
  `,
};
