<template>
  <t-card no-body class="card" :class="theme">
    <slot />
  </t-card>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";
import TCard from "vue-tailwind/dist/t-card";

export default {
  name: "OurCard",

  components: {
    TCard,
  },

  computed: {
    theme() {
      return getTheme();
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply rounded-2xl border-0 bg-white shadow;
  @apply space-y-4 p-4 md:space-y-6 md:p-6;
  @apply w-full;
}
</style>

<!-- sweet theme -->
<style lang="postcss" scoped>
.sweet-theme {
  &.card {
    @apply bg-white shadow-none;
  }
}
</style>
