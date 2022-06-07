<template>
  <OurCard>
    <OurButtonGroup
      v-model="form.type"
      class="contragent-button-group"
      :options="contragentTypeOptions"
      name="bxEntity"
    />

    <OurInput
      v-model="form.name"
      :error="contragentNameError"
      :label="labelsByType.name"
      :placeholder="placeholdersByType.name"
    />

    <OurInput
      v-model="form.taxNumber"
      :label="$t('label.taxNumber')"
      :placeholder="$t('placeholder.taxNumber')"
    />

    <OurTextarea
      v-model="form.comment"
      :label="$t('label.comment')"
      :placeholder="$t('placeholder.comment')"
    />

    <OurHint>
      {{ $t("description.createContragentOperations", { contragent: declinedContragent }) }}
    </OurHint>

    <OurSelect
      v-model="form.bx24EntityId"
      :label="labelsByType.crmEntity"
      :placeholder="placeholdersByType.crmEntity"
    />

    <div class="contragent-buttons">
      <OurButton variant="link" :text="$t('button.pullDataFromCRM')" />

      <OurButton variant="link" :text="$t('button.openInCrm')" />
    </div>
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { CONTRAGENT_TYPE } from "@/api/contragent";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isPrefilledForm: false,
      form: {
        type: "",
        name: "",
        taxNumber: "",
        comment: "",
        bx24EntityId: "",
      },
      contragentTypeOptions: CONTRAGENT_TYPE,
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    contragentNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    labelsByType() {
      const [contactType, companyType, employeeType] = CONTRAGENT_TYPE;

      let crmEntityLabel = this.$t("label.contactInCrm");

      if (this.form.type === companyType.value) {
        crmEntityLabel = this.$t("label.companyInCrm");
      } else if (this.form.type === employeeType.value) {
        crmEntityLabel = this.$t("label.employeeInCrm");
      }

      return {
        name:
          this.form.type === contactType.value || this.form.type === employeeType.value
            ? this.$t("label.userName")
            : this.$t("label.name"),
        crmEntity: crmEntityLabel,
      };
    },

    placeholdersByType() {
      const contactType = CONTRAGENT_TYPE[0];
      const employeeType = CONTRAGENT_TYPE[2];

      return {
        name:
          this.form.type === contactType.value || this.form.type === employeeType.value
            ? this.$t("placeholder.titleOrName")
            : this.$t("placeholder.companyName"),
        crmEntity:
          this.form.type === contactType.value || this.form.type === employeeType.value
            ? this.$t("placeholder.writeNameOrId")
            : this.$t("placeholder.projectInBx24"),
      };
    },

    declinedContragent() {
      const contragent = {
        contact: this.$t("label.declinedContact"),
        company: this.$t("label.declinedCompany"),
        employee: this.$t("label.declinedEmployee"),
      };

      return contragent[this.form.type];
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
    value: {
      handler: "onChangeValue",
      deep: true,
      immediate: true,
    },
  },

  methods: {
    onChangeValue() {
      if (!this.isPrefilledForm) {
        this.prefillForm();
      }
    },

    prefillForm() {
      const [firstContragentType] = CONTRAGENT_TYPE;

      this.form.type = this.value.type || firstContragentType.value;
      this.form.name = this.value.name;
      this.form.taxNumber = this.value.taxNumber;
      this.form.comment = this.value.comment;
      this.form.bx24EntityId = this.value.bx24EntityId;

      this.isPrefilledForm = true;
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>

<style lang="postcss" scoped>
.contragent {
  &-buttons {
    @apply flex;
    @apply mx-4 !mt-3 space-x-4;
  }

  &-button-group {
    &::v-deep {
      .radio-wrapper {
        @apply w-full;

        .label {
          @apply w-full text-center text-sm;
          @apply py-[0.84375rem];
        }
      }
    }
  }
}
</style>
