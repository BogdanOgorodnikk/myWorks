<template>
  <OurPage
    width="wide"
    :title="$t('title.changingPassword')"
    class="page page-width"
    :back-route="backRouteParams"
    data-cy="change-password-page"
  >
    <ChangePasswordForm ref="changePasswordForm" @update:form="onUpdateFormChangePassword" />

    <template #footer-left>
      <OurButton
        :text="$t('button.changePassword')"
        data-cy="submit-button"
        class="button"
        @click="onSubmitFormChangePassword"
      />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        data-cy="change-password-back-button"
        class="button"
        @click="onClickBackButton"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import ChangePasswordForm from "@/views/profile/_components/ChangePasswordForm";

export default {
  components: {
    ChangePasswordForm,
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.profile"),
        name: "Profile",
      };
    },
  },

  methods: {
    ...mapActions(["changeUserPassword"]),

    onClickBackButton() {
      this.$router.push({ name: "Profile" });
    },

    async onUpdateFormChangePassword(formData) {
      try {
        await this.changeUserPassword(formData);

        await this.$router.push({ name: "Profile" });
      } catch {
        return;
      }
    },

    onSubmitFormChangePassword() {
      this.$refs.changePasswordForm.updateForm();
    },
  },
};
</script>
