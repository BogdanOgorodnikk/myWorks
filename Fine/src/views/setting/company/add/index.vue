<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.company.add')"
    width="md"
    data-cy="add-companies-page"
  >
    <CompanyForm ref="companyForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToCategoryList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import router from "@/router";
import CompanyForm from "../_components/CompanyForm";

export default {
  name: "CompanyAdd",

  components: {
    CompanyForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.company.list"),
        name: "CompanyList",
      };
    },
  },

  methods: {
    ...mapActions("company", ["addCompany"]),

    onClickBackToCategoryList() {
      router.push({ name: "CompanyList" });
    },

    async onSubmitForm() {
      this.$refs.companyForm.validate();

      if (this.form.isValid) {
        await this.addCompany(this.form);
      }
    },
  },
};
</script>
