<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.role.edit')"
    width="md"
    data-cy="edit-roles-page"
  >
    <RoleForm ref="roleForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToRoleList"
      />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeleteRole" />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import RoleForm from "../_components/RoleForm";
import DeleteModal from "../delete/Modal";

export default {
  name: "RoleEdit",

  components: {
    RoleForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        name: "",
        permissions: [],
        allowedAccounts: [],
        allowedCategories: [],
        allowedProjects: [],
        allowedTags: [],
      },
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("role", ["role"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.role.list"),
        name: "RoleList",
      };
    },
  },

  async created() {
    await this.prefillForm();
  },

  methods: {
    ...mapActions("role", ["getRole", "updateRole"]),

    async prefillForm() {
      const roleId = this.$route.params.id;

      await this.getRole(roleId);

      this.form.name = this.role.name;
      this.form.permissions = this.role.permissions.map((item) => item.name);
      this.form.allowedAccounts = this.role.allowedAccounts.map((item) => item.id);
      this.form.allowedCategories = this.role.allowedCategories.map((item) => item.id);
      this.form.allowedProjects = this.role.allowedProjects.map((item) => item.id);
      this.form.allowedTags = this.role.allowedTags.map((item) => item.id);
    },

    onClickBackToRoleList() {
      router.push({ name: "RoleList" });
    },

    async onSubmitForm() {
      this.$refs.roleForm.validate();

      const role = { id: this.role.id, ...this.form };

      if (this.form.isValid) {
        await this.updateRole(role);
      }
    },

    onClickDeleteRole() {
      this.form.id = this.role.id;
      this.isShownModal = true;
    },
  },
};
</script>
