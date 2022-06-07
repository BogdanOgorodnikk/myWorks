<template>
  <OurPage
    data-cy="profile-page"
    width="wide"
    :title="$t('title.profile')"
    :back-route="backRouteParams"
    class="page-width"
  >
    <ProfileForm ref="profileForm" v-model="form" />

    <template #footer-left>
      <OurButton
        :text="$t('button.save')"
        data-cy="update-profile-button"
        class="button"
        @click="onClickUpdateProfile"
      />
    </template>

    <template #footer-right>
      <OurButton
        :text="$t('button.changePassword')"
        variant="thirdary"
        data-cy="change-password-button"
        class="button"
        @click="onClickButtonChangePassword"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import ProfileForm from "@/views/profile/_components/ProfileForm";
import I18nServiceDefault from "@ilevel/our.service.i18n";

export default {
  components: {
    ProfileForm,
  },

  data: () => ({
    form: {},
  }),

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.business.list"),
        name: "BusinessLayout",
      };
    },
  },

  methods: {
    ...mapActions("user", ["updateUserProfile"]),

    async onClickUpdateProfile() {
      this.$refs.profileForm.validate();

      if (this.form.isValid) {
        await this.updateUserProfile(this.form);

        if (this.form.language !== I18nServiceDefault.getActiveLanguage()) {
          I18nServiceDefault.setActiveLanguage(this.form.language);

          window.location.reload();
        }
      }
    },

    onClickButtonChangePassword() {
      this.$router.push({ name: "ChangePassword" });
    },
  },
};
</script>
