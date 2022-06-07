<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.filter')">
    <FilterForm v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.find')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToContragents" />
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
        title: this.$t("title.setting.contragent.list"),
        name: "ContragentList",
      };
    },
  },

  methods: {
    ...mapMutations("contragent", ["SET_FILTERS"]),

    onClickBackToContragents() {
      this.$router.push({ name: "ContragentList" });
    },

    onSubmitForm() {
      this.SET_FILTERS(this.form);

      this.$router.push({ name: "ContragentList" });
    },

    onClickResetFilters() {
      this.SET_FILTERS({});

      this.$router.push({ name: "ContragentList" });
    },
  },
};
</script>
