<template>
  <OurPage
    width="wide"
    :title="$t('title.business.add')"
    :back-route="backRouteParams"
    class="page"
    :bg-image="false"
  >
    <BusinessForm ref="businessForm" class="form" @update:form="onUpdateForm" />

    <template #footer-left>
      <OurButton
        :text="$t('button.addBusiness')"
        data-cy="create-business-button"
        class="button"
        @click="onSubmitForm"
      />

      <OurButton :text="$t('button.demoBusiness')" variant="secondary" class="button" />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import BusinessForm from "./components/BusinessForm";

export default {
  components: {
    BusinessForm,
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.business.list"),
        name: "Business",
      };
    },
  },

  methods: {
    ...mapActions("business", ["createBusiness"]),

    async onUpdateForm(formData) {
      await this.createBusiness(formData);

      this.$router.push({ name: "Business" });
    },

    onSubmitForm() {
      this.$refs.businessForm.updateForm();
    },
  },
};
</script>
