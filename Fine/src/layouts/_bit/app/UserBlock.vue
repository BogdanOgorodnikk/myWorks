<template>
  <div class="user-wrap" :class="theme">
    <div class="user">
      <div class="user-block" @click="onClickUserInfo">
        <OurAvatar :data-cy="userBlockDataCy" :user-name="userProfileName" />

        <div class="user-info">
          <div data-cy="user-block-name" class="user-info-name">
            {{ userProfileName }}
          </div>

          <div class="user-info-email">
            {{ userProfileEmail }}
          </div>
        </div>
      </div>

      <OurSvgIcon data-cy="logout-btn" name="Sign-out" class="logout-icon" @click="onClickLogout" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurAvatar from "@ilevel/our.ui.avatar";

export default {
  name: "UserBlock",
  components: {
    OurAvatar,
    OurSvgIcon,
  },

  props: {
    userBlockDataCy: {
      type: String,
      default: "user-block",
    },
  },

  computed: {
    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),
    ...mapGetters("user", ["userProfileName", "userProfileEmail"]),

    theme() {
      return getTheme();
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "CLOSE_DESKTOP_ASIDE"]),

    ...mapActions(["logout"]),

    onClickUserInfo() {
      const routeName = layout.app.profileRouteName || "Profile";

      if (!this.isPortableDevice) {
        this.CLOSE_DESKTOP_ASIDE();
      } else if (this.isPortableDevice && this.isOpenAsideMenu) {
        this.CLOSE_PORTABLE_ASIDE();
      }

      if (this.$route.name !== routeName) this.$router.push({ name: routeName });
    },

    async onClickLogout() {
      this.CLOSE_PORTABLE_ASIDE();

      await this.logout();
    },
  },
};
</script>

<style lang="postcss" scoped>
.user-wrap {
  @apply px-4 pt-4 pb-3 md:py-6 lg:p-0;

  .user {
    @apply flex w-full justify-between;
    @apply border border-solid border-violet-200/20 lg:border-none;
    @apply rounded-r-2xl rounded-l-2xl;
    @apply py-4 px-5 lg:p-0;
  }

  .user-block {
    @apply flex w-10/12 cursor-pointer space-x-4;

    .user-info {
      @apply cursor-pointer;
      @apply text-base font-normal text-gray-450;
      @apply w-3/4 whitespace-nowrap;

      &:hover {
        @apply text-gray-100;
        @apply transition duration-100 ease-in-out;
      }

      &-name {
        @apply truncate;
      }

      &-email {
        @apply truncate;
        @apply text-xs;
      }
    }
  }

  .logout-icon::v-deep {
    @apply ml-3 flex cursor-pointer items-center;

    g [fill] {
      @apply fill-current text-violet-200/20;
    }

    &:hover {
      g [fill] {
        @apply text-violet-200/100;
        @apply transition duration-100 ease-in-out;
      }
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .user {
    @apply border-gray-200/100;
  }

  .user-block::v-deep {
    .user-info {
      @apply text-gray-600;

      &:hover {
        @apply text-gray-400;
      }
    }
  }

  .logout-icon::v-deep {
    g [fill] {
      @apply text-gray-400/100;
    }

    &:hover {
      g [fill] {
        @apply text-gray-400/40;
      }
    }
  }
}
</style>
