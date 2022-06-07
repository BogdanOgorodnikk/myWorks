<template>
  <div :class="theme">
    <h3 v-if="label" class="label-title" :class="titleClass">{{ label }}</h3>

    <label
      v-for="option in options"
      :key="option[trackBy]"
      :data-cy="`${dataCy}-${option[trackBy]}`"
      class="label"
      :class="labelClass"
    >
      <div class="label-box">
        <t-checkbox
          v-model="selected"
          :disabled="disabled"
          class="checkbox"
          :value="option[trackBy]"
        />
        <div>
          <p class="checkbox-title">{{ option[itemLabel] }}</p>
          <p v-if="option.description" class="checkbox-description">{{ option.description }}</p>
        </div>
      </div>
    </label>

    <p v-if="error" class="error-message" data-cy="checkbox-group-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import TCheckbox from "vue-tailwind/dist/t-checkbox";

export default {
  name: "OurCheckboxGroup",

  components: { TCheckbox },

  props: {
    label: {
      type: String,
      default: "",
    },

    value: {
      type: Array,
      default: () => [],
    },

    options: {
      type: Array,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    trackBy: {
      type: String,
      default: "id",
    },

    itemLabel: {
      type: String,
      default: "label",
    },

    error: {
      type: String,
      default: "",
    },

    dataCy: {
      type: String,
      default: "checkbox",
    },
  },

  computed: {
    titleClass() {
      return {
        "error-title": this.error,
      };
    },

    labelClass() {
      return {
        "label-separated": this.label,
      };
    },

    theme() {
      return getTheme();
    },

    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
.label {
  @apply block max-w-max;

  &-separated {
    @apply ml-4 mt-4;
  }

  &-title {
    @apply text-sm font-normal text-gray-500;
  }

  &-box {
    @apply inline-flex;
  }
}

.checkbox {
  @apply border border-solid border-gray-300;
  @apply h-6 w-6;

  &:hover {
    @apply border-gray-400;
  }

  &:active {
    @apply border-base-dark bg-base-dark;
  }

  &:checked {
    @apply border-base-dark bg-base-dark;
  }

  &:focus {
    @apply border-gray-500 ring-4 ring-gray-200;
  }

  &:disabled {
    @apply border-gray-100 bg-gray-100;
  }

  &-title {
    @apply cursor-pointer text-base font-medium text-base-dark;
    @apply pl-4 pt-0.5;
  }

  &-description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-1;
  }
}

.error {
  &-title {
    @apply text-red-500;
  }

  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }
}
</style>
