<template>
  <OurCard>
    <OurRow>
      <OurInput
        v-model="form.firstName"
        :label="$t('label.userName')"
        :placeholder="$t('placeholder.name')"
        :error="nameError"
        data-cy="name-input"
        class="custom-input"
      />

      <OurInput
        v-model="form.lastName"
        :label="$t('label.surname')"
        :placeholder="$t('placeholder.surname')"
        data-cy="surname-input"
        class="custom-input"
      />
    </OurRow>

    <OurPhoneInput
      v-model="form.phone"
      :label="$t('label.phone')"
      :error="phoneError"
      :placeholder="$t('placeholder.phone')"
      data-cy="phone-input"
    />

    <OurInput v-model="form.email" :label="$t('label.email')" disabled data-cy="email-input" />

    <OurSelect
      v-model="form.language"
      :options="languages"
      :label="$t('label.language')"
      value-key="code"
      :error="languageError"
      data-cy="language-select"
    />
  </OurCard>
</template>

<script>
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import I18nServiceDefault from "@ilevel/our.service.i18n";
import ValidationService from "@/services/validation.service";

const { clearPhone, phoneMaxLength, phoneMinLength } = ValidationService;

export default {
  data: () => ({
    form: {
      email: "",
      language: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  }),

  validations: {
    form: {
      firstName: { required },
      phone: { required, phoneMinLength, phoneMaxLength },
      language: { required },
    },
  },

  computed: {
    ...mapGetters("user", ["userProfile"]),

    ...mapGetters("user", ["languages"]),

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

    languageError() {
      const isDirty = this.$v.form.language.$dirty;
      const isFilled = this.$v.form.language.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    onChangeForm() {
      const preparedPhone = clearPhone(this.form.phone);

      this.form.phone = `+${preparedPhone}`;

      this.form.isValid = !this.$v.$invalid;

      this.$emit("input", this.form);
    },

    prefillForm() {
      const activeLanguage = this.languages.find(
        (language) => language.code === I18nServiceDefault.getActiveLanguage()
      );

      this.form.firstName = this.userProfile?.firstName;
      this.form.lastName = this.userProfile?.lastName;
      this.form.phone = this.userProfile?.phone || "";
      this.form.email = this.userProfile?.email;
      this.form.language = activeLanguage.code;
    },

    validate() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.custom-input {
  @apply grow;
}
</style>
