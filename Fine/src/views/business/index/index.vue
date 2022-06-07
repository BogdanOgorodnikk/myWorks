<template>
  <div class="business">
    <div class="business-wrapper" data-cy="business-page">
      <div class="business-wrapper-title">
        {{ $t("title.business.list") }}
      </div>
      <div class="business-box" data-cy="business-box">
        <OurCard v-for="business in businesses" :key="business.id" class="business-card">
          <div>
            <h2 class="business-card-title">{{ business.name }}</h2>

            <h4 class="business-card-info">{{ $t("label.active") }}</h4>
          </div>

          <div class="business-card-footer">
            <OurButton
              v-if="true"
              :text="$t('button.login')"
              class="business-card-login-button"
              @click="onClickLoginToBusiness(business.id, business.slug, business.name)"
            />

            <OurButton v-if="false" :text="$t('button.customize')" />

            <OurButton v-if="false" :text="$t('button.pay')" />

            <OurDropdown :text="$t('button.more')" variant="thirdary">
              <div @click="onClickDeleteBusiness(business.id, business.name)">
                {{ $t("button.delete") }}
              </div>
              <div @click="onClickButtonEditBusiness(business.id, business.name)">
                {{ $t("button.changeName") }}
              </div>
            </OurDropdown>
          </div>
        </OurCard>

        <div class="custom-card" data-cy="add-business-button" @click="onClickButtonAddBusiness">
          <OurSvgIcon name="Plus2" color="gray" class="custom-card-icon" size="3xl" />
          <h2 class="business-card-add-headline">{{ $t("button.addBusiness") }}</h2>
        </div>
      </div>

      <AddBusinessModal ref="addBusinessModal" :show.sync="isShownAddBusinessModal" />

      <EditBusinessModal
        ref="editBusinessModal"
        :show.sync="isShownEditBusinessModal"
        :business="selectedBusiness"
      />

      <OurConfirmModal
        v-model="isShownDeleteModal"
        :title="$t('title.business.delete')"
        :action-button-text="$t('button.delete')"
        @actionConfirmed="onConfirmDeleteBusiness"
      >
        <div v-html="$t('page.business.deleteBusiness', { business: selectedBusiness.company })" />
      </OurConfirmModal>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import AddBusinessModal from "../add/AddBusinessModal";
import EditBusinessModal from "../edit/Modal";

export default {
  name: "BusinessesList",

  components: {
    EditBusinessModal,
    AddBusinessModal,
  },

  data: () => ({
    isShownAddBusinessModal: false,
    isShownEditBusinessModal: false,
    isShownDeleteModal: false,
    selectedBusiness: {
      id: "",
      company: "",
    },
  }),

  computed: {
    ...mapState("business", ["businesses"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),
  },

  async mounted() {
    await this.getBusinesses();

    this.$refs.addBusinessModal.showModalIfBusinessNotExist();
  },

  methods: {
    ...mapActions("business", ["getBusinesses", "deleteBusiness"]),

    ...mapActions(["loginToApp"]),

    ...mapMutations("business", ["SET_BUSINESSNAME"]),

    onClickButtonAddBusiness() {
      if (this.isMobileDevice) {
        this.$router.push({ name: "AddBusiness" });
      }

      this.isShownAddBusinessModal = true;
    },

    onClickButtonEditBusiness(id, businessCompanyName) {
      if (this.isMobileDevice) {
        this.$router.push({ name: "EditBusiness", params: { id: id } });
      }

      this.isShownEditBusinessModal = true;
      this.selectedBusiness.id = id;
      this.selectedBusiness.company = businessCompanyName;
    },

    async onClickLoginToBusiness(businessId, businessSlug, businessName) {
      this.SET_BUSINESSNAME(businessName);

      await this.loginToApp(businessId);
      await this.$router.push({ name: "MainLayout", params: { businessName: businessSlug } });
    },

    async onConfirmDeleteBusiness() {
      await this.deleteBusiness(this.selectedBusiness.id);
    },

    onClickDeleteBusiness(id, businessCompanyName) {
      this.isShownDeleteModal = true;
      this.selectedBusiness.id = id;
      this.selectedBusiness.company = businessCompanyName;
    },
  },
};
</script>

<style lang="postcss" scoped>
.business {
  @apply w-full;
  @apply px-4 lg:px-0;
}

.business-wrapper {
  @apply md:mx-auto;
  @apply pb-6;

  &-title {
    @apply text-2xl font-medium text-white md:text-4xl;
    @apply text-center md:text-left;
    @apply pt-2 pb-6 md:pt-16 md:pb-10;
  }
}

.business-box {
  @apply grid grid-rows-1 gap-4 md:gap-6;
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-4;
}

.business-card-title {
  @apply text-2xl font-medium text-gray-900 md:text-3xl;
  @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
}

.business-card-info {
  @apply text-sm font-normal text-gray-600;
  @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
}

.business-card-footer {
  @apply flex justify-between;
}

.custom-card {
  @apply border border-solid border-gray-500;
  @apply w-full cursor-pointer rounded-2xl p-6 text-center;
  @apply transition duration-100 ease-in-out;
}

.custom-card:hover {
  @apply bg-base-light bg-opacity-5;
}

.business-card-add-headline {
  @apply text-2xl font-medium text-gray-300 md:text-3xl;
  @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
}

.custom-card-icon {
  @apply mt-1.5;
}
</style>
