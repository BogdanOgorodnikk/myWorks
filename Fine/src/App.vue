<template>
  <div :class="appClasses">
    <CatLoader />

    <OurTopLoader v-if="!isRenderingPage" class="app-top-loader" z-index="50" />

    <OurNotify />

    <router-view />
  </div>
</template>

<script>
import CatLoader from "@/components/CatLoader";
import { mapState } from "vuex";
import { removeOutlineFocus } from "@ilevel/our.service.ui";

export default {
  name: "App",

  components: {
    CatLoader,
  },

  computed: {
    ...mapState("loader", ["isRenderingPage"]),

    appClasses() {
      return {
        "pwa-app": navigator.standalone,
      };
    },
  },

  created() {
    removeOutlineFocus();
  },
};
</script>
