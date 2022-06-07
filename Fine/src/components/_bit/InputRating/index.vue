<template>
  <div class="star-rating" :class="sizeClass">
    <div v-if="withCounter" class="counter">
      <!-- @slot Use it to add counter. -->
      <slot name="counter">
        {{ ratingCounter }}
      </slot>
    </div>

    <div class="icons">
      <OurSvgIcon
        v-for="star in starsNumber"
        :key="star"
        :data-cy="`rating-star-${star}`"
        :name="getIconName(star)"
        :size="iconSize"
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

    <!-- @slot Use it to add something right. -->
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
    /**
     * Set input rating value.
     */
    value: {
      type: Number,
      default: 0,
    },

    /**
     * Set the number of stars.
     */
    starsNumber: {
      type: Number,
      default: 5,
    },

    /**
     * Set component size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Make stars selectable.
     */
    selectable: {
      type: Boolean,
      default: false,
    },

    /**
     * Set error message.
     */
    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
    },

    /**
     * Hide / show counter.
     */
    withCounter: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    hovered: null,
  }),

  computed: {
    iconSize() {
      const sizes = {
        sm: "xs",
        md: "sm",
        lg: "md",
      };

      return sizes[this.size];
    },

    sizeClass() {
      return `size-${this.size}`;
    },

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
  @apply flex items-center space-x-2;

  .counter {
    @apply leading-none;
  }

  .icons {
    @apply leading-none;

    .star::v-deep:not(.selected-star) [stroke] {
      @apply stroke-current text-yellow-400;
    }

    .error-message {
      @apply font-normal text-red-500;
      @apply pl-1.5;
    }
  }
}

.size {
  &-sm {
    .counter {
      @apply text-2xs;
    }

    .error-message {
      @apply text-2xs;
    }
  }

  &-md {
    .counter {
      @apply text-xs;
    }

    .error-message {
      @apply text-xs;
    }
  }

  &-lg {
    .counter {
      @apply text-sm;
    }

    .error-message {
      @apply text-sm;
    }
  }
}
</style>
