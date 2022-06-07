<template>
  <OurCard>
    <OurInput
      v-model="form.passwordCurrent"
      :label="$t('label.currentPassword')"
      :placeholder="$t('placeholder.writeYourCurrentPassword')"
      :error="passwordCurrentError"
      data-cy="current-password-input"
      type="password"
    />
    <OurInput
      v-model="form.passwordNew"
      :label="$t('label.newPassword')"
      :placeholder="$t('placeholder.writeYourNewPassword')"
      :error="passwordNewError"
      data-cy="new-password-input"
      type="password"
    />
  </OurCard>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import ValidationService from "@/services/validation.service";

const { PASSWORD_MIN_LENGTH } = ValidationService;

export default {
  data: () => ({
    form: {
      passwordNew: "",
      passwordCurrent: "",
    },
  }),

  validations: {
    form: {
      passwordNew: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
      passwordCurrent: { required, minLength: minLength(PASSWORD_MIN_LENGTH) },
    },
  },

  computed: {
    passwordNewError() {
      const isDirty = this.$v.form.passwordNew.$dirty;
      const isFilled = this.$v.form.passwordNew.required;
      const minLength = this.$v.form.passwordNew.minLength;

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

    passwordCurrentError() {
      const isDirty = this.$v.form.passwordCurrent.$dirty;
      const isFilled = this.$v.form.passwordCurrent.required;
      const minLength = this.$v.form.passwordCurrent.minLength;

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
  },

  methods: {
    updateForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.$emit("update:form", this.form);
    },

    clearForm() {
      this.form.passwordNew = "";
      this.form.passwordCurrent = "";
    },
  },
};
</script>
