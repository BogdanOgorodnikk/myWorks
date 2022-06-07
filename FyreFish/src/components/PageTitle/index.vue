<template>
  <div class="account-title">{{ customerName }}</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["customerName"]),
  },
};
</script>

<style lang="postcss" scoped>
.account-title {
  @apply text-4xl font-medium text-base-dark;
  @apply mb-11;
}
</style>
