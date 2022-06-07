<template>
  <div class="text-block" :class="[theme, textBlockClasses]">
    <slot />
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurTextBlock",

  props: {
    size: {
      type: String,
      default: "md",
    },

    align: {
      type: String,
      default: "left",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    textBlockClasses() {
      const size = `size-${this.size}`;
      const align = `position-${this.align}`;

      return [size, align];
    },
  },
};
</script>

<style lang="postcss" scoped>
.text-block::v-deep {
  @apply space-y-4;
  @apply font-normal leading-normal text-base-dark;

  a {
    @apply font-medium underline;
  }

  &.size {
    &-sm {
      @apply text-sm;
    }

    &-md {
      @apply text-base;
    }
  }

  &.position {
    &-left {
      @apply text-left;
    }

    &-center {
      @apply text-center;
    }

    &-right {
      @apply text-right;
    }
  }
}
</style>
