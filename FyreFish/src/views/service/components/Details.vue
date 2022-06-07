<template>
  <div class="details">
    <div class="details-title" @click="onClickToggleDetails">
      {{ $t("button.details") }}

      <OurSvgIcon name="Angle-down" class="details-angle" :class="iconClass" />
    </div>

    <div v-if="isShownDetails" class="details-wrapper">
      <div v-for="(detail, index) in details" :key="index">
        <div v-for="(block, idx) in detail.blocks" :key="idx" class="details-item">
          <div class="details-description">{{ block.title }}:</div>
          <div>{{ block.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    isShownDetails: false,
  }),

  computed: {
    iconClass() {
      return {
        "icon-rotate": this.isShownDetails,
      };
    },
  },

  methods: {
    onClickToggleDetails() {
      this.isShownDetails = !this.isShownDetails;
    },
  },
};
</script>

<style lang="postcss" scoped>
.details {
  @apply rounded-b-2xl bg-white shadow;
  @apply mx-auto w-10/12 p-6;

  &-title {
    @apply flex items-center justify-center;
    @apply text-base font-normal text-black;
    @apply cursor-pointer;
  }

  &-angle {
    @apply transition-all duration-300;
    @apply px-6;

    &::v-deep g [fill] {
      @apply fill-current text-gray-500;
    }
  }

  &-item {
    @apply flex;
    @apply text-sm font-normal text-gray-500;
    @apply mt-6;
    @apply relative;
  }

  &-wrapper {
    @apply flex space-x-14;
  }

  &-description {
    @apply w-28 flex-none;
  }
}

.icon-rotate {
  @apply rotate-180 transform;
}
</style>
