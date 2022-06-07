<template>
  <div class="mobile-header" :class="theme">
    <OurLogo :path="logoPath" :route="logoRoute" @click="onClickLogo" />

    <div class="mobile-header-wrapper">
      <OurDropdown v-if="isShownBrandNameDropdown" :text="layoutBrandName" class="dropdown-brands">
        <div
          v-for="(item, index) in brandNameDropdownItems"
          :key="index"
          :class="setActiveItemClass(item.businessName)"
          @click="onClickBrandNameDropdownItem(item.id, item.businessName)"
        >
          {{ item.title }}
        </div>
      </OurDropdown>

      <h4 v-else class="mobile-header-title">{{ layoutBrandName }}</h4>
    </div>

    <OurSvgIcon class="menu-icon" name="Menu2" @click="onClickMenuIcon" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurLogo from "@ilevel/our.ui.logo";
import OurDropdown from "@ilevel/our.ui.button-dropdown";

export default {
  name: "MobileHeader",
  components: {
    OurDropdown,
    OurSvgIcon,
    OurLogo,
  },

  computed: {
    ...mapGetters("settings", ["brandName"]),
    ...mapGetters({ dropdownData: layout.admin.brandNameDropdown?.dropdownDataGetter }),

    theme() {
      return getTheme();
    },

    layoutBrandName() {
      return layout.admin.brand.isDynamic ? this.brandName : layout.admin.brand.name;
    },

    logoPath() {
      return layout.admin.mobileLogoPath;
    },

    logoRoute() {
      return { name: layout.admin.logoRoute || "MainLayout" };
    },

    brandNameDropdownItems() {
      return this.isShownBrandNameDropdown ? this.dropdownData : [];
    },

    isShownBrandNameDropdown() {
      return !!layout.admin.brandNameDropdown;
    },
  },

  async created() {
    if (this.isShownBrandNameDropdown) {
      this.getDropdownData();
    }
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "TOGGLE_PORTABLE_ASIDE"]),

    ...mapActions({
      getDropdownData: layout.admin.brandNameDropdown?.getDataAction,
      dropdownItemClick: layout.admin.brandNameDropdown?.dropdownItemClickAction,
    }),

    async onClickBrandNameDropdownItem(businessId, businessName) {
      await this.dropdownItemClick({
        businessId,
        businessName,
      });
    },

    onClickLogo() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.TOGGLE_PORTABLE_ASIDE();
    },

    setActiveItemClass(item) {
      return item.toLowerCase() === this.brandName.toLowerCase() ? "active-dropdown-item" : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-header {
  @apply flex w-full items-center justify-between md:hidden;
  @apply p-4;

  &-wrapper {
    @apply relative flex items-center;
  }

  &-title {
    @apply whitespace-nowrap text-base font-medium text-white;
  }

  .menu-icon::v-deep svg {
    path {
      @apply fill-current text-white;
      @apply opacity-100;
    }
  }
}

.dropdown-brands {
  &::v-deep {
    .dropdown-wrapper {
      @apply flex items-center;
      @apply whitespace-nowrap text-lg font-bold text-white;
      @apply py-1 px-1.5;
      @apply rounded-md border-transparent;

      &:focus {
        @apply bg-white bg-opacity-5;
        @apply ring-0;
      }

      &:hover {
        @apply bg-white bg-opacity-5;
      }
    }

    .svg-icon {
      @apply relative top-0 -right-1;
      @apply ml-0.5;

      svg {
        @apply h-4 w-4;

        g [fill] {
          @apply text-gray-450;
        }
      }
    }

    .dropdown-wrapper-list {
      @apply absolute top-8 -right-20 z-50;
    }
  }
}

.active-dropdown-item {
  @apply bg-base-dark bg-opacity-10;
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .mobile-header-title {
    @apply text-base-dark;
  }

  .menu-icon::v-deep svg {
    g [fill] {
      @apply text-base-dark;
    }
  }
}
</style>
