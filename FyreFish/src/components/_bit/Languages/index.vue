<template>
  <div class="languages">
    <h5
      v-for="(language, index) in languages"
      :key="index"
      class="title"
      :class="[titleClass, getActiveLanguageClass(language.code)]"
      @click="onChangeLanguage(language.code)"
    >
      {{ language.slug }}
    </h5>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import i18nService from "@ilevel/our.service.i18n";

export default {
  name: "OurLanguages",

  props: {
    variant: {
      type: String,
      default: "light",
    },
  },

  computed: {
    ...mapGetters(["languages"]),

    titleClass() {
      return `title-${this.variant}`;
    },
  },

  methods: {
    getActiveLanguageClass(language) {
      const isActiveLanguage = i18nService.getActiveLanguage() === language;
      const activeClass = `language-active-${this.variant}`;

      return {
        [activeClass]: isActiveLanguage,
      };
    },

    onChangeLanguage(language) {
      i18nService.setActiveLanguage(language);

      window.location.reload();
    },
  },
};
</script>

<style lang="postcss" scoped>
.languages {
  @apply flex;
  @apply space-x-3 divide-x divide-gray-500;

  .title {
    @apply text-sm font-medium text-gray-500;
    @apply cursor-pointer pl-3;

    &-light:hover {
      @apply text-white;
    }

    &-dark:hover {
      @apply text-base-dark;
    }
  }

  .language-active {
    &-light {
      @apply text-white;
    }

    &-dark {
      @apply text-base-dark;
    }
  }
}
</style>
