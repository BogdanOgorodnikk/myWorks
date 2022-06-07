<template>
  <main class="main">
    <div class="main-content" :style="pageBgImage">
      <OurLogo variant="dark" size="3xl" label="beta" class="bitrix-logo" />

      <router-view />

      <OurLanguages variant="dark" />
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("user", ["bgImagePath"]),
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    pageBgImage() {
      return this.bgImagePath && !this.isMobileDevice
        ? `background-image: url(${this.bgImagePath});`
        : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.main {
  @apply h-screen bg-white;
  @apply p-2;
}

.main-content {
  @apply h-full w-full;
  @apply rounded-2xl bg-base-light bg-cover bg-center bg-no-repeat;
  @apply flex flex-col items-center justify-evenly;
}

.bitrix-logo {
  &::v-deep {
    .logo {
      .logo-label {
        @apply bg-base-dark;
      }
    }
  }
}
</style>
