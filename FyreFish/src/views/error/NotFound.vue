<template>
  <div>
    <h1 class="error-title">
      {{ $t("title.error.notFound") }}
    </h1>
    <p>{{ $t("page.notFound.description") }}</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style lang="postcss" scoped>
.error-title {
  @apply text-9xl;
}
</style>
