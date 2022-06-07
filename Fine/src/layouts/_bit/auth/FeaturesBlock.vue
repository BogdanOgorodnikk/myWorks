<template>
  <div class="features">
    <h1 class="features-header" v-html="$t('layout.auth.heading')"></h1>

    <div class="features-describe-wrap">
      <div v-for="(feature, index) in features" :key="index" class="features-describe">
        <OurSvgIcon class="icon" name="Thunder" color="green" />

        <h4 class="features-describe-text">
          {{ feature }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "FeaturesBlock",

  components: {
    OurSvgIcon,
  },

  data() {
    return {
      features: this.$t("layout.auth.feature"),
    };
  },
};
</script>

<style lang="postcss" scoped>
.features {
  &-header::v-deep {
    @apply mb-10 text-5xl font-bold text-white;

    span {
      @apply bg-gradient-to-br from-green-300 to-blue-300 bg-clip-text text-transparent;
    }
  }

  &-describe-wrap {
    @apply space-y-2.5;

    .features-describe {
      @apply flex items-center space-x-1;

      &-text {
        @apply text-base font-normal text-gray-400;
      }
    }
  }
}
</style>
