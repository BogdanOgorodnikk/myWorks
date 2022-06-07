<template>
  <div :class="theme" :data-cy="dataCy">
    <h3 v-if="label" class="label-title">{{ label }}</h3>

    <div
      v-for="item in options"
      :key="item.value"
      :class="labelClass"
      :data-cy="`${dataCy}-${item[valueKey]}`"
    >
      <div v-if="!item.hidden" class="label-wrapper">
        <t-radio
          :id="item[valueKey]"
          v-model="selectedItem"
          :disabled="disabled"
          class="radio"
          :name="name"
          :value="item[valueKey]"
        />

        <div>
          <label :for="item[valueKey]" class="radio-title">{{ item.title }}</label>

          <!-- @slot Use it to add some description. -->
          <slot name="description" :description="item.description">
            <div v-if="item.description" class="radio-description">{{ item.description }}</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import TRadio from "vue-tailwind/dist/t-radio";

export default {
  name: "OurRadioGroup",

  components: { TRadio },

  props: {
    /**
     * Set radio group label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Set name for radio.
     */
    name: {
      type: String,
      default: "",
    },

    /**
     * Set options for component.
     */
    options: {
      type: Array,
      default: () => [],
    },

    /**
     * Make radio group inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Set component value.
     */
    value: {
      type: [String, Number],
      default: "",
    },

    /**
     * Set track value key.
     */
    valueKey: {
      type: String,
      default: "value",
    },

    /**
     * Set test dataCy for radio group.
     */
    dataCy: {
      type: String,
      default: "radio",
    },
  },

  data: () => ({
    selected: "",
  }),

  computed: {
    labelClass() {
      return {
        "label-margin": this.label,
      };
    },

    theme() {
      return getTheme();
    },

    selectedItem: {
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
  &-title {
    @apply text-sm font-normal text-gray-500;
    @apply mb-6;
  }

  &-wrapper {
    @apply inline-flex;
  }

  &-margin {
    @apply ml-4 mb-4;
  }
}

.radio {
  @apply border border-solid border-gray-300;
  @apply h-6 w-6;

  &:hover {
    @apply border-gray-400;
  }

  &:active {
    @apply border-base-dark bg-base-dark;
  }

  &:focus {
    @apply border-gray-500 !bg-base-dark ring-4 ring-gray-200;
  }

  &:checked {
    @apply border-base-dark bg-base-dark;

    &:hover {
      @apply bg-base-dark;
    }
  }

  &:disabled {
    @apply border-gray-100 bg-gray-100;
  }

  &-title {
    @apply block;
    @apply text-base font-medium text-base-dark;
    @apply pl-4 pt-0.5;
  }

  &-description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-1;
  }
}
</style>
