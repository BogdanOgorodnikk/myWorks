<template>
  <vue-topprogress ref="topProgress" class="top-loader" :class="topLoaderClasses" />
</template>

<script>
import { vueTopprogress } from "vue-top-progress";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    vueTopprogress,
  },

  props: {
    resourceNames: {
      type: [String, Array],
      default: "",
    },

    zIndex: {
      type: String,
      default: "auto",
    },
  },

  computed: {
    ...mapState("loader", ["requestsQuare", "componentRequestsQuare", "isLoading"]),

    resourceNamesArray() {
      return Array.isArray(this.resourceNames) ? [...this.resourceNames] : [this.resourceNames];
    },

    topLoaderClasses() {
      const zIndex = {
        auto: "top-loader-z-auto",
        50: "top-loader-z-50",
      };

      return zIndex[this.zIndex];
    },
  },

  watch: {
    requestsQuare: {
      deep: true,
      handler: "onChangeRequestsQuare",
    },
    isLoading: {
      deep: true,
      handler: "onChangeLoadingState",
    },
  },

  created() {
    if (this.resourceNames) {
      this.SET_COMPONENT_REQUESTS_QUARE(this.resourceNamesArray);
    }
  },

  beforeDestroy() {
    if (this.resourceNames) {
      this.DELETE_COMPONENT_REQUESTS_QUARE();
    }
  },

  methods: {
    ...mapMutations("loader", ["SET_COMPONENT_REQUESTS_QUARE", "DELETE_COMPONENT_REQUESTS_QUARE"]),

    requestWithoutQuery(request) {
      const [requestWithoutQuery] = request.split("?");

      return requestWithoutQuery;
    },

    onChangeLoadingState() {
      if (
        !this.resourceNames &&
        this.$refs.topProgress.isStarted &&
        this.$refs.topProgress.show &&
        !this.isLoading
      ) {
        this.$refs.topProgress.done();
      }
    },

    onChangeRequestsQuare() {
      let isActiveRequests = false;

      if (this.resourceNames) {
        this.resourceNamesArray.forEach((item) => {
          if (!isActiveRequests) {
            const activeRequest = this.requestsQuare.find(
              (request) => this.requestWithoutQuery(request) === item
            );

            isActiveRequests = !!activeRequest;
          }
        });

        if (isActiveRequests && !this.$refs.topProgress.isStarted) {
          this.$refs.topProgress.start();
        } else if (
          !isActiveRequests &&
          this.$refs.topProgress.isStarted &&
          this.$refs.topProgress.show
        ) {
          this.$refs.topProgress.done();
        }
      } else {
        this.requestsQuare.forEach((item) => {
          const activeRequest = this.componentRequestsQuare.find(
            (request) => request === this.requestWithoutQuery(item)
          );

          isActiveRequests = !activeRequest;
        });

        if (this.isLoading && isActiveRequests && !this.$refs.topProgress.isStarted) {
          this.$refs.topProgress.start();
        }
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.top-loader {
  @apply !absolute;

  &-z-auto {
    @apply !z-auto;
  }

  &-z-50 {
    @apply !z-50;
  }

  &::v-deep {
    .peg {
      @apply !hidden;
    }
  }
}
</style>
