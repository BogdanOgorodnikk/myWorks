<template>
  <OurCard class="card" data-cy="login-page">
    <h2 class="login-title">{{ $t("page.login.title") }}</h2>

    <OurInput
      v-model="form.email"
      data-cy="email-input"
      :label="$t('label.email')"
      :placeholder="$t('placeholder.email')"
      :error="emailError"
      :size="inputSize"
      input-mode="email"
    />

    <OurInput
      v-model="form.password"
      data-cy="password-input"
      :label="$t('label.password')"
      :placeholder="$t('placeholder.password')"
      :error="passwordError"
      type="password"
      :size="inputSize"
    />

    <div class="login-footer">
      <OurButton
        data-cy="login-button"
        :text="$t('button.login')"
        size="lg"
        @click="onSubmitForm"
      />

      <OurRow class="login-wrapper-link">
        <router-link data-cy="forgot-password" class="login-link" :to="forgotPasswordRoute">
          {{ $t("title.passwordRecovery") }}
        </router-link>

        <router-link data-cy="signup-link" class="login-link" :to="signUpRoute">
          {{ $t("title.signUp") }}
        </router-link>
      </OurRow>
    </div>
  </OurCard>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, email, minLength } from "vuelidate/lib/validators";
import ValidationService from "@/services/validation.service";

const { PASSWORD_MIN_LENGTH } = ValidationService;

export default {
  name: "LoginPage",

  data: () => ({
    form: {
      email: "",
      password: "",
    },
  }),

  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
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

    passwordError() {
      const isDirty = this.$v.form.password.$dirty;
      const isFilled = this.$v.form.password.required;
      const minLength = this.$v.form.password.minLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !minLength) {
        error = this.$t("validation.passwordMinLength", {
          length: PASSWORD_MIN_LENGTH,
        });
      }

      return error;
    },

    signUpRoute() {
      return { name: "SignUp" };
    },

    forgotPasswordRoute() {
      return { name: "ForgotPassword" };
    },
  },

  methods: {
    ...mapActions(["login"]),
    ...mapActions("business", ["openFirstBusiness"]),

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const formData = {
        email: this.form.email,
        password: this.form.password,
        rememberMe: true,
      };

      await this.login(formData);
      await this.$router.push({ name: "BusinessLayout" });
      await this.openFirstBusiness();
    },
  },
};
</script>

<style lang="postcss" scoped>
.login-title {
  @apply text-center text-3xl font-bold text-base-dark;
  @apply mb-6 md:mb-8;
}

.login-wrapper-link {
  @apply mt-6 justify-center;
}

.login-link {
  @apply text-sm font-normal text-gray-500 underline;
}
</style>
