<template>
  <div>
    <OurCard class="our-card-wrapper">
      <OurInput
        v-model="form.name"
        :label="$t('label.name')"
        :placeholder="$t('placeholder.projectName')"
        :error="projectNameError"
        data-cy="project-name-input"
      />

      <OurMoneyInput v-model="form.plannedIncome" data-cy="project-planned-income-input" />

      <OurMoneyInput v-model="form.plannedExpense" data-cy="project-planned-expense-input" />

      <OurSelect
        v-model="form.bx24Id"
        :options="bx24Projects"
        :label="$t('label.projectInBx24')"
        :placeholder="$t('placeholder.projectInBx24')"
        data-cy="project-bx24Id-select"
      />

      <OurTextarea
        v-model="form.comment"
        :label="$t('label.comment')"
        :placeholder="$t('placeholder.comment')"
        data-cy="project-comment-textarea"
      />
    </OurCard>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {
        name: "",
        bx24Id: "",
        comment: "",
        plannedIncome: {
          initialCurrency: {
            sum: "",
            label: this.$t("label.plannedIncome"),
            symbol: "",
            placeholder: "0",
          },
        },
        plannedExpense: {
          initialCurrency: {
            sum: "",
            label: this.$t("label.plannedExpense"),
            symbol: "",
            placeholder: "0",
          },
        },
      },
      bx24Projects: [],
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    ...mapState("settings", ["settings"]),

    projectNameError() {
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
    await this.getSettings();

    this.prefillForm();
  },

  methods: {
    ...mapActions("settings", ["getSettings"]),

    prefillForm() {
      this.form.name = this.value?.name;
      this.form.bx24Id = this.value?.bx24Id;
      this.form.comment = this.value?.comment;
      this.form.plannedIncome.initialCurrency.sum = this.value?.plannedIncome?.sum;
      this.form.plannedExpense.initialCurrency.sum = this.value?.plannedExpense?.sum;

      this.form.plannedIncome.initialCurrency.symbol = this.settings?.currency?.currentSymbol;
      this.form.plannedExpense.initialCurrency.symbol = this.settings?.currency?.currentSymbol;
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
.custom-icon {
  @apply block;
  @apply bg-gray-50;
  @apply rounded-r-lg border border-gray-300;
  @apply h-full w-full;
}

.custom-icon-symbol {
  @apply text-base font-medium text-base-dark;
  @apply absolute inset-y-1/3;
  @apply pl-4;
}
</style>
