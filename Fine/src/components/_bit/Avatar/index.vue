<template>
  <div>
    <img v-if="avatarSrc" class="avatar-image" :class="sizeClass" :src="avatarSrc" alt="" />

    <span v-else class="avatar-letters" :class="sizeClass">
      {{ userNameFirstLetter }}
    </span>
  </div>
</template>

<script>
export default {
  name: "OurAvatar",

  props: {
    /**
     * Set avatar's image. It may be a URL or path from the "public" folder.
     */
    path: {
      type: String,
      default: "",
    },

    /**
     * The size of the avatar.
     * @values sm, md, lg, xl
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set user's name.
     */
    userName: {
      type: String,
      default: "",
    },
  },

  computed: {
    avatarSrc() {
      let src;

      if (this.path) {
        src = this.path.includes("http") ? this.path : process.env.BASE_URL + this.path;
      } else if (!this.userName && !this.path) {
        src = require("./default-avatar.png");
      }

      return src;
    },

    userNameFirstLetter() {
      return this.userName ? this.userName[0].toUpperCase() : "";
    },

    sizeClass() {
      return `size-${this.size}`;
    },
  },
};
</script>

<style scoped lang="postcss">
.avatar-image {
  @apply rounded-lg;
}

.avatar-letters {
  @apply flex h-full items-center justify-center;
  @apply bg-green-200 text-green-700;
  @apply rounded-lg text-lg font-medium;
}
.size {
  &-sm {
    @apply h-6 w-6;
  }

  &-md {
    @apply h-8 w-8;
  }

  &-lg {
    @apply h-10 w-10;
  }

  &-xl {
    @apply h-12 w-12;
  }
}
</style>
