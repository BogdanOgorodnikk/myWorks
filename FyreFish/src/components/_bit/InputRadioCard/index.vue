<template>
  <div class="wrapper" :class="[gridColsClass, theme]">
    <label
      v-for="item in options"
      :key="item.value"
      class="card"
      :class="selectedItemClass(item.value)"
    >
      <t-radio v-model="selectedItem" class="radio" :name="name" :value="item.value" />

      <div class="card-wrapper">
        <slot v-if="withIcon" name="icon" :item="item">
          <OurSvgIcon :name="item.iconName" size="xl" class="icon" />
        </slot>

        <div class="card-title">{{ item.title }}</div>

        <div class="card-description">{{ item.description }}</div>
      </div>
    </label>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TRadio from "vue-tailwind/dist/t-radio";

export default {
  name: "OurRadioCard",

  components: {
    OurSvgIcon,
    TRadio,
  },

  props: {
    name: {
      type: String,
      default: "",
    },

    options: {
      type: Array,
      default: () => [],
    },

    value: {
      type: [String, Number, Boolean],
      default: "",
    },

    gridCols: {
      type: Number,
      default: 2,
    },

    withIcon: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    selectedItem: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    gridColsClass() {
      return {
        "grid-cols-1": this.isMobileDevice,
        "grid-cols-2": this.gridCols === 2 && !this.isMobileDevice,
        "grid-cols-3": this.gridCols === 3 && !this.isMobileDevice,
        "grid-cols-4": this.gridCols === 4 && !this.isMobileDevice,
      };
    },

    theme() {
      return getTheme();
    },
  },

  methods: {
    selectedItemClass(value) {
      return {
        "selected-option": this.selectedItem === value,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply grid grid-rows-1 gap-4 md:gap-6;
}

.card {
  @apply rounded-lg border border-solid border-gray-300;
  @apply cursor-pointer pt-4 pl-6 pr-6 pb-6;
  @apply relative w-full;

  &:hover {
    @apply border-gray-400;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  .radio {
    @apply border border-solid border-gray-300;
    @apply h-6 w-6;
    @apply absolute top-4 right-4;

    &:focus {
      @apply ring-0;
    }

    &:active {
      @apply border-base-dark bg-base-dark;
    }

    &:checked {
      @apply border-base-dark bg-base-dark;
    }
  }

  &-wrapper {
    @apply text-center;

    .icon {
      &::v-deep {
        g [fill] {
          @apply fill-current text-blue-500;
        }
      }
    }
  }

  &-title {
    @apply text-base font-medium text-base-dark;
    @apply mt-3 mb-1;
  }

  &-description {
    @apply text-xs font-normal text-gray-450;
  }
}

.selected-option {
  @apply border-gray-500;
}
</style>
