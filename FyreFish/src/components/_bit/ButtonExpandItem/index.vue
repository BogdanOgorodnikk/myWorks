<template>
  <div class="wrapper" :class="theme">
    <t-button class="button" :disabled="disabled" :class="sizeClass" @click="onClick">
      <OurSvgIcon v-if="iconName" :name="iconName" class="icon" />

      <span class="button-text">{{ text }}</span>
    </t-button>

    <div class="line" />
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TButton from "vue-tailwind/dist/t-button";

export default {
  components: {
    OurSvgIcon,
    TButton,
  },

  props: {
    /**
     * The size of the button.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set button text.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * Make button inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Set icon name.
     */
    iconName: {
      type: String,
      default: "",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    sizeClass() {
      return `size-${this.size}`;
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  &:last-child {
    .line {
      @apply hidden;
    }
  }

  .button {
    @apply flex items-center;
    @apply text-base font-medium text-base-dark;
    @apply w-full text-left;
    @apply rounded-lg shadow-none outline-none;
    @apply border bg-transparent;

    &-text {
      @apply border-b border-transparent;
    }

    .icon {
      @apply mr-3;

      &::v-deep g [fill] {
        @apply fill-current text-gray-500;
      }
    }

    &:hover {
      .button-text {
        @apply transition duration-100 ease-in-out;
        @apply border-b border-dashed border-base-dark;
      }
    }

    &:focus {
      @apply border-transparent;
      @apply ring-0;
    }

    &:disabled {
      @apply text-gray-400;
    }
  }

  .line {
    @apply border border-r-0 border-l-0 border-t-0 border-gray-200;
    @apply my-2;
  }
}

.size-sm {
  @apply px-3;
}

.size-md {
  @apply px-4;
}

.size-lg {
  @apply px-5;
}
</style>
