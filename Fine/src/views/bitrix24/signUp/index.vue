<template>
  <OurCard class="auth-card">
    <h1 class="auth-title">{{ $t("page.signUp.title") }}</h1>

    <div class="auth-wrapper">
      <img :src="iconLink" alt="bx24" class="icon" />
      <div>
        <div class="auth-description-name">
          Name Surname
          <span class="auth-description">(ID 94)</span>
        </div>

        <div class="auth-description">user@gmail.com</div>

        <div class="auth-description">380123456789</div>
      </div>
    </div>

    <div class="auth-rules" v-html="$t('page.signUp.acceptRule')" />

    <OurButton :text="$t('button.signUp')" size="lg" class="auth-button" />

    <router-link :to="{ name: 'Bitrix24Connect' }" class="auth-link">
      {{ $t("page.bitrix24.signUp.haveAccount") }}
    </router-link>
  </OurCard>
</template>

<script>
export default {
  computed: {
    iconLink() {
      return require("@/assets/images/logos/crm/bitrix24.png");
    },
  },
};
</script>

<style lang="postcss" scoped>
.auth {
  &-card {
    @apply w-full p-8 md:w-125;
  }

  &-title {
    @apply text-center text-3xl font-bold text-base-dark;
  }

  &-wrapper {
    @apply flex items-center;
    @apply rounded-lg bg-gray-100;
    @apply p-4;
  }

  &-description {
    @apply text-xs font-normal text-gray-700;

    &-name {
      @apply text-base font-medium;
    }
  }

  &-rules {
    @apply text-sm font-normal text-gray-500;
    @apply px-4;

    &::v-deep a {
      @apply underline;
    }
  }

  &-button {
    @apply w-full;
    @apply mt-8 !important;
  }

  &-link {
    @apply text-sm font-normal text-gray-500 underline;
    @apply block text-center;
  }
}

.icon {
  @apply h-10 w-10;
  @apply mr-4;
}
</style>
