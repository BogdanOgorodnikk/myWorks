<template>
  <div
    class="aside"
    :class="[theme, asideClasses]"
    @mouseenter="onEnterMenu"
    @mouseleave="onLeaveMenu"
  >
    <BrandBlock />

    <OurMenu :items="menuItems.main" />

    <div>
      <UserBlock />

      <OurMenuFooter
        v-if="isOpenAsideMenu"
        :items="menuItems.footer"
        :brand-name="brandName"
        class="menu-footer"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

import BrandBlock from "./BrandBlock";
import OurMenu from "@ilevel/our.layout-ui.menu";
import OurMenuFooter from "@ilevel/our.layout-ui.menu-footer";
import UserBlock from "./UserBlock";

export default {
  name: "AsideBlock",
  components: {
    BrandBlock,
    OurMenu,
    OurMenuFooter,
    UserBlock,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    theme() {
      return getTheme();
    },

    asideClasses() {
      return {
        "aside-minimize": !this.isOpenAsideMenu,
        "shadow-lg": this.isOpenAsideMenu && !this.fixedAsideMenu,
        "mobile-menu-height": this.isMobileDevice && this.isOpenAsideMenu,
      };
    },

    menuItems() {
      return {
        main: layout.admin.menu.items,
        footer: layout.admin.menu.footerItems,
      };
    },

    brandName() {
      return layout.admin.brand.name;
    },
  },

  methods: {
    ...mapMutations("layout", ["OPEN_DESKTOP_ASIDE", "CLOSE_DESKTOP_ASIDE"]),

    onEnterMenu() {
      if (!this.isOpenAsideMenu && !this.fixedAsideMenu) this.OPEN_DESKTOP_ASIDE();
    },

    onLeaveMenu() {
      if (this.isOpenAsideMenu && !this.fixedAsideMenu) this.CLOSE_DESKTOP_ASIDE();
    },
  },
};
</script>

<style lang="postcss" scoped>
.aside::v-deep {
  @apply bg-base-dark;
  @apply w-full max-w-full md:max-w-[18rem];
  @apply h-max md:fixed md:h-screen;
  @apply z-40;
  @apply flex flex-col justify-start md:justify-between;
  @apply transition-all duration-300;
  @apply border-t border-solid border-violet-200 border-opacity-20 md:border-none;

  .ps__rail-y {
    &:hover {
      @apply bg-transparent;
    }

    &:active {
      @apply bg-transparent;
    }

    .ps__thumb-y {
      @apply bg-violet-200 opacity-25;
    }
  }
}

.aside-minimize::v-deep {
  @apply hidden pr-0 md:flex md:w-14;
  @apply transition-colors duration-300;
}

.menu-footer {
  @apply px-9 pb-8 md:pb-4 md:pl-5;
}

.mobile-menu-height {
  height: calc(100vh - 3.5rem);
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.aside {
    @apply border-blue-50 bg-transparent;
  }
}
</style>
