<template>
  <t-dropdown :classes="dropdownClasses" toggle-on-focus class="dropdown">
    <div
      slot="trigger"
      slot-scope="{ keydownHandler, focusHandler, mousedownHandler, blurHandler }"
      class="relative"
    >
      <button
        ref="dropdown"
        class="dropdown-wrapper"
        :class="buttonClass"
        @mousedown="[mousedownHandler(), onMouseDownRotateIcon()]"
        @focus="focusHandler"
        @keydown="keydownHandler"
        @blur="[blurHandler($event), onBlutRotateIcon()]"
      >
        {{ text }}
        <OurSvgIcon v-if="dropdownIcon" name="Angle-down" class="icon" :class="iconClass" />
      </button>
    </div>
    <div slot-scope="{ hide }" class="dropdown-list" @click="hide()">
      <!-- @slot Use it to add something instead. -->
      <slot name="items" />
    </div>
  </t-dropdown>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TDropdown from "vue-tailwind/dist/t-dropdown";

export default {
  name: "OurDropdown",

  components: {
    OurSvgIcon,
    TDropdown,
  },

  props: {
    /**
     * Set button text.
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * The variant of the button.
     * @values primary, secondary, thirdary, transparent, link
     */
    variant: {
      type: String,
      default: "primary",
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Make the dropdown icon visible.
     */
    dropdownIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * The position of dropdown list on the y-axis.
     * @values top, bottom
     */
    listYPosition: {
      type: String,
      default: "bottom",
    },

    /**
     * The position of dropdown list on the x-axis.
     * @values left, right
     */
    listXPosition: {
      type: String,
      default: "right",
    },
  },

  data: () => ({
    isShownItems: false,
  }),

  computed: {
    buttonClass() {
      return `${this.variant} size-${this.size}`;
    },

    dropdownListYPosition() {
      return this.listYPosition === "bottom" ? "top-0" : "bottom-12";
    },

    dropdownListXPosition() {
      return this.listXPosition === "right" ? "dropdown-list-right" : "left-0";
    },

    iconClass() {
      return this.isShownItems ? "icon-rotate" : "";
    },

    dropdownClasses() {
      return {
        button: `block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border
          border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2
          focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50
          disabled:cursor-not-allowed`,
        wrapper: "inline-flex flex-col",
        dropdownWrapper: "relative z-10",
        dropdown: `${
          (this.dropdownListYPosition, this.dropdownListXPosition)
        } absolute w-56 rounded-lg shadow bg-white mt-1`,
        enterClass: "opacity-0 scale-95",
        enterActiveClass: "transition transform ease-out duration-100",
        enterToClass: "opacity-100 scale-100",
        leaveClass: "opacity-100 scale-100",
        leaveActiveClass: "transition transform ease-in duration-75",
        leaveToClass: "opacity-0 scale-95",
      };
    },
  },

  methods: {
    onMouseDownRotateIcon() {
      this.isShownItems = !this.isShownItems;
    },

    onBlutRotateIcon() {
      this.isShownItems = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
.dropdown-wrapper {
  @apply font-medium;
  @apply rounded-lg outline-none;
  @apply transition duration-100 ease-in-out;
  @apply pr-9 pl-4 outline-none;
  @apply flex items-center;

  &:focus {
    @apply ring-4 ring-gray-200;
  }
}

.dropdown-list-bottom {
  @apply top-0;
}

.dropdown-list-top {
  @apply bottom-12;
}

.icon {
  @apply absolute right-3 transition-all duration-300;
}

.icon-rotate {
  @apply rotate-180 transform;
}

.size-xs {
  @apply text-xs;
}

.size-sm {
  @apply text-sm;
}

.size-md {
  @apply text-base;
  @apply py-3;

  .icon {
    @apply top-2.5;
  }
}

.size-lg {
  @apply text-lg;
  @apply py-4;

  .icon {
    @apply top-4;
  }
}

.primary {
  @apply border border-solid border-base-dark bg-base-dark text-white;

  .icon::v-deep g [fill] {
    @apply fill-current text-white;
  }

  &:hover {
    @apply border-gray-700 bg-gray-700;
  }

  &:focus {
    @apply bg-gray-700;
  }

  &:active {
    @apply border-gray-600 bg-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-300 bg-white;
  }
}

.secondary {
  @apply border border-solid border-base-dark bg-transparent text-base-dark;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:hover {
    @apply border-gray-700 text-gray-700;
  }

  &:focus {
    @apply border-gray-700 text-gray-700;
  }

  &:active {
    @apply border-gray-600 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
    @apply border-gray-300;
  }
}

.thirdary {
  @apply border border-solid border-transparent bg-transparent text-base-dark;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:hover {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-5;
  }

  &:focus {
    @apply border-gray-200 bg-base-dark bg-opacity-5;
  }

  &:active {
    @apply border-base-dark border-opacity-0 bg-base-dark bg-opacity-10 text-gray-600;
  }

  &:disabled {
    @apply text-gray-400;
  }
}

.transparent {
  @apply border bg-base-dark bg-opacity-5;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:focus {
    @apply border-gray-100 bg-opacity-10 ring-4 ring-gray-100;
  }

  &:hover {
    @apply bg-opacity-10;
  }

  &:active {
    @apply bg-opacity-15;
  }
}

.link {
  @apply font-normal text-gray-500;
  @apply border border-t-0 border-r-0 border-l-0 border-dashed border-gray-500;
  @apply rounded-none bg-transparent;
  @apply p-0;

  .icon::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }

  &:focus {
    @apply ring-0;
  }
}

.dropdown-list {
  @apply max-h-44 overflow-x-auto overflow-y-auto rounded-lg;
}

::v-deep .dropdown-list-right {
  @apply right-0;
  @apply w-max;
}

::v-deep .dropdown-list div {
  @apply text-base font-normal text-base-dark;
  @apply p-3;
}

::v-deep .dropdown-list div:hover {
  @apply cursor-pointer bg-gray-100;
}

::v-deep .dropdown-list div:active {
  @apply bg-gray-200 font-medium;
}

::v-deep .dropdown-list div:disabled {
  @apply bg-gray-500;
}
</style>
