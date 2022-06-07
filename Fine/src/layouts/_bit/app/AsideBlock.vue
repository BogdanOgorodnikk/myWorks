<template>
  <div class="aside" :class="[theme, asideClasses]">
    <OurMenu :items="menuItems.main" />

    <div>
      <UserBlock />

      <OurMenuFooter :items="menuItems.footer" :brand-name="brandName" class="menu-footer" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

import OurMenu from "@ilevel/our.layout-ui.menu";
import OurMenuFooter from "@/layouts/_bit/_components/OurMenuFooter";
import UserBlock from "./UserBlock";

export default {
  name: "AsideBlock",
  components: {
    OurMenu,
    OurMenuFooter,
    UserBlock,
  },

  computed: {
    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),

    theme() {
      return getTheme();
    },

    asideClasses() {
      return {
        "aside-opened": this.isOpenAsideMenu,
        "aside-closed": !this.isOpenAsideMenu,
        "mobile-menu-height": this.isPortableDevice && this.isOpenAsideMenu,
      };
    },

    menuItems() {
      return {
        main: layout.app.menu.items,
        footer: layout.app.menu.footerItems,
      };
    },

    brandName() {
      return layout.app.brandName;
    },
  },
};
</script>

<style lang="postcss" scoped>
.aside::v-deep {
  @apply z-40 w-full max-w-full;
  @apply transition-all duration-300;
  @apply border-t border-solid border-violet-200/20;

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

.aside-opened {
  @apply flex flex-col justify-start;
}

.aside-closed {
  @apply hidden;
}

.menu-footer {
  @apply px-9 pb-8 md:pb-4 md:pl-5;
}

.mobile-menu-height {
  height: calc(100vh - 3.5rem);
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.aside {
    @apply border-blue-50;
  }
}
</style>
