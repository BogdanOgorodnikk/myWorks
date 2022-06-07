<template>
  <perfect-scrollbar class="perfect-scrollbar" :class="theme">
    <div class="menu-wrap">
      <ul class="menu" :class="menuClasses">
        <template v-for="(item, index) in menuItems">
          <li
            v-if="!item.section"
            :key="index"
            :data-cy="`menu-link-${item.page}`"
            class="menu-item"
            :class="getMenuItemClasses(item)"
            @click="onClickMenuItem"
          >
            <a v-if="item.link" class="menu-item-link" :href="item.link" target="_blank">
              <OurSvgIcon :name="item.svgIcon.name" class="menu-item-link-icon" />
              <h5 class="menu-item-link-text">{{ $t(item.translate) }}</h5>
            </a>

            <router-link
              v-else-if="item.managerPage && isPropertyManager"
              class="menu-item-link"
              :to="{ name: item.page }"
            >
              <OurSvgIcon :name="item.svgIcon.name" class="menu-item-link-icon" />
              <h5 class="menu-item-link-text">{{ $t(item.translate) }}</h5>
            </router-link>

            <router-link
              v-else-if="item.page && !item.managerPage"
              class="menu-item-link"
              :to="{ name: item.page }"
            >
              <OurSvgIcon :name="item.svgIcon.name" class="menu-item-link-icon" />
              <h5 class="menu-item-link-text">{{ $t(item.translate) }}</h5>
            </router-link>
          </li>

          <li v-if="item.section" :key="index" class="menu-section" :class="sectionClasses">
            <h5 class="menu-section-text">{{ $t(item.translate) }}</h5>
          </li>
        </template>
      </ul>
    </div>
  </perfect-scrollbar>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";
import { mapGetters, mapMutations } from "vuex";
import { getTheme, layout } from "@ilevel/our.service.ui";

export default {
  name: "Menu",

  computed: {
    ...mapGetters(["isPropertyManager"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),

    theme() {
      return getTheme();
    },

    menuItems() {
      return layout.admin.menu.items;
    },

    menuClasses() {
      return {
        "menu-minimize": !this.isOpenAsideMenu,
      };
    },

    sectionClasses() {
      return {
        "menu-section-minimize": !this.isOpenAsideMenu,
      };
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE"]),

    getMenuItemClasses({ page }) {
      const parentRoute = page ? this.$router.resolve({ name: page }).href : page;

      return {
        "menu-item-active": this.$route.name === page || this.$route.path.includes(parentRoute),
      };
    },

    onClickMenuItem() {
      if (this.isPortableDevice) {
        this.CLOSE_PORTABLE_ASIDE();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.perfect-scrollbar {
  @apply h-full;

  .menu-wrap {
    @apply overflow-y-auto;

    .menu {
      @apply pt-6 md:pt-2.5 md:pr-6 md:pb-6;

      &-item {
        &:hover {
          @apply bg-white bg-opacity-[0.025] md:rounded-r-3xl;

          .menu-item-link-icon::v-deep {
            svg {
              path,
              g [fill] {
                @apply text-opacity-100 !important;
                @apply transition-all duration-200;
              }
            }
          }

          .menu-item-link-text {
            @apply text-gray-100;
          }
        }

        .menu-item-link {
          @apply flex py-3 pl-4 pr-6;

          &-icon::v-deep {
            svg {
              path,
              g [fill] {
                @apply fill-current text-violet-200;
                @apply text-opacity-20;
              }
            }
          }

          &-text {
            @apply flex items-center;
            @apply text-base font-normal text-gray-450;
            @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
            @apply pl-4;
          }
        }
      }

      &-item-active {
        @apply bg-white bg-opacity-5 md:rounded-r-3xl;

        .menu-item-link-text {
          @apply text-gray-100;
        }

        .menu-item-link-icon::v-deep {
          svg {
            path,
            g [fill] {
              @apply fill-current text-blue-500;
              @apply text-opacity-100 !important;
            }
          }
        }
      }

      .menu-section {
        @apply pt-6 pl-5 pr-6 pb-2.5;

        &-text {
          @apply text-xs font-normal uppercase text-violet-200 opacity-20;
          @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
        }
      }

      .menu-section-minimize {
        @apply invisible;
      }
    }

    .menu-minimize {
      @apply pr-1.5;
    }
  }
}
</style>

<!-- Accent theme -->
<style scoped lang="postcss">
.accent-theme {
  .menu-item {
    &-active {
      .menu-item-link-icon::v-deep {
        svg {
          path,
          g [fill] {
            @apply fill-current text-accent !important;
            @apply text-opacity-30 !important;
          }
        }
      }
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .menu-item {
    &:hover {
      @apply bg-opacity-25 !important;
    }

    &-link {
      &-icon::v-deep {
        svg g [fill] {
          @apply text-gray-450 !important;
        }
      }

      &-text {
        @apply text-gray-700 !important;
      }
    }

    &-active {
      @apply bg-opacity-50 !important;

      .menu-item-link-icon::v-deep {
        svg g [fill] {
          @apply fill-current text-violet-300 !important;
          @apply text-opacity-100 !important;
        }
      }

      .menu-item-link-text {
        @apply text-base-dark !important;
      }
    }
  }

  .menu-section-text {
    @apply text-gray-400 opacity-100 !important;
  }
}
</style>
