<template>
  <OurCard>
    <OurInput
      v-model="name"
      data-cy="company-name-input"
      :label="$t('label.businessName')"
      :placeholder="$t('placeholder.businessName')"
      :description="$t('description.businessName')"
      :error="companyNameError"
    />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  props: {
    business: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    companyName: "",
  }),

  validations: {
    companyName: { required },
  },

  computed: {
    companyNameError() {
      const isDirty = this.$v.companyName.$dirty;
      const isFilled = this.$v.companyName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    name: {
      get() {
        return this.business.company;
      },
      set(value) {
        this.companyName = value;
      },
    },
  },

  methods: {
    updateForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.$emit("update:companyName", this.companyName);
    },
  },
};
</script>
