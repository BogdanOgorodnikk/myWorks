<template>
  <div v-if="isShownLoader" class="app-loader" :class="appLoaderClass" data-cy="cat-loader">
    <div class="loader-wrapper">
      <div>
        <img class="loader-border" :src="loaderBorder" alt="loader-border" />
      </div>

      <div ref="cat" class="loader-cat-wrapper" :class="moveCatClass">
        <img :src="loaderCat" alt="loaderCat" class="loader-cat" />
      </div>

      <div class="loader-logo-wrapper">
        <img
          :src="loaderLogo"
          class="loader-logo-letter"
          :class="logoLetterClass"
          alt="logo-letter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AppLoader",

  data: () => ({
    isShownLoader: true,
    isActiveLoader: true,
  }),

  computed: {
    ...mapState("loader", ["isRenderingPage"]),

    appLoaderClass() {
      return this.isActiveLoader ? "" : "hide-app-loader";
    },

    moveCatClass() {
      return this.isActiveLoader ? "loader-cat-move" : "loader-cat-hide";
    },

    logoLetterClass() {
      return !this.isActiveLoader ? "loader-logo-letter-show" : "";
    },

    loaderBorder() {
      return require("@/assets/images/loader/outline.svg");
    },

    loaderLogo() {
      return require("@/assets/images/loader/letter.svg");
    },

    loaderCat() {
      return require("@/assets/images/loader/cat.gif");
    },
  },

  mounted() {
    this.moveCat();
  },

  methods: {
    moveCat() {
      const move = setInterval(() => {
        const defaultWidth = 8;
        const maxWidth = 11;
        const step = 0.05;

        if (!this.isRenderingPage) {
          if (this.$refs.cat) {
            this.$refs.cat.style.width = `${defaultWidth}rem`;
          }

          this.isActiveLoader = false;

          setTimeout(() => {
            this.isShownLoader = false;
          }, 300);

          return clearInterval(move);
        }

        const width = this.$refs.cat?.style?.width?.replace(/rem/g, "") || defaultWidth;
        const newWidth = Number(width) + step;

        if (newWidth >= maxWidth) {
          return (this.$refs.cat.style.width = `${maxWidth}rem`);
        }

        if (this.$refs.cat) {
          this.$refs.cat.style.width = `${newWidth}rem`;
        }
      }, 50);
    },
  },
};
</script>

<style lang="postcss" scoped>
.app-loader {
  @apply flex items-center justify-center;
  @apply fixed top-0 left-0 z-[9999] h-screen w-screen bg-base-dark;
  @apply transition-all duration-300;
}

.hide-app-loader {
  @apply transition-all duration-1000 ease-in;
  @apply opacity-0;
}

.loader-wrapper {
  @apply flex;
  @apply relative;
}

.loader-border {
  @apply h-32 w-32;
}

.loader-cat-wrapper {
  @apply transition-all duration-100 ease-in;
  @apply flex items-center justify-end;
  @apply absolute overflow-hidden;
  @apply ml-2 pr-5;
  @apply z-10 h-32 w-32;
}

.loader-cat-hide {
  @apply transition-all duration-300 ease-in-out;
  @apply opacity-0;
}

.loader-cat {
  @apply max-w-none;
  height: 6.875rem;
}

.loader-cat-move {
  @apply transition-all duration-100 ease-in-out;
}

.loader-logo-letter {
  @apply h-16 w-16;
  @apply opacity-0;
}

.loader-logo-wrapper {
  @apply flex items-center justify-center;
  @apply absolute;
  @apply h-full w-full;
}

.loader-logo-letter-show {
  @apply transition-all duration-300 ease-in-out;
  @apply opacity-100;
}
</style>
