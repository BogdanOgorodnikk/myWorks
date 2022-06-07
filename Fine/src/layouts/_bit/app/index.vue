<template>
  <OurViewport class="app-layout" :class="layoutClasses">
    <div class="main-layout">
      <HeaderBlock />

      <AsideBlock />

      <main class="main" :class="mainClasses">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>
  </OurViewport>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getThemeName, getTheme, isPWA } from "@ilevel/our.service.ui";

import OurViewport from "@ilevel/our.ui.viewport";
import HeaderBlock from "./HeaderBlock";
import AsideBlock from "./AsideBlock";

export default {
  name: "MainLayout",
  components: {
    OurViewport,
    HeaderBlock,
    AsideBlock,
  },

  computed: {
    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),

    layoutClasses() {
      const theme = getTheme();
      const classes = {
        "pwa-layout": isPWA,
      };

      return [theme, classes];
    },

    mainClasses() {
      return {
        hidden: this.isOpenAsideMenu,
        flex: !this.isOpenAsideMenu,
        "portable-height": this.isPortableDevice,
      };
    },
  },

  created() {
    this.CLOSE_DESKTOP_ASIDE();

    this.setBodyBg();
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_DESKTOP_ASIDE"]),

    setBodyBg() {
      const body = document.querySelector("body");
      const theme = getThemeName();
      const bodyClass = theme ? `theme-bg-${theme}` : "theme-bg-default";

      if (isPWA) {
        const bodyPWAClass = `${bodyClass}-pwa`;

        body.classList.add(bodyPWAClass);
      }

      body.classList.add(bodyClass);
    },
  },
};
</script>

<style lang="postcss">
.theme-bg {
  &-default {
    @apply bg-base-dark;
  }

  &-sweet {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;

    &-pwa {
      @apply bg-base-dark;
    }
  }
}
</style>

<style lang="postcss" scoped>
.app-layout {
  @apply bg-base-dark;
  @apply h-full min-h-screen;
  @apply flex justify-center;

  .main-layout {
    @apply w-full md:max-w-[90rem];
    @apply lg:px-14 lg:pb-8;

    .main {
      @apply transition-all duration-300 lg:z-10;
      min-height: calc(100vh - 7.7rem);

      .main-content {
        @apply flex justify-center;
        @apply w-full;
        @apply rounded-t-2xl lg:rounded-b-2xl;
      }
    }

    .portable-height {
      height: calc(100vh - 3.5rem);
    }
  }
}

.pwa-layout::v-deep {
  @apply fixed inset-0;
  @apply rounded-t-2xl;

  .header {
    @apply fixed inset-0 z-50 h-14 w-full;
  }

  .aside {
    @apply fixed inset-x-0 top-14;
  }

  .main {
    @apply fixed inset-x-0 top-14 overflow-y-auto;
  }
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.app-layout {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;
  }
}
</style>
