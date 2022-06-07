<template>
  <div>{{ $t("page.login.loading") }}</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Login",

  computed: {
    ...mapGetters(["isAuthenticatedUser"]),
  },

  watch: {
    isAuthenticatedUser: "redirectToHome",
  },

  mounted() {
    this.redirectToHome();
  },

  methods: {
    redirectToHome() {
      if (this.isAuthenticatedUser) {
        this.$router.push({ name: "MainLayout" });
      }
    },
  },
};
</script>
