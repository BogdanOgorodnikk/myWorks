<template>
  <div>
    <OurCard class="our-card-wrapper">
      <OurInput
        v-model="form.name"
        :label="$t('label.name')"
        :placeholder="$t('placeholder.companyName')"
        :error="companyNameError"
        data-cy="company-name-input"
      />

      <OurSelect
        v-model="form.bx24Id"
        :options="companies"
        :label="$t('label.yourCompanyInBitrix24')"
        :placeholder="$t('placeholder.chooseCompany')"
        :description="$t('description.yourCompanyInBitrix24')"
        data-cy="company-bx24Id-select"
      />

      <OurTextarea
        v-model="form.comment"
        :label="$t('label.comment')"
        :placeholder="$t('placeholder.comment')"
      />
    </OurCard>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { getBx24Companies } from "@/api/crm";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {},
      companies: [],
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    companyNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

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

  async created() {
    //TODO: UNCOMENT WHEN METHOD WILL BE WORK ON TEST SERVER
    // this.companies = await this.prepareBx24Companies();
  },

  mounted() {
    this.form = this.value;
  },

  methods: {
    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    async prepareBx24Companies() {
      const companies = await getBx24Companies();

      return companies.map((item) => ({
        id: item.id,
        label: item.title,
      }));
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>
