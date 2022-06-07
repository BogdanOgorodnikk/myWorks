<template>
  <div>
    <img v-if="avatarSrc" class="avatar-image" :class="sizeClass" :src="avatarSrc" />

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
     * Set the path for img.
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
      const isUrl = this.path.includes("http");

      return this.path && !isUrl ? require(`@/${this.path}`) : this.path;
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

.size-sm {
  @apply h-6 w-6;
}

.size-md {
  @apply h-8 w-8;
}

.size-lg {
  @apply h-10 w-10;
}

.size-xl {
  @apply h-12 w-12;
}
</style>
