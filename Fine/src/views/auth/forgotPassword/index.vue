<template>
  <OurCard class="card" data-cy="forgot-password-page">
    <div>
      <h2 class="forgot-title">{{ $t("page.forgotPassword.title") }}</h2>

      <p class="forgot-description">{{ $t("page.forgotPassword.description") }}</p>
    </div>

    <OurInput
      v-model="form.email"
      data-cy="email-input"
      :label="$t('label.email')"
      :placeholder="$t('placeholder.email')"
      :error="emailError"
      :size="inputSize"
      input-mode="email"
    />

    <div class="forgot-footer">
      <OurButton
        data-cy="submit-button"
        size="lg"
        :text="$t('button.resetPassword')"
        @click="onClickSubmit"
      />

      <router-link data-cy="login-link" class="forgot-link" :to="loginRoute">
        {{ $t("page.forgotPassword.backToLogInForm") }}
      </router-link>
    </div>
  </OurCard>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "ForgotPassword",

  data: () => ({
    form: {
      email: "",
    },
  }),

  validations: {
    form: {
      email: { required, email },
    },
  },

  computed: {
    ...mapGetters("breakpoint", ["inputSize"]),

    emailError() {
      const isDirty = this.$v.form.email.$dirty;
      const isFilled = this.$v.form.email.required;
      const isEmail = this.$v.form.email.email;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isEmail) {
        error = this.$t("validation.mustBeEmail");
      }

      return error;
    },

    loginRoute() {
      return { name: "Login" };
    },
  },

  methods: {
    ...mapActions(["resetPassword"]),

    async onClickSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const formData = {
        email: this.form.email,
      };

      await this.resetPassword(formData);
    },
  },
};
</script>

<style lang="postcss" scoped>
.forgot-title {
  @apply text-center text-3xl font-bold text-base-dark;
  @apply mb-0.5;
}

.forgot-description {
  @apply mb-6 text-center text-sm font-normal text-gray-500 md:mb-8;
}

.forgot-link {
  @apply text-center text-sm font-normal text-gray-500 underline;
  @apply mt-6 block;
}
</style>
