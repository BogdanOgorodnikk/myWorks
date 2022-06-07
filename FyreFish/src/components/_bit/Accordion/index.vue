<template>
  <OurCard>
    <div v-if="title" class="accordion-title">
      {{ title }}
    </div>

    <AccordionItem
      v-for="item in items"
      :key="item.blockName"
      :ref="`item-${item.blockName}`"
      :title="item.title"
      :description="item.description"
      :block-name="item.blockName"
      :size="size"
      @itemClicked="onItemClicked"
    />
  </OurCard>
</template>

<script>
import { getRandomId } from "@ilevel/our.service.ui";
import OurCard from "@ilevel/our.ui.container-card";
import AccordionItem from "./AccordionItem";

export default {
  name: "OurAccordion",
  components: {
    OurCard,
    AccordionItem,
  },

  props: {
    /**
     * Set component title.
     */
    title: {
      type: String,
      default: "",
    },

    /**
     * Set data for accordion item.
     */
    items: {
      type: Array,
      default: () => [],
    },

    /**
     * The size of the accordion item.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },
  },

  created() {
    this.items.forEach((item) => (item.blockName = getRandomId()));
  },

  methods: {
    onItemClicked(node) {
      for (let key in this.$refs) {
        const [component] = this.$refs[key];

        component.closeDescription(node);
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.card {
  @apply space-y-0 p-6;

  .accordion-title {
    @apply mb-2 text-2xl font-medium leading-9;
  }
}
</style>
