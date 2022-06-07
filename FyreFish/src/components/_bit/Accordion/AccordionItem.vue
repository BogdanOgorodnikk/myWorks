<template>
  <div class="accordion-item" :class="sizeClass" @click="onClickItem">
    <div class="item-info">
      <div class="info-title">
        <div>
          {{ title }}
        </div>

        <OurSvgIcon :name="iconName" class="info-icon" :size="size" />
      </div>

      <div :ref="blockName" class="info-description">
        {{ description }}
      </div>
    </div>

    <div class="separator" />
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "AccordionItem",
  components: {
    OurSvgIcon,
  },

  props: {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    blockName: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      default: "md",
    },
  },

  data: () => ({
    iconName: "Plus",
  }),

  computed: {
    descriptionNode() {
      return this.$refs[this.blockName];
    },

    sizeClass() {
      return `size-${this.size}`;
    },
  },

  methods: {
    onClickItem() {
      this.descriptionNode.classList.toggle("show-description");

      const hasShowClass = this.descriptionNode.classList.contains("show-description");

      this.iconName = hasShowClass ? "Minus" : "Plus";

      this.$emit("itemClicked", this.blockName);
    },

    closeDescription(node) {
      const hasShowClass = this.descriptionNode.classList.contains("show-description");

      if (hasShowClass && node !== this.blockName) {
        this.descriptionNode.classList.remove("show-description");

        this.iconName = "Plus";
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.accordion-item {
  @apply cursor-pointer text-gray-700;

  &:not(:first-child) {
    @apply pt-4;
  }

  &:last-child {
    .separator {
      @apply hidden;
    }
  }

  .item-info {
    @apply leading-6;

    .info-title {
      @apply flex items-center justify-between;
      @apply font-medium;

      .info-icon::v-deep {
        g rect {
          @apply opacity-100;
        }
      }
    }

    .info-description {
      @apply h-0 overflow-hidden opacity-0;
    }

    .show-description {
      @apply h-full pt-2 opacity-100;
      @apply transition-all duration-300 ease-in-out;
    }
  }

  .separator {
    @apply mt-2 h-px w-full lg:mt-6;
    @apply bg-gradient-to-r from-blue-100 to-violet-50;
    @apply mt-2.5;
  }
}

.size {
  &-sm {
    @apply text-sm;
  }

  &-md {
    @apply text-base;
  }

  &-lg {
    @apply text-lg;
  }
}
</style>
