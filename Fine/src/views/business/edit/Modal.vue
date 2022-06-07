<template>
  <OurPageModal v-model="isShownModal" :title="$t('title.business.edit')">
    <BusinessForm
      ref="businessEditForm"
      :business="business"
      @update:companyName="onUpdateCompanyName"
    />

    <template #footer-left>
      <OurButton :text="$t('button.changeName')" @click="onSubmitForm" />

      <OurButton :text="$t('button.cancel')" variant="secondary" @click="onClickCancelButton" />
    </template>
  </OurPageModal>
</template>

<script>
import { mapActions } from "vuex";

import BusinessForm from "./components/BusinessForm";

export default {
  components: {
    BusinessForm,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    business: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    isShownModal: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit("update:show", value);
      },
    },
  },

  methods: {
    ...mapActions("business", ["updateBusiness"]),

    async onUpdateCompanyName(companyName) {
      const businessData = {
        id: this.business.id,
        name: companyName,
      };

      await this.updateBusiness({ businessData });

      this.isShownModal = false;
    },

    onSubmitForm() {
      this.$refs.businessEditForm.updateForm();
    },

    onClickCancelButton() {
      this.isShownModal = false;
    },
  },
};
</script>
