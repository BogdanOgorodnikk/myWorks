<template>
  <OurButton class="button" variant="transparent" @click="onClick">
    <template #icon-right>
      <OurSvgIcon name="Arrow-left" class="icon" />
    </template>
  </OurButton>
</template>

<script>
export default {
  name: "OurArrowButton",

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="postcss" scoped>
.button::v-deep {
  @apply flex flex-col items-center justify-center;
  @apply bg-base-dark bg-opacity-5;
  @apply h-10 w-10 rounded-full;
  @apply transition duration-100 ease-in-out;

  &:hover {
    @apply bg-opacity-10;

    .icon g [fill] {
      @apply text-gray-700;
    }
  }

  &:active {
    @apply bg-opacity-15;

    .icon g [fill] {
      @apply text-gray-600;
    }
  }

  &:focus {
    @apply border-gray-100 bg-opacity-10 ring-4 ring-gray-100;

    .icon g [fill] {
      @apply text-gray-700;
    }
  }

  .icon {
    g rect {
      @apply opacity-100;
    }

    g [fill] {
      @apply fill-current text-base-dark;
    }
  }
}
</style>
