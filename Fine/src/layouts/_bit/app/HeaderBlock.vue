<template>
  <div class="header" :class="theme">
    <div class="desktop-brand">
      <OurLogo :path="logoPath" :size="logoSize" :title="logoTitle" @click="onClickLogo" />

      <div class="nav-buttons">
        <router-link v-for="(item, index) in navButtons" :key="index" :to="{ name: item.page }">
          <OurButton
            pill
            variant="thirdary"
            :text="$t(item.translate)"
            :class="isActiveRoute(item.page)"
          />
        </router-link>
      </div>
    </div>

    <h4 class="mobile-title">
      {{ layoutBrandName }}
    </h4>

    <div class="actions">
      <UserBlock class="desktop-user" user-block-data-cy="desktop-user-block" />

      <OurSvgIcon
        data-cy="header-menu-button"
        class="menu-icon"
        name="Menu2"
        @click="onClickMenuIcon"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

import OurLogo from "@ilevel/our.ui.logo";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurButton from "@ilevel/our.ui.button";
import UserBlock from "./UserBlock";

export default {
  name: "HeaderBlock",
  components: {
    OurLogo,
    OurSvgIcon,
    UserBlock,
    OurButton,
  },

  computed: {
    ...mapGetters("breakpoint", ["isPortableDevice"]),
    ...mapGetters("settings", ["brandName"]),

    theme() {
      return getTheme();
    },

    logoSize() {
      return this.isPortableDevice ? "md" : "lg";
    },

    layoutBrandName() {
      return layout.app.brand.isDynamic ? this.brandName : layout.app.brand.name;
    },

    logoTitle() {
      return !this.isPortableDevice ? this.layoutBrandName : "";
    },

    logoPath() {
      return layout.app.logoPath;
    },

    navButtons() {
      return layout.app.menu.items;
    },
  },

  methods: {
    ...mapMutations("layout", ["TOGGLE_PORTABLE_ASIDE", "CLOSE_PORTABLE_ASIDE"]),

    onClickLogo() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.TOGGLE_PORTABLE_ASIDE();
    },

    isActiveRoute(page) {
      const parentRoute = page ? this.$router.resolve({ name: page }).href : page;

      return { active: this.$route.name === page || this.$route.path.includes(parentRoute) };
    },
  },
};
</script>

<style lang="postcss" scoped>
.header {
  @apply flex w-full items-center justify-between;
  @apply p-4 lg:py-6 lg:px-0;

  .desktop-brand {
    @apply flex items-center justify-start;

    .nav-buttons {
      @apply hidden space-x-2 pl-2 lg:flex xl:space-x-4 xl:pl-[1.625rem];

      .button {
        @apply border-none text-white;

        &:hover {
          @apply bg-white/5;
        }
      }

      .active {
        @apply bg-white/5;

        &:hover {
          @apply bg-white/10;
        }
      }
    }
  }

  .mobile-title {
    @apply lg:hidden;
    @apply whitespace-nowrap text-base font-medium text-white;
  }

  .actions {
    @apply flex items-center justify-end;

    .desktop-user {
      @apply hidden lg:block;
      @apply max-w-[14rem];
    }

    .menu-icon::v-deep {
      @apply lg:hidden;

      path {
        @apply fill-current text-white;
        @apply opacity-100;
      }
    }
  }
}
</style>

<!-- Sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .mobile-title {
    @apply text-base-dark;
  }

  .menu-icon::v-deep svg g [fill] {
    @apply !text-base-dark;
  }

  .nav-buttons {
    .button {
      @apply !text-base-dark;

      &:hover {
        @apply !bg-base-dark/5;
      }
    }

    .active {
      @apply !bg-base-dark/5;

      &:hover {
        @apply !bg-base-dark/10;
      }
    }
  }
}
</style>
