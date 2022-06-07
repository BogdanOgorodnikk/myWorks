<template>
  <div class="brand" :class="theme">
    <OurSvgIcon
      v-if="isTabletDevice && !isOpenAsideMenu"
      class="brand-icon menu-icon"
      name="Menu"
      @click="onClickMenuIcon"
    />

    <OurLogo
      v-else
      :path="logoName"
      :title="brandName"
      :route="mainLayoutRoute"
      size="lg"
      @click="onClickLogo"
    />

    <OurSvgIcon
      v-if="isTabletDevice"
      name="Angle-double-left"
      class="brand-icon arrow-icon"
      @click="onClickArrowIcon"
    />

    <OurSvgIcon
      v-else
      name="Thumbtack"
      class="brand-icon thumbtack-icon"
      :class="thumbtackIconClasses"
      @click="onClickThumbtackIcon"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

export default {
  name: "Brand",

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isTabletDevice"]),
    ...mapGetters("settings", ["brandName"]),

    theme() {
      return getTheme();
    },

    logoName() {
      return layout.admin.logoPath;
    },

    thumbtackIconClasses() {
      return {
        "thumbtack-pinned": this.fixedAsideMenu,
        "thumbtack-unpinned": !this.fixedAsideMenu,
      };
    },

    mainLayoutRoute() {
      return { name: "MainLayout" };
    },
  },

  methods: {
    ...mapMutations("layout", ["TOGGLE_FIXED_MENU", "OPEN_PORTABLE_ASIDE", "CLOSE_PORTABLE_ASIDE"]),

    onClickLogo() {
      if (this.isTabletDevice) this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.OPEN_PORTABLE_ASIDE();
    },

    onClickArrowIcon() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickThumbtackIcon() {
      this.TOGGLE_FIXED_MENU();
    },
  },
};
</script>

<style lang="postcss" scoped>
.brand {
  @apply hidden items-center justify-between overflow-hidden md:flex;
  @apply pt-9 pb-4 pl-3 pr-6;

  .brand-icon::v-deep {
    svg g [fill] {
      @apply fill-current text-violet-200;
    }
  }

  .menu-icon::v-deep {
    @apply ml-1 mr-3.5;
    @apply scale-125 transform;

    g path {
      @apply opacity-100;
    }
  }

  .arrow-icon::v-deep svg {
    g path {
      @apply text-opacity-20;
    }
  }

  .thumbtack-icon::v-deep {
    @apply cursor-pointer;
    @apply hidden md:inline-table;

    svg g [fill] {
      @apply text-opacity-20;
    }
  }

  .thumbtack-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-blue-400;
      }
    }
  }

  .thumbtack-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-100;
      }
    }
  }
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

  .thumbtack-icon::v-deep {
    svg g [fill] {
      @apply text-violet-300 text-opacity-100;
    }
  }

  .thumbtack-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-violet-400;
      }
    }
  }

  .thumbtack-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-50;
      }
    }
  }
}
</style>
