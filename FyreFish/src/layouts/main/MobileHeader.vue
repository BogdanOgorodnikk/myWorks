<template>
  <div class="mobile-header" :class="[theme, headerClass]">
    <OurLogo :path="logoName" :route="mainLayoutRoute" @click="onClickLogo" />

    <h4 class="mobile-header-title">{{ brandName }}</h4>

    <OurSvgIcon class="menu-icon" name="Menu" @click="onClickMenuIcon" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getTheme, layout, isPWA } from "@ilevel/our.service.ui";

export default {
  name: "MobileHeader",

  computed: {
    ...mapGetters("settings", ["brandName"]),

    theme() {
      return getTheme();
    },

    headerClass() {
      return {
        "pwa-header": isPWA,
      };
    },

    logoName() {
      return layout.admin.mobileLogoPath;
    },

    mainLayoutRoute() {
      return { name: "MainLayout" };
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "TOGGLE_PORTABLE_ASIDE"]),

    onClickLogo() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.TOGGLE_PORTABLE_ASIDE();
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-header {
  @apply flex w-full items-center justify-between md:hidden;
  @apply p-4;

  &-title {
    @apply whitespace-nowrap text-base font-medium text-white;
  }

  .menu-icon::v-deep svg {
    g [fill] {
      @apply fill-current text-white;
      @apply opacity-100;
    }
  }
}

.pwa-header {
  @apply fixed top-0 left-0 z-50 w-full;
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
