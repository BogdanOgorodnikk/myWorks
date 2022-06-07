<template>
  <div class="menu-footer">
    <div class="menu-footer-wrapper">
      <div class="menu-footer-title">{{ brandName }}</div>

      <div class="menu-footer-version">{{ appVersion }}</div>
    </div>

    <div v-if="items.length" class="menu-footer-block">
      <router-link v-for="(item, index) in items" :key="index" :to="{ name: item.page }">
        <OurSvgIcon
          :tooltip="$t(item.translate)"
          class="menu-footer-icon"
          :name="item.svgIconName"
        />
      </router-link>
    </div>
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
const { version } = require(`${process.env.BASE_URL}package.json`);

export default {
  components: {
    OurSvgIcon,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    brandName: {
      type: String,
      default: "",
    },
  },

  computed: {
    appVersion() {
      return `v.${version}`;
    },
  },
};
</script>

<style lang="postcss" scoped>
.menu-footer {
  @apply flex items-center justify-between;
  @apply space-x-4 overflow-hidden;

  &-wrapper {
    @apply flex items-end space-x-1;
  }

  &-title {
    @apply text-sm font-normal text-gray-450;
  }

  &-version {
    @apply text-2xs font-normal text-gray-450;
    @apply mb-px;
  }

  &-block {
    @apply flex space-x-3;
  }

  &-icon {
    @apply block cursor-pointer;

    &::v-deep svg g [fill] {
      @apply text-violet-200/20;
    }

    &:hover {
      &::v-deep svg g [fill] {
        @apply text-violet-200/100;
        @apply transition-all duration-200;
      }
    }
  }
}
</style>
