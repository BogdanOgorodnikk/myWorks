<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.project.add')"
    width="md"
    data-cy="add-project-page"
  >
    <ProjectForm ref="projectForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToProjectList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import router from "@/router";
import ProjectForm from "../_components/ProjectForm";

export default {
  name: "ProjectAdd",

  components: {
    ProjectForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.project.list"),
        name: "ProjectList",
      };
    },
  },

  methods: {
    ...mapActions("project", ["addProject"]),

    onClickBackToProjectList() {
      router.push({ name: "ProjectList" });
    },

    async onSubmitForm() {
      this.$refs.projectForm.validate();

      if (this.form.isValid) {
        const prepareForm = {
          name: this.form.name,
          bx24Id: this.form.bx24Id,
          comment: this.form.comment,
          plannedIncome: Number(this.form.plannedIncome.initialCurrency.sum),
          plannedExpense: Number(this.form.plannedExpense.initialCurrency.sum),
        };

        await this.addProject(prepareForm);
      }
    },
  },
};
</script>
