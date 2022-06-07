<template>
  <OurCard class="card" data-cy="signup-page">
    <h2 class="register-title">{{ $t("page.signUp.title") }}</h2>

    <OurInput
      v-model="form.firstName"
      data-cy="first-name-input"
      :label="$t('label.userName')"
      :placeholder="$t('placeholder.name')"
      :error="nameError"
      :size="inputSize"
    />

    <OurInput
      v-model="form.email"
      data-cy="email-input"
      :label="$t('label.email')"
      :placeholder="$t('placeholder.email')"
      :error="emailError"
      :size="inputSize"
      input-mode="email"
    />

    <OurPhoneInput
      v-model="form.phone"
      data-cy="phone-input"
      :label="$t('label.phone')"
      :size="inputSize"
      :error="phoneError"
      :placeholder="$t('placeholder.phone')"
    />

    <h5
      data-cy="rules-link"
      class="register-rules"
      v-html="
        $t('page.signUp.acceptRule', {
          agreementLink: agreementLink,
          policyLink: policyLink,
        })
      "
    ></h5>

    <div class="register-footer">
      <OurButton
        data-cy="submit-button"
        size="lg"
        :text="$t('button.signUp')"
        @click="onSubmitForm"
      />

      <router-link data-cy="login-link" class="register-link" :to="loginRoute">
        {{ $t("page.signUp.hasAccount") }}
      </router-link>
    </div>
  </OurCard>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import ValidationService from "@/services/validation.service";

const { clearPhone, phoneMaxLength, phoneMinLength } = ValidationService;

export default {
  name: "SignUp",

  data: () => ({
    form: {
      firstName: "",
      phone: "",
      email: "",
    },
    agreementLink: "/",
    policyLink: "/",
  }),

  validations: {
    form: {
      firstName: { required },
      phone: { required, phoneMinLength, phoneMaxLength },
      email: { required, email },
    },
  },

  computed: {
    ...mapGetters("breakpoint", ["inputSize"]),

    nameError() {
      const isDirty = this.$v.form.firstName.$dirty;
      const isFilled = this.$v.form.firstName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    phoneError() {
      const isDirty = this.$v.form.phone.$dirty;
      const isFilled = this.$v.form.phone.required;
      const isMinLength = this.$v.form.phone.phoneMinLength;
      const isMaxLength = this.$v.form.phone.phoneMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.phoneLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.phoneLength");
      }

      return error;
    },

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
    ...mapActions(["signUp"]),

    async onSubmitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.form.phone = `+${clearPhone(this.form.phone)}`;

      const formData = {
        firstName: this.form.firstName,
        phone: this.form.phone,
        email: this.form.email,
      };

      await this.signUp(formData);
    },
  },
};
</script>

<style lang="postcss" scoped>
.register-title {
  @apply text-center text-3xl font-bold text-base-dark;
  @apply mb-6 md:mb-8;
}

.register-rules {
  @apply px-4 text-sm font-normal text-gray-500;
}

::v-deep .register-rules a {
  @apply underline;
}

.register-link {
  @apply text-center text-sm font-normal text-gray-500 underline;
  @apply mt-6 block;
}
</style>
