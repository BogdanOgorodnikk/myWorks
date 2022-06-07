<template>
  <label class="checkbox-wrap" :class="theme">
    <t-checkbox
      v-model="selected"
      class="checkbox"
      :class="checkboxSizeClass"
      :disabled="disabled"
    />

    <OurSvgIcon
      v-if="isShownPartialIcon"
      name="Minus2"
      :size="size"
      class="checkbox-partial-icon"
      color="white"
    />

    <span v-if="label" class="label">
      {{ label }}
    </span>
  </label>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import TCheckbox from "vue-tailwind/dist/t-checkbox";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurCheckbox",

  components: { OurSvgIcon, TCheckbox },

  props: {
    /**
     * Set checkbox value.
     */
    value: {
      type: Boolean,
      default: false,
    },

    /**
     * Set own values for checkbox states (selected | unselected).
     */
    values: {
      type: Object,
      default: () => ({
        select: true,
        unselect: false,
      }),
    },

    /**
     * Set checkbox label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set checkbox size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Make checkbox inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    partial: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    selected: {
      get() {
        const { select, unselect } = this.values;

        return this.value ? select : unselect;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    checkboxSizeClass() {
      return {
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
      };
    },

    isShownPartialIcon() {
      const { select } = this.values;

      return this.partial && this.selected === select;
    },

    theme() {
      return getTheme();
    },
  },
};
</script>

<style lang="postcss" scoped>
.checkbox-wrap {
  @apply flex max-w-max items-center;
  @apply relative;

  .checkbox {
    @apply border border-solid border-gray-300;

    &:disabled {
      @apply border-gray-100 bg-gray-100;
    }

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-200;
    }

    &:active {
      @apply border-base-dark bg-base-dark;
    }

    &:checked {
      @apply border-base-dark bg-base-dark;
    }

    &-partial-icon {
      @apply absolute rounded bg-base-dark;
    }
  }

  .label {
    @apply text-base font-medium text-base-dark;
    @apply ml-4;
  }
}

.size {
  &-sm {
    @apply h-5 w-5;

    & + .label {
      @apply text-sm;
    }
  }

  &-md {
    @apply h-6 w-6;
  }

  &-lg {
    @apply h-7 w-7;

    & + .label {
      @apply text-lg;
    }
  }
}
</style>

<!-- Accent theme -->
<style scoped lang="postcss">
.accent-theme {
  &.checkbox-wrap {
    .checkbox {
      @apply border border-solid border-gray-300;

      &:disabled {
        @apply bg-accent bg-opacity-10;
        @apply border-accent border-opacity-10;
      }

      &:hover {
        @apply border-accent border-opacity-40;
      }

      &:focus {
        @apply border-accent border-opacity-50;
        @apply ring-4 ring-accent ring-opacity-15;
      }

      &:active {
        @apply border-accent bg-accent;
      }

      &:checked {
        @apply border-accent bg-accent;
      }
    }

    .label {
      @apply text-sm font-normal text-base-dark;
      @apply ml-4;
    }
  }
}
</style>
