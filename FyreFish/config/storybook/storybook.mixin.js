import { camelToKebab } from "/config/storybook/storybook.service";

export default {
  data: () => ({
    $argTypes: null,
    $args: null,
  }),
  computed: {
    $allSlots() {
      if (!this.$argTypes) return;

      return (
        Object.values(this.$argTypes)
          .filter((item) => item.table?.category === "slots")
          .map((item) => camelToKebab(item.name)) || []
      );
    },
    $realProps() {
      const props = { ...this.$props };

      delete props["slotTemplate"];
      this.$allSlots?.forEach((item) => {
        delete props[item];
      });

      return props;
    },
  },
};
