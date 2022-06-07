<template>
  <span
    v-tippy="tippyConfig"
    class="svg-icon"
    :class="iconWrapClasses"
    :content="tooltip"
    @click="onClick"
    @blur="onBlur"
  >
    <inline-svg :class="iconClasses" :src="iconPath" />
  </span>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import VueTippy from "vue-tippy";
import "tippy.js/themes/light.css";
import Vue from "vue";

Vue.use(VueTippy, {
  arrow: true,
  theme: "light",
});

export default {
  name: "OurSvgIcon",

  components: {
    InlineSvg,
  },

  props: {
    /**
     * Set tooltip text.
     */
    tooltip: {
      type: String,
      default: "",
    },

    /**
     * Set tooltip settings.
     * [Look all settings here.](https://kabbouchi.github.io/vue-tippy/4.0/features/placement.html)
     */
    tooltipSettings: {
      type: Object,
      default: () => {},
    },

    /**
     * Set icon by name.
     */
    name: {
      type: String,
      required: true,
      default: "",
    },

    /**
     * The color of the icon.
     * @values black, white, gray, red, yellow, green, blue, violet
     */
    color: {
      type: String,
      default: "black",
    },

    /**
     * The size of the icon.
     * @values 2xs, xs, sm, md, lg, xl, 2xl, 3xl
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * Set pill background for icon.
     */
    pill: {
      type: Boolean,
      default: false,
    },

    /**
     * The variant of the icon.
     * @values light, dark
     */
    variant: {
      type: String,
      default: "light",
    },

    /**
     * Add interactive states to the icon (hover, clicked).
     */
    interactive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    tippyConfig() {
      return { onShow: () => !!this.tooltip, ...this.tooltipSettings };
    },

    iconWrapClasses() {
      const pillClasses = `pill pill-${this.color}`;

      return { [pillClasses]: this.pill };
    },

    iconClasses() {
      const color = `svg-icon-${this.color}-${this.variant}`;
      const size = `size-${this.size}`;
      const classes = { interactive: this.interactive };

      return [color, size, classes];
    },

    iconPath() {
      return require(`@ilevel/our.ui.icon-svg/icons/${this.name}.svg`);
    },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },

    onBlur(event) {
      this.$emit("blur", event);
    },
  },
};
</script>

<style lang="postcss" scoped>
.interactive::v-deep {
  @apply cursor-pointer;

  &:hover,
  &:active {
    g [fill] {
      @apply opacity-50;
    }
  }
}

.size-3xs {
  @apply h-3 w-3;
}

.size-2xs {
  @apply h-3.5 w-3.5;
}

.size-xs {
  @apply h-4 w-4;
}

.size-sm {
  @apply h-5 w-5;
}

.size-md {
  @apply h-6 w-6;
}

.size-lg {
  @apply h-8 w-8;
}

.size-xl {
  @apply h-10 w-10;
}

.size-2xl {
  @apply h-12 w-12;
}

.size-3xl {
  @apply h-14 w-14;
}

.svg-icon {
  @apply inline-table;

  svg::v-deep g [fill] {
    @apply fill-current;
  }

  &-black {
    &-light::v-deep g [fill],
    &-dark::v-deep g [fill] {
      @apply text-black;
    }
  }

  &-white {
    &-light::v-deep g [fill],
    &-dark::v-deep g [fill] {
      @apply text-white;
    }
  }

  &-gray {
    &-light::v-deep g [fill] {
      @apply text-gray-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-gray-700;
    }
  }

  &-red {
    &-light::v-deep g [fill] {
      @apply text-red-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-red-700;
    }
  }

  &-orange {
    &-light::v-deep g [fill] {
      @apply text-orange-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-orange-700;
    }
  }

  &-yellow {
    &-light::v-deep g [fill] {
      @apply text-yellow-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-yellow-700;
    }
  }

  &-green {
    &-light::v-deep g [fill] {
      @apply text-green-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-green-700;
    }
  }

  &-blue {
    &-light::v-deep g [fill] {
      @apply text-blue-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-blue-700;
    }
  }

  &-violet {
    &-light::v-deep g [fill] {
      @apply text-violet-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-violet-700;
    }
  }

  &-fuchsia {
    &-light::v-deep g [fill] {
      @apply text-fuchsia-400;
    }

    &-dark::v-deep g [fill] {
      @apply text-fuchsia-700;
    }
  }
}

.pill {
  @apply rounded-full p-1.5;

  &-black {
    @apply bg-black/5;
  }

  &-white {
    @apply bg-white/5;
  }

  &-gray {
    @apply bg-gray-500/5;
  }

  &-red {
    @apply bg-red-500/5;
  }

  &-orange {
    @apply bg-orange-500/5;
  }

  &-yellow {
    @apply bg-yellow-500/5;
  }

  &-green {
    @apply bg-green-500/5;
  }

  &-blue {
    @apply bg-blue-500/5;
  }

  &-violet {
    @apply bg-violet-500/5;
  }

  &-fuchsia {
    @apply bg-fuchsia-500/5;
  }
}
</style>
