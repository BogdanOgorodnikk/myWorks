<template>
  <router-link :to="{ name: item.route }">
    <OurCard class="section-card" :class="cardClasses">
      <div class="section-card-header">
        <h3 class="section-card-header-title">{{ item.title }}</h3>

        <ArrowButton v-if="!item.isFutureSection" class="section-card-arrow" />
      </div>

      <p class="section-card-description">{{ item.description }}</p>
    </OurCard>
  </router-link>
</template>

<script>
import ArrowButton from "./components/ArrowButton";

export default {
  components: {
    ArrowButton,
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    cardClasses() {
      return {
        "section-card-future": this.item.isFutureSection,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.section-card {
  @apply flex h-36 flex-col justify-between;
  @apply cursor-pointer;

  &:hover {
    .settings-card-arrow {
      @apply bg-opacity-10;

      &::v-deep {
        .icon g [fill] {
          @apply text-gray-700;
        }
      }
    }
  }

  &-header {
    @apply flex items-center justify-between;

    &-title {
      @apply text-2xl font-medium text-base-dark;
    }
  }

  &-description {
    @apply mt-0 text-sm font-normal text-gray-450 !important;
  }

  &-arrow {
    @apply rotate-180 transform;
  }

  &-future {
    @apply cursor-default;

    .section-card-header-title {
      @apply text-gray-500;
    }
  }
}
</style>
