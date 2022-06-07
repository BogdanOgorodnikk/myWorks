<template>
  <div class="more-buttons-wrapper">
    <slot v-for="button in buttons" :button="button" />
  </div>
</template>

<script>
export default {
  name: "OurMoreButton",

  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="postcss" scoped>
.more-buttons-wrapper:empty {
  @apply hidden;
}
</style>
