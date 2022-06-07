<template>
  <div class="head-wrapper">
    <OurCard class="head-card-info">
      <div class="head-card-info-left">
        <div class="head-card-info-title">
          <span class="head-card-info-title-bold">{{ $t("title.accountNumber") }}</span
          >&nbsp;:
          <span class="head-card-info-title-bold">{{ accountNumber }}</span>
        </div>
        <div class="head-card-info-title">{{ localAddressService.street }}</div>
        <div class="head-card-info-title">
          {{ localAddressService.city }}, {{ localAddressService.stateProv }}
          {{ localAddressService.postalCode }}
        </div>
      </div>
      <div class="head-card-info-right">
        <div class="head-card-info-right-button">
          {{ accountStatus }}
        </div>
      </div>
    </OurCard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userLogin", "accountNumber", "accountStatus", "addressService"]),
    localAddressService() {
      return this.addressService.length ? this.addressService[0] : {};
    },
  },

  mounted() {
    this.getAccountInfos();
  },

  methods: {
    ...mapActions(["getAccountInfos"]),
  },
};
</script>

<style lang="postcss" scoped>
.head {
  &-wrapper {
    @apply flex justify-between;
    @apply mb-4;
  }

  &-card-info {
    @apply flex justify-between;

    &-right {
      @apply m-0 !important;

      &-button {
        @apply rounded-2xl bg-blue-100 py-2 px-4 text-xs font-semibold text-blue-800;
      }
    }

    &-title {
      @apply mt-1 text-base text-base font-normal text-gray-500;

      &-bold {
        @apply text-lg font-bold text-base-dark;
      }
    }
  }
}
</style>
