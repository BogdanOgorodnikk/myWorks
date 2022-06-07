<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.company.edit')"
    width="md"
    data-cy="edit-projects-page"
  >
    <ProjectForm ref="projectForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToProjectList"
      />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary" data-cy="edit-project-dropdown">
        <div data-cy="dropdown-delete-button" @click="onClickDeleteProject">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";

import router from "@/router";
import ProjectForm from "../_components/ProjectForm";
import DeleteModal from "../delete/Modal";

export default {
  name: "ProjectEdit",

  components: {
    DeleteModal,
    ProjectForm,
  },

  data() {
    return {
      form: {
        name: "",
        baseCurrency: {
          plannedIncome: "",
          plannedExpense: "",
        },
        bx24Id: 0,
        comment: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("project", ["project"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.project.list"),
        name: "ProjectList",
      };
    },
  },

  watch: {
    project(project) {
      this.form.id = project.id;
      this.form.name = project.name;
      this.form.plannedIncome.initialCurrency.sum = project.plannedIncome;
      this.form.plannedExpense.initialCurrency.sum = project.plannedExpense;
      this.form.bx24Id = project.bx24Id;
      this.form.comment = project.comment;
    },
  },

  async created() {
    const projectId = this.$route.params.id;

    await this.getProject(projectId);
  },

  methods: {
    ...mapActions("project", ["getProject", "updateProject"]),

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

        await this.updateProject({ id: this.project.id, ...prepareForm });
      }
    },

    onClickDeleteProject() {
      this.isShownModal = true;
    },
  },
};
</script>
