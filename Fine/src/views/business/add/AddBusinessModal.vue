<template>
  <OurPageModal
    v-model="isShownModal"
    data-cy="add-business-modal"
    :title="$t('title.business.add')"
    :click-to-close="clickToClose"
    :show-close-icon="showCloseIcon"
    :esc-to-close="escToClose"
  >
    <BusinessForm ref="businessForm" @update:form="onUpdateForm" />

    <template #footer-left>
      <OurButton
        :text="$t('button.addBusiness')"
        data-cy="create-business-button"
        @click="onSubmitForm"
      />

      <OurButton :text="$t('button.demoBusiness')" variant="secondary" />
    </template>
  </OurPageModal>
</template>

<script>
import { mapActions, mapState } from "vuex";

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
  },

  data: () => ({
    clickToClose: true,
    escToClose: true,
    showCloseIcon: true,
  }),

  computed: {
    ...mapState("business", ["businesses"]),

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
    ...mapActions("business", ["createBusiness"]),

    showModalIfBusinessNotExist() {
      if (!this.businesses.length) {
        this.clickToClose = false;
        this.escToClose = false;
        this.showCloseIcon = false;
        this.isShownModal = true;
      } else {
        this.clickToClose = true;
        this.escToClose = true;
        this.showCloseIcon = true;
        this.isShownModal = false;
      }
    },

    async onUpdateForm(formData) {
      await this.createBusiness(formData);

      this.isShownModal = false;
    },

    onSubmitForm() {
      this.$refs.businessForm.updateForm();
    },
  },
};
</script>
