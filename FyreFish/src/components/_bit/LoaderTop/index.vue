<template>
  <vue-topprogress ref="topProgress" class="top-loader" />
</template>

<script>
import { vueTopprogress } from "vue-top-progress";
import { mapState } from "vuex";

export default {
  components: {
    vueTopprogress,
  },

  computed: {
    ...mapState("loader", ["isLoading"]),
  },

  watch: {
    isLoading: "onChangeLoadingState",
  },

  mounted() {
    if (this.isLoading) {
      this.$refs.topProgress.start();
    }
  },

  methods: {
    onChangeLoadingState() {
      this.isLoading ? this.$refs.topProgress.start() : this.$refs.topProgress.done();
    },
  },
};
</script>

<style lang="postcss" scoped>
.top-loader {
  @apply !absolute;
}
</style>
