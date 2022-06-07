<template>
  <div class="form-wrapper" data-cy="mass-edit-form">
    <OurCard>
      <BankAccountSelect
        v-if="transactionsType.expense"
        v-model="form.expenseAccount"
        :label="$t('label.expenseAccount')"
        :placeholder="$t('placeholder.leaveAsIs')"
        data-cy="expense-account-select"
      />

      <BankAccountSelect
        v-if="transactionsType.income"
        v-model="form.incomeAccount"
        :label="$t('label.incomeAccount')"
        :placeholder="$t('placeholder.leaveAsIs')"
        data-cy="income-account-select"
      />

      <OurSelect
        v-if="transactionsType.expense"
        v-model="form.expense"
        :label="$t('label.expenseCategory')"
        :placeholder="selectPlaceholders.expense"
        :disabled="clearCheckbox.isCleanExpense"
        :options="expenseCategories"
        data-cy="expense-category-select"
      >
        <template #after-caret>
          <OurCheckbox
            v-model="clearCheckbox.isCleanExpense"
            :label="$t('button.clear')"
            data-cy="expense-category-clear-checkbox"
          />
        </template>
      </OurSelect>

      <OurSelect
        v-if="transactionsType.income"
        v-model="form.income"
        :label="$t('label.incomeCategory')"
        :placeholder="selectPlaceholders.income"
        :disabled="clearCheckbox.isCleanIncome"
        :options="incomeCategories"
        data-cy="income-category-select"
      >
        <template #after-caret>
          <OurCheckbox
            v-model="clearCheckbox.isCleanIncome"
            :label="$t('button.clear')"
            data-cy="income-category-clear-checkbox"
          />
        </template>
      </OurSelect>

      <OurSelect
        v-if="transactionsType.transfer"
        v-model="form.transfer"
        :label="$t('label.transferCategory')"
        :placeholder="selectPlaceholders.transfer"
        :disabled="clearCheckbox.isCleanTransfer"
        :options="transferCategories"
        data-cy="transfer-category-select"
      >
        <template #after-caret>
          <OurCheckbox
            v-model="clearCheckbox.isCleanTransfer"
            :label="$t('button.clear')"
            data-cy="transfer-category-clear-checkbox"
          />
        </template>
      </OurSelect>

      <OurSelect
        v-model="form.countragent"
        :label="$t('label.counteragent')"
        :placeholder="selectPlaceholders.counteragent"
        :disabled="clearCheckbox.isCleanCounteragent"
        :options="contragentsForSelect"
        data-cy="countragent-select"
      >
        <template #after-caret>
          <OurCheckbox
            v-model="clearCheckbox.isCleanCounteragent"
            :label="$t('button.clear')"
            data-cy="countragent-clear-checkbox"
          />
        </template>
      </OurSelect>

      <div class="wrapper">
        <OurInput
          v-model="form.descriptions"
          :label="$t('label.description')"
          :placeholder="selectPlaceholders.descriptions"
          :disabled="clearCheckbox.isCleanDescriptions"
          class="custom-input"
          data-cy="description-input"
        />

        <div class="caret-wrapper">
          <OurCheckbox
            v-model="clearCheckbox.isCleanDescriptions"
            class="input-checkbox"
            :label="$t('button.clear')"
            data-cy="description-clear-checkbox"
          />
        </div>
      </div>
    </OurCard>

    <OurCard>
      <OurDatePicker
        v-model="form.paymentDate"
        :label="$t('label.paymentDate')"
        :placeholder="$t('placeholder.leaveAsIs')"
        data-cy="payment-datepicker"
      >
        <template #right>
          <OurMultiStateCheckbox
            v-model="form.paymentConfirmed"
            :options-data="dateCheckboxOptions"
            size="lg"
            data-cy="payment-multi-state-checkbox"
          />
        </template>
      </OurDatePicker>

      <OurDatePicker
        v-model="form.accrualDate"
        :label="$t('label.accrualDate')"
        :placeholder="$t('placeholder.leaveAsIs')"
        data-cy="accrual-datepicker"
      >
        <template #right>
          <OurMultiStateCheckbox
            v-model="form.accrualConfirmed"
            :options-data="dateCheckboxOptions"
            size="lg"
            data-cy="accrual-multi-state-checkbox"
          />
        </template>
      </OurDatePicker>
    </OurCard>

    <OurCard>
      <OurSelect
        v-model="form.project"
        :label="$t('label.project')"
        :placeholder="selectPlaceholders.project"
        :disabled="clearCheckbox.isCleanProjects"
        :options="projectsForSelect"
        data-cy="project-select"
      >
        <template #after-caret>
          <OurCheckbox
            v-model="clearCheckbox.isCleanProjects"
            :label="$t('button.clear')"
            data-cy="project-clear-checkbox"
          />
        </template>
      </OurSelect>

      <OurMultiselect
        v-model="form.tag"
        :label="$t('label.tags')"
        :placeholder="selectPlaceholders.tags"
        :disabled="clearCheckbox.isCleanTags"
        :options="tagsForSelect"
        data-cy="tags-multiselect"
      >
        <template #after-caret>
          <OurCheckbox v-model="clearCheckbox.isCleanTags" :label="$t('button.clear')" />
        </template>
      </OurMultiselect>
    </OurCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CATEGORY_ACTIVITIES } from "@/api/category";

