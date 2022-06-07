<template>
  <div class="form" :class="theme">
    <div class="wrapper" :class="wrapperClass">
      <label class="label" :class="labelClass" :for="id">
        {{ label }}
      </label>

      <div class="textarea-block">
        <t-textarea
          :id="id"
          ref="textarea"
          class="textarea"
          :value="value"
          :placeholder="placeholder"
          :type="type"
          :class="textareaClass"
          :disabled="disabled"
          :rows="rows"
          :inputmode="inputMode"
          @blur="onBlur"
          @input="onInput"
        />

        <label v-if="isShownIconSlot" class="icon-label" :for="id">
          <slot name="icon" />
        </label>
      </div>
    </div>

    <p v-if="error" class="error-message" data-cy="textarea-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { getTheme, getRandomId } from "@ilevel/our.service.ui";
import TTextarea from "vue-tailwind/dist/t-textarea";

export default {
  name: "OurTextarea",

  components: {
    TTextarea,
  },

  props: {
    /**
     * Set proper keyboard on mobile devices.
     * @values text, none, decimal, tel, numeric, search, email, url,
     */
    inputMode: {
      type: String,
      default: "text",
    },

    /**
     * Set input label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set component placeholder.
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * Set component value.
     */
    value: {
      type: String,
      default: "",
    },

    /**
     * Set input type.
     * @values text, number, email, tel, password, url
     */
    type: {
      type: String,
      default: "text",
    },

    /**
     * Make input inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Set error message.
     */
    error: {
      type: String,
      default: "",
    },

    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },

    /**
     * Set description for component.
     */
    description: {
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
     * Set number of visible rows.
     */
    rows: {
      type: String,
      default: "2",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    textareaClass() {
      return {
        disabled: this.disabled,
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "error-textarea": this.error,
      };
    },

    wrapperClass() {
      return {
        disabled: this.disabled,
        "error-wrapper": this.error,
      };
    },

    labelClass() {
      return {
        "error-label": this.error,
        "label-sm": this.size === "sm",
        "label-md": this.size === "md",
        "label-lg": this.size === "lg",
      };
    },

    isShownIconSlot() {
      return !!this.$slots["icon"];
    },
  },

  methods: {
    onInput(value) {
      this.$emit("input", value);
    },

    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="postcss" scoped>
.form {
  @apply relative;

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }

  .disabled {
    @apply text-gray-500;
    @apply border-gray-100 bg-gray-100;
  }

  .wrapper {
    @apply rounded-lg border border-solid border-gray-300 shadow-none;
    @apply relative;

    label {
      @apply z-10;
    }

    &:hover {
      @apply border-gray-400;
    }

    &:focus-within {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    .textarea-block {
      @apply relative flex;

      .textarea {
        @apply font-medium text-base-dark;
        @apply resize-none rounded-lg border-0 outline-none;
        @apply pt-0 pl-4;
        @apply w-full;

        &:focus {
          @apply ring-0;
        }

        &::placeholder {
          @apply font-medium text-gray-400;
        }
      }

      .icon-label {
        @apply flex items-center justify-center;
        @apply w-11 pt-5;
        @apply absolute right-0;
      }
    }
  }
}

.size {
  &-sm {
    @apply text-xs;
    @apply pb-2 pr-4;

    &::placeholder {
      @apply text-xs;
    }
  }

  &-md {
    @apply text-base;
    @apply pb-2.5 pr-4;

    &::placeholder {
      @apply text-base;
    }
  }

  &-lg {
    @apply text-lg;
    @apply pb-3 pr-4;

    &::placeholder {
      @apply text-lg;
    }
  }
}

.label {
  @apply block font-normal text-gray-500;
  @apply pl-4;

  &-sm {
    @apply text-xs;
    @apply pt-2 pb-0.5;
  }

  &-md {
    @apply text-sm;
    @apply pt-2.5 pb-1;
  }

  &-lg {
    @apply text-base;
    @apply pt-3 pb-1.5;
  }
}

.error {
  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }

  &-label {
    @apply text-red-500;
  }

  &-wrapper {
    @apply border-red-300;

    &:hover {
      @apply border-red-400;
    }

    &:focus-within {
      @apply border-red-500 ring-red-100;
    }
  }
}
</style>
