<template>
  <div class="text-block" :class="[theme, textBlockClasses]">
    <!-- @slot Use it to add something. -->
    <slot />
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurTextBlock",

  props: {
    /**
     * Set text block size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set component align.
     * @values left , center, right
     */
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
  @apply font-normal leading-normal;

  a {
    @apply font-medium underline;
  }

  ul {
    @apply font-normal leading-[1.125rem];
    @apply list-inside list-disc;
    @apply ml-2;
  }

  &.size {
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
