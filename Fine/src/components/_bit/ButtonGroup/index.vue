<template>
  <div class="radio-buttons" :class="radioButtonsClasses">
    <div v-for="item in options" :key="item.value" class="radio-wrapper">
      <t-radio
        :id="item.value"
        v-model="selectedItem"
        class="radio"
        :name="name"
        :value="item.value"
      />

      <label :for="item.value" class="label">
        <OurSvgIcon
          v-if="item.name"
          :tooltip="item.iconTooltip"
          :size="iconSize"
          class="label-icon"
          :name="item.name"
        />

        <span v-if="item.label" class="label-text">
          {{ item.label }}
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TRadio from "vue-tailwind/dist/t-radio";

export default {
  name: "OurButtonGroup",

  components: { OurSvgIcon, TRadio },

  props: {
    /**
     * Set buttons name.
     */
    name: {
      type: String,
      required: true,
      default: "",
    },

    /**
     * Set data for buttons.
     */
    options: {
      type: Array,
      default: () => [],
    },

    /**
     * Set current value.
     */
    value: {
      type: [String, Number],
      default: "",
    },

    /**
     * The size of the buttons.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },
  },

  data: () => ({
    selected: "",
  }),

  computed: {
    selectedItem: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    radioButtonsClasses() {
      const size = `size-${this.size}`;
      const theme = getTheme();

      return [theme, size];
    },

    iconSize() {
      const sizes = {
        sm: "xs",
        md: "sm",
        lg: "md",
      };

      return sizes[this.size];
    },
  },
};
</script>

<style lang="postcss" scoped>
.radio-buttons {
  @apply flex;

  .radio-wrapper {
    @apply flex;

    &:first-child {
      .label {
        @apply rounded-l-lg;
      }
    }

    &:last-child {
      .label {
        @apply rounded-r-lg;
      }
    }

    .radio {
      @apply absolute opacity-0;

      &:focus {
        & + .label {
          @apply border-gray-100 bg-opacity-10;
          @apply ring-4 ring-gray-600/15;
        }
      }

      &:checked {
        & + .label {
          @apply bg-base-dark/15;
        }
      }
    }

    .label {
      @apply flex items-center justify-between;
      @apply bg-base-dark/5;
      @apply cursor-pointer;
      @apply cursor-pointer p-4 pl-0;

      &:hover {
        @apply bg-base-dark/10;
      }

      &:active {
        @apply bg-base-dark/15;
      }

      &-icon {
        @apply block;
        @apply pl-4;

        &::v-deep g [fill] {
          @apply fill-current text-base-dark opacity-100;
        }
      }

      &-text {
        @apply font-medium;
        @apply pl-4;
      }
    }
  }
}

.size {
  &-sm {
    .label {
      @apply p-2.5 pl-0;

      &-icon {
        @apply pl-2.5;
      }

      &-text {
        @apply text-sm;
        @apply pl-2.5;
      }
    }
  }

  &-md {
    .label {
      @apply p-3 pl-0;

      &-icon {
        @apply pl-3;
      }

      &-text {
        @apply text-base;
        @apply pl-3;
      }
    }
  }

  &-lg {
    .label {
      @apply p-4 pl-0;

      &-icon {
        @apply pl-4;
      }

      &-text {
        @apply text-lg;
        @apply pl-4;
      }
    }
  }
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .radio-wrapper {
    .radio {
      &:checked {
        & + .label {
          @apply bg-blue-50;
        }
      }

      &:focus {
        & + .label {
          @apply ring-0;
        }
      }
    }

    .label {
      @apply border border-blue-50;
      @apply bg-white;
    }
  }
}
</style>
