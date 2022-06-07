<template>
  <div class="wrapper" :class="theme">
    <div class="title">{{ title }}</div>

    <div class="stepper">
      <svg width="100%" height="100%" viewBox="0 0 40 40">
        <defs>
          <linearGradient id="gradient" class="svg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" class="stop-1" />
            <stop offset="100%" class="stop-2" />
          </linearGradient>
        </defs>

        <circle
          class="stepper-ring"
          cx="20"
          cy="20"
          r="15.91549430918954"
          fill="transparent"
          stroke-width="4"
        ></circle>

        <circle
          cx="20"
          cy="20"
          r="15.91549430918954"
          fill="transparent"
          stroke="url(#gradient)"
          stroke-width="4"
          :stroke-dasharray="accountOccupancyInPercent"
          stroke-dashoffset="0"
        ></circle>
        <g class="stepper-count">
          <text y="45%" transform="translate(0, 2)">
            <tspan x="50%" text-anchor="middle" class="stepper-count">{{ step }}</tspan>
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { getTheme } from "@ilevel/our.service.ui";

export default {
  name: "OurStepper",

  props: {
    /**
     * Set component title.
     */
    title: {
      type: String,
      default: "",
    },

    /**
     * Set step number.
     */
    step: {
      type: Number,
      default: null,
    },

    /**
     * Set total number of steps.
     */
    totalSteps: {
      type: Number,
      default: null,
    },
  },

  computed: {
    theme() {
      return getTheme();
    },

    accountOccupancyInPercent() {
      const maxCountPercent = 100;
      const activePercent = (this.step / this.totalSteps) * maxCountPercent;

      return `${activePercent} ${maxCountPercent}`;
    },
  },
};
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex items-center justify-between;
}

.title {
  @apply text-xl font-medium text-base-dark;
}

.stepper {
  @apply h-12 w-12;

  .svg-gradient {
    .stop-1 {
      stop-color: theme("colors.blue.500");
    }

    .stop-2 {
      stop-color: theme("colors.blue.500");
    }
  }

  &-ring {
    @apply stroke-current text-gray-100;
  }

  &-count {
    @apply text-xl font-bold text-base-dark;
    @apply translate-y-2 transform;
  }
}
</style>

<!-- Sweet theme -->
<style lang="postcss" scoped>
.sweet-theme {
  .svg-gradient {
    .stop-1 {
      stop-color: theme("colors.violet.600");
    }

    .stop-2 {
      stop-color: theme("colors.blue.600");
    }
  }
}
</style>
