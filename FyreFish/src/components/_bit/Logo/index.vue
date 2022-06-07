<template>
  <router-link
    data-cy="our-logo"
    :to="route"
    class="logo-wrap"
    :class="theme"
    @click.native="onClick"
  >
    <div class="logo" :class="sizeClass">
      <div v-if="label" class="logo-label">
        {{ label }}
      </div>

      <img alt="logo" :src="logoPath" class="logo-image" />
    </div>

    <div v-if="title" class="title">
      {{ title }}
    </div>
  </router-link>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurLogo",

  props: {
    path: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "md",
    },

    route: {
      type: [String, Object],
      default: "/",
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    logoPath() {
      return require(`@/assets/images/${this.path}`);
    },

    sizeClass() {
      return `size-${this.size}`;
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="postcss" scoped>
.logo-wrap {
  @apply flex items-center;

  .logo {
    @apply relative;

    &-label {
      @apply bg-red-500 text-xs font-medium text-white;
      @apply rounded-full;
      @apply absolute -top-1.5 -right-8 py-0.5 px-2 md:-right-7;
    }

    &-image {
      @apply min-w-full;
    }
  }

  .title {
    @apply whitespace-nowrap px-3.5 text-lg font-bold text-white;
  }
}

.size-2xs {
  @apply h-3.5 w-3.5;
}

.size-xs {
  @apply h-4 w-4;
}

.size-sm {
  @apply h-5 w-5;
}

.size-md {
  @apply h-6 w-6;
}

.size-lg {
  @apply h-8 w-8;
}

.size-xl {
  @apply h-10 w-10;
}

.size-2xl {
  @apply h-12 w-12;
}

.size-3xl {
  @apply h-14 w-14;
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .title {
    @apply text-base-dark;
  }

  .logo-label {
    @apply bg-base-dark;
  }
}
</style>
