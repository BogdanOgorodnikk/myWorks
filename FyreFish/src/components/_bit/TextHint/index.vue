<template>
  <t-alert class="hint" :class="hintTypeClasses" show :timeout="alertTimeout" @hidden="onHidden">
    <div class="hint-wrapper">
      <slot />
    </div>
  </t-alert>
</template>

<script>
export default {
  name: "OurAlert",

  props: {
    type: {
      type: String,
      default: "description",
    },

    timeout: {
      type: Number,
      default: 2000,
    },
  },

  computed: {
    alertTimeout() {
      return this.type === "description" ? undefined : this.timeout;
    },

    hintTypeClasses() {
      return {
        "hint-error": this.type === "error",
        "hint-success": this.type === "success",
        "hint-description": this.type === "description",
      };
    },
  },

  methods: {
    onHidden() {
      this.$emit("hidden", this.message);
    },
  },
};
</script>

<style lang="postcss" scoped>
.hint {
  @apply rounded-lg border-0 p-4;

  &-wrapper {
    @apply text-xs;

    &::v-deep {
      h3 {
        @apply font-medium;
        @apply mb-0.5;
      }

      p {
        @apply font-normal;
      }

      ul {
        @apply font-normal leading-[1.125rem];
        @apply list-inside list-disc;
        @apply ml-2;
      }

      a {
        @apply block;
        @apply font-medium;
        @apply underline;
        @apply mt-2.5;
      }
    }
  }

  &-description {
    @apply bg-gray-100 text-gray-500;

    &::v-deep {
      button {
        @apply hidden;
      }
    }
  }

  &-error {
    @apply bg-red-50 text-red-700;

    &::v-deep {
      button {
        @apply text-red-500 hover:bg-red-200;
      }
    }
  }

  &-success {
    @apply bg-green-50 text-green-700;

    &::v-deep {
      button {
        @apply text-green-500 hover:bg-green-200;
      }
    }
  }
}
</style>
