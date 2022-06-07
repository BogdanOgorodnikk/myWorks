<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.role.add')"
    width="md"
    data-cy="add-role-page"
  >
    <RoleForm ref="roleForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.add')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToRoleList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import router from "@/router";
import RoleForm from "../_components/RoleForm";

export default {
  name: "RoleAdd",

  components: {
    RoleForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.role.list"),
        name: "RoleList",
      };
    },
  },

  methods: {
    ...mapActions("role", ["addRole"]),

    onClickBackToRoleList() {
      router.push({ name: "RoleList" });
    },

    async onSubmitForm() {
      this.$refs.roleForm.validate();

      if (this.form.isValid) {
        await this.addRole(this.form);
      }
    },
  },
};
</script>
