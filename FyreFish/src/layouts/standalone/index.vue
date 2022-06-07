<template>
  <OurViewport class="standalone-layout" :class="theme">
    <div class="layout-body">
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </OurViewport>
</template>

<script>
import { mapState } from "vuex";
import { getTheme } from "@ilevel/our.service.ui";

import OurViewport from "@/layouts/_bit/_components/OurViewport";

export default {
  name: "StandaloneLayout",
  components: {
    OurViewport,
  },

  computed: {
    ...mapState("layout", ["wideContent"]),

    theme() {
      return getTheme();
    },
  },

  methods: {},
};
</script>

<style lang="postcss" scoped>
@media print {
  body {
    @apply m-0 w-full scale-75;
  }
}
.standalone-layout {
  @apply bg-white;

  .layout-body {
    @apply flex;
    min-height: calc(100vh - 3.5rem);

    .main-content {
      @apply w-full;
      @apply rounded-t-2xl bg-cover bg-center bg-no-repeat md:rounded-2xl;
      @apply md:inline-flex;
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.admin-layout {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;

    .overlay-on-tablet {
      @apply opacity-70;
    }

    .aside-menu-opened {
      @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;
    }
  }
}
</style>
