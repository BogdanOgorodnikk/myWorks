<template>
  <OurPage
    data-cy="edit-companies-page"
    :back-route="backRouteParams"
    :title="$t('title.setting.company.edit')"
    width="md"
  >
    <CompanyForm ref="companyForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToCategoryList"
      />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary" data-cy="edit-companies-dropdown">
        <div data-cy="dropdown-delete-button" @click="onClickDeleteCompany">
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
import CompanyForm from "../_components/CompanyForm";
import DeleteModal from "../delete/Modal";

export default {
  name: "CompanyEdit",

  components: {
    CompanyForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        id: "",
        name: "",
        bx24Id: "",
        comment: "",
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("company", ["company"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.company.list"),
        name: "CompanyList",
      };
    },
  },

  watch: {
    company(company) {
      this.form.id = company.id;
      this.form.name = company.name;
      this.form.bx24Id = company.bxId;
      this.form.comment = company.comment;
    },
  },

  async created() {
    const companyId = this.$route.params.id;

    await this.getCompany(companyId);
  },

  methods: {
    ...mapActions("company", ["getCompany", "updateCompany"]),

    onClickBackToCategoryList() {
      router.push({ name: "CompanyList" });
    },

    async onSubmitForm() {
      this.$refs.companyForm.validate();

      const company = { id: this.company.id, ...this.form };

      if (this.form.isValid) {
        await this.updateCompany(company);
      }
    },

    onClickDeleteCompany() {
      this.isShownModal = true;
    },
  },
};
</script>
