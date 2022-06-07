<template>
  <div class="form-wrapper" data-cy="filter-form">
    <OurCard>
      <OurMultiselect
        v-model="form.categoryTypes"
        :label="$t('label.transactionType')"
        :placeholder="$t('placeholder.incomeExpenseTransfer')"
        :options="categoryTypes"
        value-key="code"
        data-cy="payment-types-multiselect"
      />

      <OurMoneyInput v-if="isPrefillData" v-model="form.money" type="range" />

      <BankAccountSelect
        v-model="form.bankAccountIds"
        data-cy="accounts-multiselect"
        :placeholder="$t('placeholder.anyAccount')"
        :label="$t('label.accounts')"
        multiple
      />

      <OurMultiselect
        v-model="form.categoryIds"
        :label="$t('label.categories')"
        :placeholder="$t('placeholder.anyCategory')"
        :options="categories"
        data-cy="categories-multiselect"
      />

      <OurMultiselect
        v-model="form.counterpartyIds"
        :label="$t('label.counteragents')"
        :placeholder="$t('placeholder.anyCountragents')"
        :options="contragentsForSelect"
        data-cy="contragents-multiselect"
      />

      <OurTextarea
        v-model="form.description"
        :label="$t('label.description')"
        :placeholder="$t('placeholder.fewWordsAboutOperation')"
        data-cy="description-textarea"
      />
    </OurCard>

    <OurCard>
      <OurDateRangePicker
        v-model="form.paymentDate"
        variant="input"
        :label="$t('label.paymentDate')"
        :placeholder="$t('placeholder.anyDate')"
        data-cy="payment-datepicker"
      >
        <template #right>
          <OurMultiStateCheckbox
            v-model="form.paymentConfirmed"
            data-cy="payment-multi-state-checkbox"
            :options-data="dateCheckboxOptions"
            size="lg"
          />
        </template>
      </OurDateRangePicker>

      <OurDatePicker
        v-model="form.accrualDate"
        :label="$t('label.accrualDate')"
        :placeholder="$t('placeholder.anyDate')"
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
      <OurMultiselect
        v-model="form.projectIds"
        :label="$t('label.project')"
        :placeholder="$t('placeholder.project')"
        :options="projectsForSelect"
        data-cy="project-select"
      />

      <OurMultiselect
        v-model="form.tagIds"
        :label="$t('label.tags')"
        :placeholder="$t('placeholder.tags')"
        :options="tagsForSelect"
        data-cy="tags-multiselect"
      />
    </OurCard>
  </div>
</template>

<script>
import { CATEGORY_ACTIVITIES } from "@/api/category";
import { mapState, mapActions, mapGetters } from "vuex";

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
  },

  data() {
    return {
      isPrefillData: false,
      form: {
        money: {
          startRange: {
            symbol: "",
            sum: "",
            placeholder: this.$t("placeholder.from"),
          },
          endRange: {
            symbol: "",
            sum: "",
            placeholder: this.$t("placeholder.to"),
          },
        },
        categoryTypes: [],
        bankAccountIds: [],
        categoryIds: [],
        counterpartyIds: [],
        projectIds: [],
        tagIds: [],
        description: "",
        paymentDate: {},
        accrualDate: null,
        paymentConfirmed: null,
        accrualConfirmed: null,
      },
      dateCheckboxOptions: [
        {
          label: this.$t("label.anyStatus"),
          code: null,
        },
        {
          label: this.$t("label.confirmed"),
          code: 1,
        },
        {
          label: this.$t("label.notCorfimed"),
          code: 0,
        },
      ],
      categoryTypes: [
        {
          code: CATEGORY_ACTIVITIES.income,
          label: this.$t("label.cashFlowTypes.income"),
        },
        {
          code: CATEGORY_ACTIVITIES.expense,
          label: this.$t("label.cashFlowTypes.expense"),
        },
        {
          code: CATEGORY_ACTIVITIES.transfer,
          label: this.$t("label.cashFlowTypes.transfer"),
        },
      ],
    };
  },

  computed: {
    ...mapState("transaction", ["filters"]),

    ...mapGetters("category", ["categories"]),
    ...mapGetters("contragent", ["contragentsForSelect"]),
    ...mapGetters("tag", ["tagsForSelect"]),
    ...mapGetters("project", ["projectsForSelect"]),
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    await Promise.all([
      this.getCategories(),
      this.getContragents(),
      this.getProjects(),
      this.getTags(),
    ]);

    this.prefillForm();
  },

  methods: {
    ...mapActions("category", ["getCategories"]),
    ...mapActions("contragent", ["getContragents"]),
    ...mapActions("project", ["getProjects"]),
    ...mapActions("tag", ["getTags"]),

    prefillForm() {
      const paymentConfirmed =
        this.filters.paymentConfirmed === 1 || this.filters.paymentConfirmed === 0
          ? this.filters.paymentConfirmed
          : null;
      const accrualConfirmed =
        this.filters.accrualConfirmed === 1 || this.filters.accrualConfirmed === 0
          ? this.filters.accrualConfirmed
          : null;

      this.form.categoryTypes = [...(this.filters.categoryType || [])];
      this.form.bankAccountIds = [...(this.filters.bankAccountId || [])];
      this.form.categoryIds = [...(this.filters.categoryId || [])];
      this.form.counterpartyIds = [...(this.filters.counterpartyId || [])];
      this.form.projectIds = [...(this.filters.projectId || [])];
      this.form.tagIds = [...(this.filters.tagId || [])];
      this.form.accrualDate = this.filters.accrualDate?.from;
      this.form.paymentConfirmed = paymentConfirmed;
      this.form.accrualConfirmed = accrualConfirmed;
      this.form.description = this.filters.description;
      this.form.money.startRange.sum = this.filters?.sum?.from || "";
      this.form.money.endRange.sum = this.filters?.sum?.to || "";

      if (this.filters.paymentDate) {
        this.form.paymentDate.to = this.filters.paymentDate.to;
        this.form.paymentDate.from = this.filters.paymentDate.from;
      }

      this.isPrefillData = true;
    },

    onChangeForm() {
      const params = {
        categoryType: this.form.categoryTypes,
        categoryId: this.form.categoryIds,
        sum: {
          from: this.form.money.startRange,
          to: this.form.money.endRange,
        },
        bankAccountId: this.form.bankAccountIds,
        counterpartyId: this.form.counterpartyIds,
        projectId: this.form.projectIds,
        tagId: this.form.tagIds,
        paymentDate: {
          to: this.form.paymentDate.to,
          from: this.form.paymentDate.from,
        },
        accrualDate: {
          from: this.form.accrualDate,
        },
        paymentConfirmed: this.form.paymentConfirmed,
        accrualConfirmed: this.form.accrualConfirmed,
        description: this.form.description,
      };

      this.$emit("input", params);
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-wrapper {
  @apply space-y-4;
}
</style>
