<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.filter')">
    <FilterForm v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.find')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToTransactions" />
    </template>

    <template #footer-right>
      <OurButton variant="thirdary" :text="$t('button.reset')" @click="onClickResetFilters" />
    </template>
  </OurPage>
</template>

<script>
import { mapMutations } from "vuex";

import FilterForm from "../_components/FilterForm";

export default {
  components: {
    FilterForm,
  },

  data: () => ({
    form: {},
  }),

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.transaction.list"),
        name: "TransactionsList",
      };
    },
  },

  methods: {
    ...mapMutations("transaction", [
      "SET_TRANSACTIONS",
      "SET_FILTERS",
      "SET_TOTAL_PLANNED_TRANSACTIONS",
      "SET_SHOWN_PLANNED_TRANSACTIONS",
    ]),

    onClickBackToTransactions() {
      this.$router.push({ name: "TransactionsList" });
    },

    onSubmitForm() {
      this.SET_FILTERS(this.form);
      this.SET_TRANSACTIONS({ transactions: null });
      this.SET_TOTAL_PLANNED_TRANSACTIONS({ totalPlannedTransactions: null });
      this.SET_SHOWN_PLANNED_TRANSACTIONS(false);

      this.$router.push({ name: "TransactionsList" });
    },

    onClickResetFilters() {
      this.SET_FILTERS({ paymentDate: this.form.paymentDate });
      this.SET_TRANSACTIONS({ transactions: null });
      this.SET_SHOWN_PLANNED_TRANSACTIONS(false);

      this.$router.push({ name: "TransactionsList" });
    },
  },
};
</script>
