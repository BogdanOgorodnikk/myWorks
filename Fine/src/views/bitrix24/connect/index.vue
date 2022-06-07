<template>
  <OurCard class="auth-card">
    <h1 class="auth-title">{{ $t("page.bitrix24.connect.connectToBx24") }}</h1>

    <OurInput :label="$t('label.yourPortalAddress')" disabled>
      <template #icon>
        <OurSvgIcon name="Duplicate" class="input-icon" />
      </template>
    </OurInput>

    <div class="auth-rules">
      <div class="auth-rules-title">
        {{ $t("page.bitrix24.connect.integrationWithBx24Rules") }}
      </div>

      <ul class="auth-rules-list">
        <li class="auth-rules-item">{{ $t("page.bitrix24.connect.goInSettingsBx24") }}</li>
        <li class="auth-rules-item">{{ $t("page.bitrix24.connect.writeAddressOnPortal") }}</li>
        <li class="auth-rules-item">{{ $t("page.bitrix24.connect.clickOnIntegrate") }}</li>
      </ul>
    </div>

    <OurButton :text="$t('button.refreshPage')" size="lg" class="auth-button" />

    <router-link :to="{ name: 'Bitrix24SignUp' }" class="auth-link">
      {{ $t("page.bitrix24.connect.createNewAccount") }}
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

  &-button {
    @apply w-full;
    @apply mt-8 !important;
  }

  &-link {
    @apply text-sm font-normal text-gray-500 underline;
    @apply block text-center;
  }

  &-rules {
    @apply rounded-lg bg-gray-100;
    @apply space-y-2.5 p-4;

    &-title {
      @apply text-xs font-bold text-gray-500;
    }

    &-list {
      @apply list-inside list-disc;
      @apply ml-2;
    }

    &-item {
      @apply text-xs font-normal text-gray-500;
    }
  }
}

.input-icon {
  @apply h-full w-full;
  @apply absolute inset-y-1/3;
  @apply pl-2;

  &::v-deep g [fill] {
    @apply fill-current text-gray-500;
  }
}
</style>
