<template>
  <OurViewport class="auth-layout-wrap">
    <main class="main" :class="mainClass" :style="contentsTheme">
      <div class="view-wrap">
        <router-view />
      </div>
    </main>
  </OurViewport>
</template>

<script>
import OurViewport from "@/layouts/_bit/_components/OurViewport";
import { mapGetters } from "vuex";
import { isPWA } from "@ilevel/our.service.ui";

export default {
  name: "AuthLayout",

  components: {
    OurViewport,
  },

  computed: {
    ...mapGetters(["bgImagePath"]),

    contentsTheme() {
      return `background-image: url(${this.bgImagePath});`;
    },

    mainClass() {
      return {
        "pwa-main": isPWA,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.auth-layout-wrap {
  @apply flex h-full min-h-screen;
  @apply p-1.5;

  .main {
    @apply rounded-lg bg-base-light bg-cover bg-center bg-no-repeat;
    @apply flex w-full flex-col items-center justify-center;
    @apply p-6;

    .view-wrap::v-deep {
      @apply flex items-center justify-center;
      @apply w-full md:py-8;

      .card {
        @apply max-w-sm md:w-full md:max-w-md;
        @apply bg-transparent shadow-none md:bg-white md:shadow;
        @apply m-auto py-6 px-0 md:p-8;
      }

      .button {
        @apply mt-6 flex w-full justify-center md:mt-8;
      }
    }
  }
}
</style>
