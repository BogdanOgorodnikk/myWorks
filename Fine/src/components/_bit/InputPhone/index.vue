<template>
  <div class="phone-wrapper" :class="theme">
    <label class="label" :class="labelClass" :for="id">
      {{ label }}
    </label>

    <vue-tel-input
      v-model="phoneValue"
      class="phone"
      :class="phoneClass"
      :input-options="inputOptions"
      :enabled-flags="flags"
      :dropdown-options="dropdownOptions"
      :input-id="id"
      :preferred-countries="preferredCountries"
      :default-country="defaultCountry"
      :placeholder="placeholder"
      :mode="mode"
      :only-countries="onlyCountries"
      :disabled="disabled"
      inputmode="tel"
    >
      <template #arrow-icon>
        <!-- @slot Use it to add arrow icon. -->
        <slot name="arrow-icon">
          <OurSvgIcon class="icon" name="Angle-down" color="gray" />
        </slot>
      </template>
    </vue-tel-input>

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import { getTheme, getRandomId } from "@ilevel/our.service.ui";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurPhoneInput",

  components: {
    OurSvgIcon,
    VueTelInput,
  },

  props: {
    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },

    /**
     * Set input phone mode.
     * @values auto, national, international
     */
    mode: {
      type: String,
      default: "international",
    },

    /**
     * Set input placeholder.
     */
    placeholder: {
      type: String,
      default: "default",
    },

    /**
     * Show / hide dial code.
     */
    dialCode: {
      type: Boolean,
      default: true,
    },

    /**
     * Set input label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set input size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set error message.
     */
    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
    },

    /**
     * Add description under field.
     */
    description: {
      type: String,
      default: "",
    },

    /**
     * Set input value.
     */
    value: {
      type: String,
      default: "",
      required: true,
    },

    /**
     * Set the maximum length of the input value.
     */
    maxLength: {
      type: Number,
      default: 13,
    },

    /**
     * Show / hide country flags
     */
    flags: {
      type: Boolean,
      default: true,
    },

    /**
     * Set countries that will be displayed first.
     */
    preferredCountries: {
      type: Array,
      default: () => ["UA"],
    },

    /**
     * Set default country.
     */
    defaultCountry: {
      type: String,
      default: "UA",
    },

    /**
     * Set list of countries to display.
     */
    onlyCountries: {
      type: Array,
      default: () => [],
    },

    /**
     * Set unique element dropdown table index.
     * @ignore
     */
    dropdownTabIndex: {
      type: String,
      default: "1",
    },

    /**
     * Make input inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputOptions: {
        placeholder: this.placeholder,
        showDialCode: this.dialCode,
        maxLen: this.maxLength,
      },
      dropdownOptions: {
        tabindex: this.dropdownTabIndex,
      },
    };
  },

  computed: {
    phoneValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    theme() {
      return getTheme();
    },

    phoneClass() {
      const size = `size-${this.size}`;
      const classes = {
        disabled: this.disabled,
        error: this.error,
      };

      return [classes, size];
    },

    labelClass() {
      return {
        "label-sm": this.size === "sm",
        "label-md": this.size === "md",
        "label-lg": this.size === "lg",
        "error-label": this.error,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.phone-wrapper {
  @apply relative;

  .phone {
    @apply rounded-lg border border-solid border-gray-300;
    @apply relative transition duration-100 ease-in-out;

    &:hover {
      @apply border-gray-400;
    }

    &:focus-within {
      @apply border border-solid border-gray-500;
      @apply ring-4 ring-gray-600 ring-opacity-15;
    }

    .icon {
      @apply transition-all duration-300;
    }

    &::v-deep {
      input {
        @apply font-medium text-base-dark;
        @apply pl-4 pr-20;
        @apply rounded-lg;

        &:focus {
          @apply shadow-none ring-0;
        }

        &::placeholder {
          @apply font-medium text-gray-400;
        }
      }

      .vti__dropdown {
        @apply w-auto items-end;
        @apply absolute right-0 px-0;
        @apply outline-none outline-0 outline-offset-0;

        &:hover {
          @apply bg-transparent;

          .vti__flag {
            @apply shadow-md;
          }
        }

        &:focus-visible {
          @apply outline-none outline-0 outline-offset-0;
        }

        &.open {
          @apply w-full;
        }
      }

      .vti__selection {
        @apply pr-4;
        @apply outline-none outline-0 outline-offset-0;
      }

      .open {
        @apply bg-transparent;

        &:focus {
          .icon {
            @apply rotate-180 transform;
          }
        }

        .vti__selection .vti__flag {
          @apply shadow-lg;
        }
      }

      .vti__flag {
        @apply rounded shadow;
        @apply outline-none outline-0 outline-offset-0;
      }

      .vti__dropdown-list {
        @apply relative z-20 -mt-3.5 w-full;
        @apply rounded-lg border-gray-300 shadow-md;

        &:focus-visible {
          @apply outline-none outline-0 outline-offset-0;
        }
      }

      .vti__dropdown-item {
        @apply py-2.5 px-4;

        strong,
        span {
          @apply text-base font-normal text-base-dark;
        }

        &:hover {
          @apply bg-gray-100;
        }

        &:active {
          @apply bg-gray-200 font-medium;

          strong {
            @apply bg-gray-200 font-medium;
          }
        }

        &.last-preferred {
          @apply border-gray-300;
        }
      }
    }
  }

  .description {
    @apply text-xs font-normal text-gray-500;
    @apply pl-4 pt-2;
  }

  .size {
    &-sm::v-deep {
      input {
        @apply text-xs;
        @apply pt-6 pb-2;

        &::placeholder {
          @apply text-xs;
        }
      }

      .vti__dropdown {
        @apply top-2;
      }
    }

    &-md::v-deep {
      input {
        @apply text-base;
        @apply pt-7 pb-2.5;

        &::placeholder {
          @apply text-base;
        }
      }

      .vti__dropdown {
        @apply top-3.5;
      }
    }

    &-lg::v-deep {
      input {
        @apply text-lg;
        @apply pt-8 pb-3;

        &::placeholder {
          @apply text-lg;
        }
      }

      .vti__dropdown {
        @apply top-5;
      }
    }
  }

  .label {
    @apply font-normal text-gray-500;
    @apply absolute z-10;

    &:hover {
      & + .phone {
        @apply border-gray-400;
      }

      & + .vue-tel-input {
        &:focus-within {
          @apply border-gray-500;
        }
      }
    }

    &-sm {
      @apply text-xs;
      @apply left-4 top-2;
    }

    &-md {
      @apply left-4 text-sm;
      @apply top-2.5;
    }

    &-lg {
      @apply left-4 text-base;
      @apply top-3;
    }
  }

  .error {
    @apply border-red-300;

    &:hover {
      @apply border-red-400;
    }

    &:focus-within {
      @apply border-red-500 ring-red-100;
    }

    &-label {
      @apply text-red-500;

      &:hover {
        & + .error {
          @apply border-red-400;

          &:focus-within {
            @apply border-red-500 ring-red-100;
          }
        }
      }
    }

    &-message {
      @apply text-xs font-normal text-red-500;
      @apply pl-4 pt-2;
    }
  }

  .disabled::v-deep {
    @apply border-gray-100;

    &:hover {
      @apply border-gray-100;
    }

    &:focus-within {
      @apply border-gray-100 ring-0;
    }

    input {
      @apply text-gray-500;
      @apply bg-gray-100 opacity-100;
      @apply cursor-default;
    }
  }
}
</style>
