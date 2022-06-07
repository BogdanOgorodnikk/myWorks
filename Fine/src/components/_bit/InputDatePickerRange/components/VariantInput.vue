<template>
  <div :id="id" class="date-input" tabindex="1" @click="onClickRangeSet" @blur="onBlur">
    <div>
      <div class="date-input-label">{{ label }}</div>

      <div class="date-input-title">{{ title }}</div>

      <div v-if="!title" class="date-input-placeholder">{{ placeholder }}</div>
    </div>

    <div @click.stop>
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      default: "",
    },
  },

  methods: {
    onClickRangeSet() {
      this.$emit("clickRangeSet");
    },

    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="postcss" scoped>
.date {
  &-input {
    @apply flex items-center justify-between;
    @apply relative cursor-text;
    @apply rounded-lg border border-gray-300 bg-white;
    @apply px-4 py-2.5;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    &:focus-within {
      @apply outline-0;
    }

    &-title {
      @apply text-base font-medium text-base-dark;
    }

    &-placeholder {
      @apply text-base font-medium text-gray-400;
    }

    &-label {
      @apply pb-0.5;
      @apply text-sm font-normal text-gray-500;
    }
  }
}
</style>
