<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.user.add')"
    width="md"
    data-cy="add-user-page"
  >
    <UserForm ref="userForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.add')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToUserList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import router from "@/router";
import UserForm from "../_components/UserForm";

export default {
  name: "UserAdd",

  components: {
    UserForm,
  },

  data() {
    return {
      form: {
        email: "",
        roleId: "",
      },
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.user.list"),
        name: "UserList",
      };
    },
  },

  methods: {
    ...mapActions("user", ["inviteUser"]),

    onClickBackToUserList() {
      router.push({ name: "UserList" });
    },

    async onSubmitForm() {
      this.$refs.userForm.validate();

      if (this.form.isValid) {
        await this.inviteUser(this.form);
      }
    },
  },
};
</script>
