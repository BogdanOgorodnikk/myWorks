<template>
  <div class="contact">
    <OurLogo class="contact-logo" :path="logoPath" />

    <div class="contact-title">{{ $t("title.contactUs") }}</div>

    <OurCard class="contact-card">
      <OurRow>
        <OurInput
          v-model="form.name"
          class="contact-card-input"
          :label="$t('label.name')"
          :placeholder="$t('placeholder.name')"
          :error="nameError"
        />

        <OurInput
          v-model="form.email"
          class="contact-card-input"
          :label="$t('label.email')"
          :placeholder="$t('placeholder.email')"
          :error="emailError"
        />
      </OurRow>

      <OurTextarea
        v-model="form.message"
        :label="$t('label.message')"
        :placeholder="$t('placeholder.message')"
        rows="3"
        :error="messageError"
      />
    </OurCard>

    <div class="contact-wrapper">
      <OurButton
        class="contact-wrapper-button"
        variant="secondary"
        :text="$t('button.goToLogin')"
        size="lg"
        @click="onClickBackToLogin"
      />

      <OurButton
        class="contact-wrapper-button"
        :text="$t('button.submit')"
        size="lg"
        @click="onClickSendMessage"
      />
    </div>
  </div>
</template>

<script>
import { layout } from "@/configs/ourApp.config";
import { required, email, minLength, maxLength } from "vuelidate/lib/validators";

const MIN_TEXT_LENGTH = 25;
const MAX_TEXT_LENGTH = 255;

export default {
  name: "ContactUs",

  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },

  validations: {
    form: {
      name: { required },
      message: {
        required,
        minLength: minLength(MIN_TEXT_LENGTH),
        maxLength: maxLength(MAX_TEXT_LENGTH),
      },
      email: { required, email },
    },
  },

  computed: {
    nameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    messageError() {
      const isDirty = this.$v.form.message.$dirty;
      const isFilled = this.$v.form.message.required;
      const hasMinLength = this.$v.form.message.minLength;
      const hasMaxLength = this.$v.form.message.maxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !hasMinLength) {
        error = this.$t("validation.messageMinLength", { length: MIN_TEXT_LENGTH });
      } else if (isDirty && !hasMaxLength) {
        error = this.$t("validation.messageMaxLength", { length: MAX_TEXT_LENGTH });
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

    logoPath() {
      return layout.auth.logoPath;
    },
  },

  methods: {
    onClickSendMessage() {
      this.$v.$touch();
    },

    onClickBackToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.contact {
  @apply w-full max-w-full;

  &-card {
    @apply w-full max-w-2xl !important;
    @apply space-y-6;

    &-input {
      @apply w-full;
    }
  }

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply my-8;
  }

  &-wrapper {
    @apply flex justify-between;
    @apply max-w-2xl;
    @apply mx-auto px-6;

    &-button {
      @apply mt-6 w-auto !important;
    }
  }

  &-logo {
    @apply justify-center;

    &::v-deep {
      .logo {
        @apply w-[14.6875rem];
      }
    }
  }
}
</style>
