<template>
  <div class="multistate-wrapper" :class="theme" @click="onClickChangeActiveOption">
    <div class="multistate-checkbox" :class="[checkboxCheckedClass, checkboxSize]">
      <OurSvgIcon
        v-if="selectedStateIcon"
        class="multistate-checkbox-icon"
        :name="selectedStateIcon"
        :size="iconSize"
      />

      <t-checkbox class="checkbox" :value="selectedState" />
    </div>

    <label v-if="selectedStateLabel" class="multistate-checkbox-title">
      {{ selectedStateLabel }}
    </label>
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TCheckbox from "vue-tailwind/dist/t-checkbox";

export default {
  name: "OurMultiStateCheckbox",

  components: { OurSvgIcon, TCheckbox },

  props: {
    value: {
      type: [String, Boolean, Number],
      default: "",
    },

    options: {
      type: Array,
      default: () => [],
    },

    iconSize: {
      type: String,
      default: "",
    },

    trackBy: {
      type: String,
      default: "id",
    },

    size: {
      type: String,
      default: "md",
    },
  },

  data: () => ({
    index: 0,
    selectedState: "",
  }),

  computed: {
    theme() {
      return getTheme();
    },

    checkboxCheckedClass() {
      return this.index > 0 ? "multistate-checkbox-checked" : "";
    },

    checkboxSize() {
      return `size-${this.size}`;
    },

    selectedStateIcon() {
      return this.options[this.index]?.iconName;
    },

    selectedStateLabel() {
      return this.options[this.index]?.label;
    },
  },

  watch: {
    value: "onChangeValue",
  },

  methods: {
    onClickChangeActiveOption() {
      this.index += 1;

      if (this.index >= this.options.length) {
        this.index = 0;
      }

      this.changeSelectedState();
    },

    onChangeValue() {
      this.index = this.options.findIndex((item) => item[this.trackBy] === this.value);
    },

    changeSelectedState() {
      const activeOption = this.options[this.index];

      this.selectedState = activeOption[this.trackBy];

      this.$emit("input", this.selectedState);
    },
  },
};
</script>

<style lang="postcss" scoped>
.multistate {
  &-wrapper {
    @apply flex;
    @apply cursor-pointer;
  }

  &-checkbox {
    @apply flex items-center justify-center;
    @apply rounded border border-solid border-gray-300;
    @apply bg-white;
    @apply relative;

    &:hover {
      @apply border-gray-400;
    }

    &:focus-within {
      @apply border-gray-500 ring-4 ring-gray-200;
    }

    &:active {
      @apply border-base-dark bg-base-dark;
    }

    .checkbox {
      @apply opacity-0;
      @apply absolute top-0 left-0;
      @apply h-full w-full;
      @apply cursor-pointer;
    }

    &-checked {
      @apply border-base-dark bg-base-dark;

      &:hover {
        @apply border-base-dark;
      }
    }

    &-icon::v-deep g [fill] {
      @apply fill-current text-white;
    }

    &-title {
      @apply flex flex-col justify-center;
      @apply text-sm font-normal text-base-dark;
      @apply pl-4;
    }
  }
}

.size {
  &-md {
    @apply h-5 w-5;
  }

  &-lg {
    @apply h-6 w-6;
  }
}
</style>
