<template>
  <OurViewport class="auth-layout" :class="layoutClasses">
    <div v-if="isShownFeatures" class="features-wrap">
      <OurLogo size="3xl" :path="featuresLogoPath" :label="logoLabel" />

      <FeaturesBlock />

      <div class="auth-layout-wrapper">
        <OurLanguages />

        <OurMenuFooter :items="menuItems" :brand-name="brandName" />
      </div>
    </div>

    <main class="main" :class="mainClasses" :style="pageBgImage">
      <OurLogo :class="portableClass" size="3xl" :path="logoPath" :label="logoLabel" />

      <div class="view-wrap">
        <router-view />
      </div>

      <OurLanguages :class="portableClass" variant="dark" />
    </main>
  </OurViewport>
</template>

<script>
import { getThemeName, getTheme, isPWA, layout } from "@ilevel/our.service.ui";
import { mapGetters } from "vuex";

import OurViewport from "@ilevel/our.ui.viewport";
import OurMenuFooter from "@ilevel/our.layout-ui.menu-footer";
import OurLogo from "@ilevel/our.ui.logo";
import OurLanguages from "@ilevel/our.ui.languages";
import FeaturesBlock from "./FeaturesBlock";

export default {
  name: "AuthLayout",

  components: {
    OurViewport,
    OurMenuFooter,
    OurLanguages,
    OurLogo,
    FeaturesBlock,
  },

  computed: {
    ...mapGetters("user", ["bgImagePath"]),

    isShownFeatures() {
      return layout.auth.features;
    },

    featuresLogoPath() {
      return layout.auth.featuresLogoPath;
    },

    logoPath() {
      return layout.auth.logoPath;
    },

    logoLabel() {
      return layout.auth.logoLabel;
    },

    layoutClasses() {
      const theme = getTheme();
      const classes = {
        "pwa-layout": isPWA,
        "pr-none-lg": this.isShownFeatures,
      };

      return [theme, classes];
    },

    mainClasses() {
      return {
        "rounded-r-none-lg features-l-rounded": this.isShownFeatures,
      };
    },

    pageBgImage() {
      const bgImageStyle = `background: url(${this.bgImagePath}) fixed center center;`;

      return this.bgImagePath ? bgImageStyle : "";
    },

    portableClass() {
      return {
        portable: this.isShownFeatures,
      };
    },

    menuItems() {
      return layout.auth.menu.footerItems;
    },

    brandName() {
      return layout.auth.brandName;
    },
  },

  created() {
    this.setBodyBg();
  },

  methods: {
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
    @apply bg-blue-600;

    &-pwa {
      @apply bg-base-dark;
    }
  }
}
</style>

<style lang="postcss" scoped>
.auth-layout {
  @apply flex h-full min-h-screen md:p-2;
  @apply bg-base-dark;

  &-wrapper {
    @apply flex items-center justify-between;
  }

  .features-wrap {
    @apply p-12;
    @apply hidden w-full max-w-3xl flex-col justify-between lg:flex;
  }

  .main {
    @apply flex w-full flex-col items-center justify-center;
    @apply rounded-t-2xl p-6 md:rounded-lg;
    @apply bg-base-light !bg-cover;

    .portable {
      @apply lg:hidden;
    }

    .view-wrap::v-deep {
      @apply flex items-center justify-center;
      @apply w-full md:py-10;

      .card {
        @apply max-w-sm md:w-full md:max-w-[25rem];
        @apply bg-transparent md:bg-white;
        @apply shadow-none md:shadow;
        @apply py-6 px-0 md:p-8;

        .auth-title {
          @apply text-center text-3xl font-bold text-base-dark;
          @apply mb-6 md:mb-8;
        }

        .auth-link {
          @apply mt-6 flex justify-center;
          @apply text-sm font-normal text-gray-500 underline;
        }
      }

      .button {
        @apply mt-6 w-full md:mt-8;
      }
    }
  }
}

.pwa-layout {
  .main {
    @apply fixed inset-0 h-full overflow-auto;
    @apply rounded-t-2xl;
  }
}

.pr-none-lg {
  @apply lg:pr-0;
}

.rounded-r-none-lg {
  @apply lg:!rounded-r-none;
}

.features-l-rounded {
  @apply lg:!rounded-l-2xl;
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.auth-layout {
    @apply bg-gradient-to-r from-violet-600 to-blue-600;

    .main {
      @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;
    }
  }

  &.pwa-layout {
    @apply bg-base-dark bg-none;
  }
}
</style>
