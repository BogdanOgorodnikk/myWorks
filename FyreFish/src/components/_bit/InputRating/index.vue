<template>
  <div class="star-rating">
    <div v-if="withCounter">
      <slot name="counter">
        {{ ratingCounter }}
      </slot>
    </div>

    <div class="icons">
      <OurSvgIcon
        v-for="star in maxStars"
        :key="star"
        :data-cy="`rating-star-${star}`"
        :name="getIconName(star)"
        :size="size"
        class="star"
        :class="getIconClasses(star)"
        color="yellow"
        @mouseover.native="onMouseHover(star)"
        @mouseleave.native="onMouseHover()"
        @click="onClickStar(star)"
      />

      <p v-if="error" class="error-message">
        {{ error }}
      </p>
    </div>

    <slot name="right" />
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurStarRating",

  components: {
    OurSvgIcon,
  },

  props: {
    value: {
      type: Number,
      default: 0,
    },

    maxStars: {
      type: Number,
      default: 5,
    },

    size: {
      type: String,
      default: "md",
    },

    selectable: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
    },

    withCounter: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    hovered: null,
  }),

  computed: {
    ratingCounter() {
      return this.hovered || this.value;
    },
  },

  methods: {
    onClickStar(newValue) {
      if (this.selectable) {
        const selected = newValue !== this.value ? newValue : 0;

        this.hovered = null;

        this.$emit("input", selected);
      }
    },

    onMouseHover(overStar) {
      if (this.selectable) this.hovered = overStar;
    },

    getIconName(star) {
      const isHalfSelected = this.ratingCounter > star - 1 && this.ratingCounter < star;
      const isSelected = star <= this.ratingCounter;

      return isHalfSelected ? "Half-star" : isSelected ? "Star" : "Star-outlined";
    },

    getIconClasses(star) {
      const roundedValue = Math.ceil(this.ratingCounter);
      const isSelected = star <= roundedValue;

      return {
        "selected-star": isSelected,
        "cursor-pointer": this.selectable,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.star-rating {
  @apply flex items-center space-x-2 text-sm;

  .icons {
    @apply leading-none;

    .star::v-deep:not(.selected-star) [stroke] {
      @apply stroke-current text-yellow-400;
    }

    .error-message {
      @apply text-xs font-normal text-red-500;
      @apply pl-1.5;
    }
  }
}
</style>
