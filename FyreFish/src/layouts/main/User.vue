<template>
  <div class="user-wrap" :class="theme">
    <div :class="userClass" @click="onClickLogout">
      <OurSvgIcon data-cy="logout-btn" name="Sign-out" class="logout-icon" />

      <div class="user-title">Logout</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "User",

  computed: {
    ...mapGetters("layout", ["isOpenAsideMenu"]),

    theme() {
      return getTheme();
    },

    userClass() {
      return this.isOpenAsideMenu ? "user" : "user-minimize";
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE"]),

    ...mapActions(["logout"]),

    async onClickLogout() {
      this.CLOSE_PORTABLE_ASIDE();

      await this.logout();
    },
  },
};
</script>

<style lang="postcss" scoped>
.user-wrap {
  @apply py-6 px-4 md:pt-0 md:pr-6 md:pl-0 md:pb-8;

  .user {
    @apply flex w-full items-center;
    @apply border border-solid border-violet-200 border-opacity-20 md:border-l-0;
    @apply rounded-r-2xl rounded-l-2xl md:rounded-l-none;
    @apply py-4;
    @apply cursor-pointer transition-all duration-300;

    &:hover {
      .logout-icon::v-deep {
        g [fill] {
          @apply text-opacity-100;
          @apply transition duration-100 ease-in-out;
        }
      }

      .user-title {
        @apply text-opacity-100;
        @apply transition duration-100 ease-in-out;
      }
    }

    &-title {
      @apply text-base font-normal text-white text-opacity-50;
      @apply pl-4;
    }
  }

  .user-minimize {
    @apply flex;
    @apply py-4 pr-5;
    @apply border border-l-0 border-transparent;

    .user-title {
      @apply overflow-hidden;
    }
  }

  .logout-icon::v-deep {
    @apply ml-auto ml-4 flex items-center;

    g [fill] {
      @apply fill-current text-violet-200;
      @apply text-opacity-20;
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .user {
    @apply border-gray-200 border-opacity-100;
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
      @apply text-gray-400 text-opacity-100;
    }
  }
}
</style>
