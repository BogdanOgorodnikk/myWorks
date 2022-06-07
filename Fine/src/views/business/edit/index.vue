<template>
  <OurPage
    width="wide"
    :title="$t('title.business.edit')"
    class="page"
    :back-route="backRouteParams"
    :bg-image="false"
  >
    <BusinessForm
      ref="businessEditForm"
      :business="business"
      @update:companyName="onUpdateCompanyName"
    />

    <template #footer-left>
      <OurButton :text="$t('button.changeName')" class="button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.cancel')"
        variant="secondary"
        class="button"
        @click="onClickCancelButton"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";
import { getBusiness } from "@/api/business";

import BusinessForm from "./components/BusinessForm";

export default {
  components: {
    BusinessForm,
  },

  data: () => ({
    business: {},
  }),

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.business.list"),
        name: "Business",
      };
    },
  },

  async created() {
    const businessId = this.$route.params.id;

    this.business = await getBusiness(businessId);
  },

  methods: {
    ...mapActions("business", ["updateBusiness"]),

    async onUpdateCompanyName(companyName) {
      const companyId = this.$route.params.id;

      const businessData = {
        id: companyId,
        companyName: companyName,
      };

      await this.updateBusiness({ businessData });

      this.$router.push({ name: "Business" });
    },

    onSubmitForm() {
      this.$refs.businessEditForm.updateForm();
    },

    onClickCancelButton() {
      this.$router.push({ name: "Business" });
    },
  },
};
</script>
