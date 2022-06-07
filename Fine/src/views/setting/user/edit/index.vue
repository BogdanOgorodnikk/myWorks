<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.user.edit')"
    width="md"
    data-cy="edit-user-page"
  >
    <UserForm ref="userForm" v-model="form" edit-form />

    <template #footer-left>
      <OurButton :text="$t('button.save')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToUserList"
      />
    </template>

    <template #footer-right>
      <OurButton
        v-if="isActiveUser"
        variant="thirdary"
        :text="$t('button.fire')"
        @click="onClickShowFireModal"
      />

      <OurButton
        v-else
        variant="thirdary"
        :text="$t('button.restore')"
        @click="onClickShowRestoreModal"
      />
    </template>

    <FireModal v-model="isShownFireModal" :item="form" />

    <RestoreModal v-model="isShownRestoreModal" :item="form" />
  </OurPage>
</template>

<script>
import { mapActions, mapState } from "vuex";

import router from "@/router";
import UserForm from "../_components/UserForm";
import FireModal from "./components/FireModal";
import RestoreModal from "./components/RestoreModal";
import notify from "@ilevel/our.service.notify";

export default {
  name: "UserEdit",

  components: {
    RestoreModal,
    FireModal,
    UserForm,
  },

  data() {
    return {
      isShownFireModal: false,
      isShownRestoreModal: false,
      modalItem: {},
      form: {
        id: "",
        name: "",
        email: "",
        roleId: "",
      },
    };
  },

  computed: {
    ...mapState("user", ["user"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.user.list"),
        name: "UserList",
      };
    },

    isActiveUser() {
      return this.user?.isActive;
    },
  },

  async created() {
    await this.prefillForm();
  },

  methods: {
    ...mapActions("user", ["updateUser", "getUser"]),

    onClickBackToUserList() {
      router.push({ name: "UserList" });
    },

    onClickShowFireModal() {
      this.form.id = this.user.id;
      this.isShownFireModal = true;
    },

    onClickShowRestoreModal() {
      this.form.id = this.user.id;
      this.isShownRestoreModal = true;
    },

    async prefillForm() {
      const userId = this.$route.params.id;

      await this.getUser(userId);

      const [userRole] = this.user.roles;

      this.form.name = this.user.firstName
        ? `${this.user.firstName} ${this.user.lastName || ""}`
        : "";
      this.form.email = this.user.email;
      this.form.roleId = userRole?.id;
    },

    async onSubmitForm() {
      this.$refs.userForm.validate();

      if (this.form.isValid) {
        await this.updateUser({ ...this.form, id: this.user.id });

        notify.success("userUpdated");
      }
    },
  },
};
</script>
