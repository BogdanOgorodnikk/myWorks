<template>
  <div class="register">
    <div class="register-title">{{ $t("title.signUp") }}</div>

    <div class="register-help-wrapper">
      <div class="register-help-title">{{ $t("title.help") }}</div>

      <OurLink
        dashed
        router-link
        :route="contactUsRoute"
        class="register-help-link"
        :text="$t('button.contactUs')"
        variant="secondary"
        size="lg"
      />
    </div>

    <OurCard class="card">
      <div class="final-title">{{ $t("page.signUp.successfullySigned") }}</div>
      <div class="final-description">{{ $t("page.signUp.receiveOnEmailPackage") }}</div>
      <div class="final-description">{{ $t("page.signUp.clickBelowToLogin") }}</div>

      <OurButton
        :text="$t('button.separatedLogIn')"
        size="lg"
        class="final-button"
        @click="onClickGoToLogin"
      />
    </OurCard>
  </div>
</template>

<script>
export default {
  name: "SignUpSuccess",

  computed: {
    contactUsRoute() {
      return { name: "ContactUs" };
    },
  },

  methods: {
    onClickGoToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full max-w-2xl !important;
  @apply text-center;
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 -mt-7;
  }

  &-help {
    &-title {
      @apply text-lg font-normal text-gray-500;
    }

    &-wrapper {
      @apply flex items-center justify-center;
      @apply mb-8;
    }

    &-link {
      @apply pt-px pl-1.5;
    }
  }
}

.final {
  &-title {
    @apply text-base font-bold text-base-dark;
    @apply mt-2;
  }

  &-description {
    @apply text-base font-normal text-base-dark;
  }

  &-button {
    @apply block w-auto !important;
    @apply mx-auto mt-10;
  }
}
</style>
