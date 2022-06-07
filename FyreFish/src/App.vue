<template>
  <div :class="appClasses">
    <OurLoader v-if="showLoader" />

    <OurNotify />

    <router-view />
  </div>
</template>

<script>
import AcceptjsService from "@/services/acceptjs.service";
import { mapState } from "vuex";

export default {
  name: "App",

  computed: {
    ...mapState("loader", ["showLoader"]),

    appClasses() {
      return {
        "pwa-app": navigator.standalone,
      };
    },
  },

  mounted() {
    AcceptjsService.init();
  },
};
</script>
