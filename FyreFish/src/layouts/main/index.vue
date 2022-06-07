<template>
  <OurViewport class="admin-layout" :class="theme">
    <MobileHeader />

    <div class="layout-body">
      <Aside :class="asideClasses" />

      <div class="overlay-on-tablet" :class="overlayClasses" @click="onClickOverlay" />

      <main class="main" :class="mainClasses">
        <div class="main-content" :class="contentClasses">
          <router-view />
        </div>
      </main>
    </div>
  </OurViewport>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTheme, isPWA } from "@ilevel/our.service.ui";

import OurViewport from "@/layouts/_bit/_components/OurViewport";
import MobileHeader from "./MobileHeader";
import Aside from "./Aside";

export default {
  name: "AdminLayout",
  components: {
    OurViewport,
    MobileHeader,
    Aside,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu", "wideContent"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isTabletDevice"]),

    theme() {
      return getTheme();
    },

    overlayClasses() {
      return this.isOpenAsideMenu ? "hidden md:block lg:hidden" : "hidden";
    },

    asideClasses() {
      return {
        "aside-menu-opened": this.isTabletDevice
          ? this.isOpenAsideMenu
          : this.isOpenAsideMenu && !this.fixedAsideMenu,
      };
    },

    mainClasses() {
      return {
        "menu-opened": this.isOpenAsideMenu,
        "menu-closed": !this.isOpenAsideMenu,
        "menu-fixed": this.fixedAsideMenu && this.isOpenAsideMenu,
      };
    },

    contentClasses() {
      return {
        "main-content-wide": this.wideContent,
        "pwa-main": isPWA,
      };
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE"]),

    onClickOverlay() {
      this.CLOSE_PORTABLE_ASIDE();
    },
  },
};
</script>

<style lang="postcss" scoped>
.aside {
  @apply print:hidden;
}
.admin-layout {
  @apply min-w-fit bg-base-dark;

  .layout-body {
    @apply flex;
    min-height: calc(100vh - 3.5rem);

    .overlay-on-tablet {
      @apply h-full w-full;
      @apply fixed top-0 left-0 z-30;
      @apply bg-base-dark opacity-90;
    }

    .main {
      @apply w-full md:z-auto md:min-h-screen;
      @apply md:pb-2 md:pt-2 md:pr-2;
      @apply transition-all duration-300;

      .main-content {
        @apply w-full;
        @apply rounded-t-2xl bg-cover bg-center bg-no-repeat md:rounded-2xl;

        &-wide {
          @apply md:w-full md:max-w-screen-2xl !important;
        }
      }

      .pwa-main {
        @apply fixed top-14 left-0 overflow-y-auto;
        height: calc(100% - 3.5rem);
      }
    }

    .menu-opened {
      @apply md:inline-flex;
      @apply md:ml-14;
      @apply print:ml-8;
    }

    .menu-closed {
      @apply inline-flex;
      @apply md:mx-2 md:ml-14;
      @apply print:ml-8;
    }
    .menu-fixed {
      @apply md:ml-14 lg:ml-72;
      @apply print:ml-8;
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.admin-layout {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;

    .overlay-on-tablet {
      @apply opacity-70;
    }

    .aside-menu-opened {
      @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;
    }
  }
}
</style>
