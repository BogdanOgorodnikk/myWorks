<template>
  <div class="form-group" :class="theme">
    <div class="input-block">
      <t-input
        :id="id"
        class="input"
        :value="value"
        :placeholder="placeholder"
        :type="inputType"
        :class="inputClass"
        :readonly="readonly"
        :disabled="disabled"
        :maxlength="maxLength"
        :inputmode="inputMode"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @change="onChange"
        @keyup.enter="onKeyupEnter"
        @keyup="onKeyup"
        @mouseleave="onMouseleave"
        @mousedown="onMousedown"
        @click="onClick"
      />

      <label v-if="isPasswordType" class="icon-label" :for="id">
        <OurSvgIcon
          :name="passwordIconName"
          color="gray"
          class="icon-label-password"
          @click="onClickShowPassword"
        />
      </label>

      <label v-if="isShownIconSlot" class="icon-label" :for="id">
        <!-- @slot Use it to add icon after text. -->
        <slot name="icon" />
      </label>
    </div>

    <label class="label" :class="labelClass" :for="id">
      {{ label }}
    </label>

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { getTheme, getRandomId } from "@ilevel/our.service.ui";
import ValidationServiceDefault from "@ilevel/our.service.validation";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TInput from "vue-tailwind/dist/t-input";

const { NUMBER_REG_EXP, LETTERS_AND_SYMBOLS_REG_EXP } = new ValidationServiceDefault();

const VALIDATION_RULES = {
  number: NUMBER_REG_EXP,
  symbol: LETTERS_AND_SYMBOLS_REG_EXP,
};

export default {
  name: "OurInput",
  components: {
    OurSvgIcon,
    TInput,
  },

  props: {
    /**
     * Set input size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set input value.
     */
    value: {
      type: [String, Number],
      default: "",
    },

    /**
     * Set input placeholder.
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * Set input label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set description for input.
     */
    description: {
      type: String,
      default: "",
    },

    /**
     * Set the maximum length of the input value.
     */
    maxLength: {
      type: String,
      default: "",
    },

    /**
     * Make input read only.
     */
    readonly: {
      type: Boolean,
      default: false,
    },

    /**
     * Make input inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Set input type.
     * @values text, number, email, tel, password, url
     */
    type: {
      type: String,
      default: "text",
      validator: (value) => !Object.keys(VALIDATION_RULES).includes(value),
    },

    /**
     * Set input mode.
     * @values none, text, decimal, numeric, tel, email, url
     */
    inputMode: {
      type: String,
      default: "text",
    },

    /**
     * Disable browsers autocomplete.
     */
    noAutocomplete: {
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
     * Prevents to input some kind of characters (for ex. only numbers).
     * @values number, symbol
     */
    validationRule: {
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
  },

  data: () => ({
    isTextType: false,
  }),

  computed: {
    theme() {
      return getTheme();
    },

    inputClass() {
      return {
        disabled: this.disabled,
        "size-sm": this.size === "sm",
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
        "error-input": this.error,
        "input-default-padding": !this.isShownIconSlot,
        "input-with-icon-padding": this.isShownIconSlot,
      };
    },

    isShownIconSlot() {
      return !!this.$slots["icon"];
    },

    labelClass() {
      return {
        "error-label": this.error,
        "size-label-sm": this.size === "sm",
        "size-label-md": this.size === "md",
        "size-label-lg": this.size === "lg",
      };
    },

    isPasswordType() {
      return this.type === "password";
    },

    inputType() {
      return this.isTextType ? "text" : this.type;
    },

    passwordIconName() {
      return this.isTextType ? "Visible" : "Hidden";
    },
  },

  mounted() {
    this.toggleReadonly(true);
  },

  methods: {
    onInput(value) {
      if (this.validationRule) {
        const input = document.querySelector(`#${this.id}`);

        if (VALIDATION_RULES[this.validationRule]) {
          value = this.transformValue(value, VALIDATION_RULES[this.validationRule]);
        } else {
          value = this.transformValue(value, this.validationRule);
        }

        input.value = value;
      }

      this.$emit("input", value);
    },

    onChange() {
      this.$emit("change");
    },

    onClick(event) {
      this.toggleReadonly(false);

      this.$emit("click", event);
    },

    onFocus() {
      this.toggleReadonly(false);

      this.$emit("focus");
    },

    onBlur() {
      this.toggleReadonly(true);

      this.$emit("blur");
    },

    onMouseleave() {
      this.toggleReadonly(true);
    },

    onMousedown() {
      this.$emit("mousedown");
    },

    onKeyupEnter() {
      this.$emit("keyupEnter");
    },

    onKeyup() {
      this.$emit("keyup");
    },

    onClickShowPassword() {
      this.isTextType = !this.isTextType;
    },

    toggleReadonly(hasReadonly) {
      if (this.noAutocomplete && !this.readonly) {
        const input = document.getElementById(this.id);

        hasReadonly
          ? input.setAttribute("readonly", "readonly")
          : input.removeAttribute("readonly");
      }
    },

    transformValue(value, exp) {
      const regExp = new RegExp(exp, "ig");
      const matches = String(value).match(regExp);

      return matches ? matches.join("") : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-group {
  @apply relative w-full;

  .input {
    @apply font-medium text-base-dark;
    @apply rounded-lg border border-solid border-gray-300 bg-white shadow-none;
    @apply w-full pl-4;

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    &:read-only {
      @apply border-gray-300 ring-0;
    }

    &:hover {
      @apply border-gray-400;
    }

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &-block {
      @apply relative flex;
    }

    &-default-padding {
      @apply pr-4;
    }

    &-with-icon-padding {
      @apply pr-11;
    }
  }

  .label {
    @apply absolute font-normal text-gray-500;
  }

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }

  .disabled {
    @apply text-base-dark;
    @apply border-gray-100 bg-gray-100 opacity-100;
    @apply cursor-default;

    &:hover {
      @apply border-gray-100;
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

    &-input {
      @apply border-red-300;

      &:hover {
        @apply border-red-400;
      }

      &:focus {
        @apply border-red-500 ring-red-100;
      }
    }
  }
}

.icon {
  &-label {
    @apply flex items-center justify-center;
    @apply h-full w-11;
    @apply absolute right-0;

    &-password {
      @apply cursor-pointer;

      &:hover {
        ::v-deep g [fill] {
          @apply transition duration-100 ease-in-out;
          @apply text-gray-500;
        }
      }
    }
  }
}

.size {
  &-sm {
    @apply text-xs;
    @apply pt-8 pb-2;

    &::placeholder {
      @apply text-xs;
    }
  }

  &-md {
    @apply text-base;
    @apply pt-7 pb-2.5;

    &::placeholder {
      @apply text-base;
    }
  }

  &-lg {
    @apply text-lg;
    @apply pt-8 pb-3;

    &::placeholder {
      @apply text-lg;
    }
  }

  &-label {
    &-sm {
      @apply text-xs;
      @apply left-4 top-2;
    }

    &-md {
      @apply text-sm;
      @apply left-4 top-2.5;
    }

    &-lg {
      @apply text-base;
      @apply left-4 top-3;
    }
  }
}
</style>
