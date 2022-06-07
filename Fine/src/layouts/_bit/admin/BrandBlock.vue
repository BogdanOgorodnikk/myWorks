<template>
  <div class="brand" :class="theme">
    <div class="brand-wrapper">
      <OurSvgIcon
        v-if="isTabletDevice && !isOpenAsideMenu"
        class="brand-icon menu-icon"
        name="Menu2"
        @click="onClickMenuIcon"
      />

      <OurLogo
        v-else
        :path="logoPath"
        :title="logoBrandName"
        :route="logoRoute"
        size="lg"
        @click="onClickLogo"
      />

      <OurDropdown
        v-if="isShownBrandNameDropdown && isOpenAsideMenu"
        :text="brandName"
        class="dropdown-brands"
        list-x-position="left"
      >
        <div
          v-for="(item, index) in brandNameDropdownItems"
          :key="index"
          :class="setActiveItemClass(item.businessName)"
          @click="onClickBrandNameDropdownItem(item.id, item.businessName)"
        >
          {{ item.title }}
        </div>
      </OurDropdown>
    </div>

    <OurSvgIcon
      v-if="fixedAsideMenu || isTabletDevice"
      name="Angle-double-left"
      class="brand-icon arrow-icon arrow-pinned"
      @click="onClickArrowIcon"
    />

    <OurSvgIcon
      v-else
      name="Angle-double-right"
      class="brand-icon arrow-icon arrow-unpinned"
      @click="onClickArrowIcon"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurLogo from "@ilevel/our.ui.logo";
import OurDropdown from "@ilevel/our.ui.button-dropdown";

export default {
  name: "BrandBlock",

  components: {
    OurDropdown,
    OurLogo,
    OurSvgIcon,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isTabletDevice"]),
    ...mapGetters("settings", ["brandName"]),
    ...mapGetters({ dropdownData: layout.admin.brandNameDropdown?.dropdownDataGetter }),

    theme() {
      return getTheme();
    },

    logoPath() {
      return layout.admin.logoPath;
    },

    logoRoute() {
      return { name: layout.admin.logoRoute || "MainLayout" };
    },

    brandNameDropdownItems() {
      return this.isShownBrandNameDropdown ? this.dropdownData : [];
    },

    isDynamicBrandName() {
      return layout.admin.brand.isDynamic;
    },

    logoBrandName() {
      let brandName = layout.admin.brand.name;

      if (this.isDynamicBrandName) {
        brandName = this.brandName;
      }

      return this.isShownBrandNameDropdown ? "" : brandName;
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
    ...mapMutations("layout", ["TOGGLE_FIXED_MENU", "OPEN_PORTABLE_ASIDE", "CLOSE_PORTABLE_ASIDE"]),

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
      if (this.isTabletDevice) this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.OPEN_PORTABLE_ASIDE();
    },

    onClickArrowIcon() {
      this.isTabletDevice ? this.CLOSE_PORTABLE_ASIDE() : this.TOGGLE_FIXED_MENU();
    },

    setActiveItemClass(item) {
      return item.toLowerCase() === this.brandName.toLowerCase() ? "active-dropdown-item" : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.brand {
  @apply hidden items-center justify-between overflow-hidden md:flex;
  @apply p-4 pt-9 lg:pl-3;

  &-wrapper {
    @apply flex items-center;
  }

  .brand-icon::v-deep {
    svg path {
      @apply fill-current text-violet-200;
    }
  }

  .menu-icon::v-deep {
    @apply mr-3.5;

    g path {
      @apply opacity-100;
    }
  }

  .arrow-icon::v-deep {
    @apply cursor-pointer;
    @apply hidden md:inline-table;

    svg g [fill] {
      @apply text-opacity-20;
    }
  }

  .arrow-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-blue-400;
      }
    }
  }

  .arrow-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-100;
      }
    }
  }
}

.dropdown-brands {
  &::v-deep {
    .dropdown-wrapper {
      @apply flex items-center;
      @apply whitespace-nowrap text-lg font-bold text-white;
      @apply ml-2 py-1 px-1.5;
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

      svg {
        @apply h-4 w-4;

        g [fill] {
          @apply text-gray-450;
        }
      }
    }

    .dropdown-wrapper-list {
      @apply absolute top-16;
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
  .menu-icon::v-deep {
    svg g [fill] {
      @apply text-base-dark;
    }
  }

  .arrow-icon::v-deep {
    svg g [fill] {
      @apply text-violet-300 text-opacity-100;
    }
  }

  .arrow-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-violet-400;
      }
    }
  }

  .arrow-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-50;
      }
    }
  }
}
</style>