import BankAccountSelect from "@/components/BankAccountSelect";

export default {
  components: {
    BankAccountSelect,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    transactionsType: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      dateCheckboxOptions: [
        {
          label: this.$t("label.leaveStatusAsIs"),
          code: null,
        },
        {
          label: this.$t("label.confirmed"),
          code: true,
        },
        {
          label: this.$t("label.notCorfimed"),
          code: false,
        },
      ],
      form: {
        expenseAccount: "",
        incomeAccount: "",
        expense: "",
        income: "",
        transfer: "",
        countragent: "",
        paymentConfirmed: null,
        accrualConfirmed: null,
        project: "",
        tag: [],
        descriptions: "",
      },
      clearCheckbox: {
        isCleanExpense: false,
        isCleanIncome: false,
        isCleanTransfer: false,
        isCleanCounteragent: false,
        isCleanProjects: false,
        isCleanTags: false,
        isCleanDescriptions: false,
      },
    };
  },

  computed: {
    ...mapGetters("category", ["categoriesByType", "defaultCategories"]),
    ...mapGetters("contragent", ["contragentsForSelect"]),
    ...mapGetters("tag", ["tagsForSelect"]),
    ...mapGetters("project", ["projectsForSelect"]),
    ...mapGetters("bankAccount", ["bankAccountsForSelect"]),

    expenseCategories() {
      return this.categoriesByType(CATEGORY_ACTIVITIES.expense);
    },

    incomeCategories() {
      return this.categoriesByType(CATEGORY_ACTIVITIES.income);
    },

    transferCategories() {
      return this.categoriesByType(CATEGORY_ACTIVITIES.transfer);
    },

    selectPlaceholders() {
      const expense = this.clearCheckbox.isCleanExpense
        ? this.$t("placeholder.unallocatedExpense")
        : this.$t("placeholder.leaveAsIs");

      const income = this.clearCheckbox.isCleanIncome
        ? this.$t("placeholder.unallocatedIncome")
        : this.$t("placeholder.leaveAsIs");

      const transfer = this.clearCheckbox.isCleanTransfer
        ? this.$t("placeholder.tansferBetweenAccounts")
        : this.$t("placeholder.leaveAsIs");

      const counteragent = this.clearCheckbox.isCleanCounteragent
        ? this.$t("placeholder.empty")
        : this.$t("placeholder.leaveAsIs");

      const project = this.clearCheckbox.isCleanProjects
        ? this.$t("placeholder.empty")
        : this.$t("placeholder.leaveAsIs");

      const tags = this.clearCheckbox.isCleanTags
        ? this.$t("placeholder.empty")
        : this.$t("placeholder.leaveAsIs");

      const descriptions = this.clearCheckbox.isCleanDescriptions
        ? this.$t("placeholder.empty")
        : this.$t("placeholder.leaveAsIs");

      return {
        expense,
        income,
        transfer,
        counteragent,
        project,
        tags,
        descriptions,
      };
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },

    clearCheckbox: {
      handler: "onChangeClearCheckbox",
      deep: true,
    },
  },

  async created() {
    await Promise.all([
      this.getCategories(),
      this.getContragents(),
      this.getProjects(),
      this.getTags(),
      this.getAccounts(),
    ]);
  },

  methods: {
    ...mapActions("category", ["getCategories"]),
    ...mapActions("contragent", ["getContragents"]),
    ...mapActions("project", ["getProjects"]),
    ...mapActions("tag", ["getTags"]),
    ...mapActions("bankAccount", ["getAccounts"]),

    onChangeForm(form) {
      this.$emit("input", form);
    },

    onChangeClearCheckbox(clearCheckbox) {
      this.form.expense = clearCheckbox.isCleanExpense ? this.defaultCategories.expense.id : "";
      this.form.income = clearCheckbox.isCleanIncome ? this.defaultCategories.income.id : "";
      this.form.transfer = clearCheckbox.isCleanTransfer ? this.defaultCategories.transfer.id : "";
      this.form.countragent = clearCheckbox.isCleanCounteragent ? null : "";
      this.form.project = clearCheckbox.isCleanProjects ? null : "";
      this.form.tag = clearCheckbox.isCleanTags ? null : [];
      this.form.descriptions = clearCheckbox.isCleanDescriptions ? null : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-wrapper {
  @apply space-y-4;
}

.wrapper {
  @apply relative;
  @apply z-10;
}

.caret-wrapper {
  @apply absolute top-0 right-2;
  @apply flex items-center;
  @apply z-50 h-full;
}

.input-checkbox {
  @apply mr-2;
}

.custom-input::v-deep .input-block .input {
  @apply pr-32;
}
</style>
