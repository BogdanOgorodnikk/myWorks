<template>
  <div class="user">
    <div class="user-wrapper">
      <div class="user-wrapper-title">{{ $t("label.username") }}:</div>
      <div class="user-wrapper-description">{{ user.userName }}</div>
    </div>

    <div class="user-wrapper">
      <div class="user-wrapper-title">{{ $t("label.email") }}:</div>
      <div class="user-wrapper-description">{{ user.primaryEmail }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="postcss" scoped>
.user {
  @apply my-2 w-100 space-y-2 border-l-2 border-gray-300 pl-4;

  &-wrapper {
    @apply flex justify-between pb-1;

    &-title {
      @apply my-auto w-1/2 text-base font-bold text-base-dark;
    }

    &-description {
      @apply w-1/2 text-base font-normal text-gray-500;
    }
  }
}
</style>
