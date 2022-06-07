<template>
  <div class="switch" :class="switchClasses" @click="onClickChangeSwitch">
    <div class="switch-wrapper" :class="wrapperClasses">
      <div class="switch-circle" :class="circleClass">
        <OurSvgIcon v-if="withIcon" :name="iconName" :color="iconColor" :size="iconSize" />
      </div>
    </div>
    <div v-if="!checkLabelVariant('hidden')" class="switch-title" :class="labelClasses">
      {{ switchLabel }}
    </div>
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const LABEL_VARIANT = {
  hidden: "hidden",
  inside: "inside",
  left: "left",
};

export default {
  components: {
    OurSvgIcon,
  },

  props: {
    /**
     * Set switch value.
     */
    value: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the switch.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: "md",
    },

    /**
     * The variant of the switch.
     * @values gray, red, orange, yellow, green, blue, violet, fuchsia
     */
    variant: {
      type: String,
      default: "blue",
    },

    /**
     * The label variant of the switch.
     * @values hidden, inside, left, right
     */
    labelVariant: {
      type: String,
      default: "hidden",
    },

    /**
     * Show on / off icon inside circle.
     */
    withIcon: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    i18n() {
      return {
        active: this.$te("component.switch.active")
          ? this.$t("component.switch.active")
          : this.$t("active"),
        disable: this.$te("component.switch.disable")
          ? this.$t("component.switch.disable")
          : this.$t("disable"),
      };
    },

    switchLabel() {
      return this.value ? this.i18n.active : this.i18n.disable;
    },

    isLabelInside() {
      return (
        this.checkLabelVariant(LABEL_VARIANT.inside) && this.checkLabelVariant(LABEL_VARIANT.hidden)
      );
    },

    labelPositionClass() {
      return this.checkLabelVariant(LABEL_VARIANT.left) && !this.isLabelInside
        ? "switch-left"
        : "switch-right";
    },

    switchClasses() {
      const size = `size-${this.size}`;
      const position = this.labelPositionClass;

      const width =
        this.checkLabelVariant(LABEL_VARIANT.hidden) || this.checkLabelVariant(LABEL_VARIANT.inside)
          ? "width-content"
          : "";

      const state = {
        "switch-on": this.value,
        "switch-off": !this.value,
      };

      return [size, width, position, state];
    },

    wrapperClasses() {
      const label = this.checkLabelVariant(LABEL_VARIANT.inside) ? "label-inside" : "";

      return [label, this.variant];
    },

    circleClass() {
      const size = this.size;
      const value = this.value;

      const margin = {
        "circle-ml-sm": size === "sm",
        "circle-ml-md": size === "md",
        "circle-ml-lg": size === "lg",
      };

      return value ? margin : "";
    },

    iconName() {
      return this.value ? "Check" : "Close";
    },

    iconSize() {
      const sizes = {
        sm: "2xs",
        md: "xs",
        lg: "sm",
      };

      return sizes[this.size];
    },

    iconColor() {
      return this.value ? this.variant : "gray";
    },

    labelBackgroundClass() {
      let background = "";

      if (!this.checkLabelVariant(LABEL_VARIANT.inside)) {
        background = this.value ? this.variant : "bg-gray";
      }

      return background;
    },

    labelClasses() {
      let variant = this.labelBackgroundClass;

      let labelPosition = this.checkLabelVariant(LABEL_VARIANT.inside)
        ? "label-inside"
        : "switch-title-outside";

      return [labelPosition, variant];
    },
  },

  methods: {
    checkLabelVariant(variant) {
      return variant === this.labelVariant;
    },

    onClickChangeSwitch() {
      this.$emit("input", !this.value);
    },
  },
};
</script>

<i18n>
en:
  disable: "Off"
  active: "On"
ru:
  disable: "Выкл"
  active: "Вкл"
ua:
  disable: "Викл"
  active: "Вкл"
</i18n>

<style lang="postcss" scoped>
.gray {
  @apply bg-gray-500;
}

.red {
  @apply bg-red-500;
}

.orange {
  @apply bg-orange-500;
}

.yellow {
  @apply bg-yellow-500;
}

.green {
  @apply bg-green-500;
}

.blue {
  @apply bg-blue-500;
}

.violet {
  @apply bg-violet-500;
}

.fuchsia {
  @apply bg-fuchsia-500;
}

.size {
  &-sm {
    @apply w-20;

    .switch-wrapper {
      @apply w-10;
    }

    .switch-wrapper.label-inside {
      @apply w-14;
    }

    .switch-circle {
      @apply h-5 w-5;
    }
  }

  &-md {
    @apply w-[5.313rem];

    .switch-wrapper {
      @apply w-12;
    }

    .switch-wrapper.label-inside {
      @apply w-[4rem];
    }

    .switch-circle {
      @apply h-6 w-6;
    }
  }

  &-lg {
    @apply w-[5.72rem];

    .switch-wrapper {
      @apply w-14;
    }

    .switch-wrapper.label-inside {
      @apply w-[4.2rem];
    }

    .switch-circle {
      @apply h-[1.625rem] w-[1.625rem];
    }
  }
}

.circle-ml-sm {
  margin-left: calc(100% - 1.25rem);
}

.circle-ml-md {
  margin-left: calc(100% - 1.5rem);
}

.circle-ml-lg {
  margin-left: calc(100% - 1.625rem);
}

.width-content {
  @apply w-min;
}

.bg-gray {
  @apply bg-gray-300;
}

.switch {
  @apply relative flex items-center;

  &-wrapper {
    @apply relative flex items-center;
    @apply rounded-3xl p-0.5;
    @apply cursor-pointer;
    @apply transition-all duration-300 ease-in-out;
  }

  &-circle {
    @apply h-4 w-4 rounded-full bg-white;
    @apply transition-all duration-300 ease-in-out;
    @apply flex items-center justify-center;
  }

  &-title {
    @apply absolute right-0;
    @apply text-center text-2xs font-medium uppercase text-white;
    @apply cursor-pointer transition-all duration-300 ease-in-out;

    &-outside {
      @apply h-[0.87rem] w-[1.875rem] rounded-sm;
      @apply pt-px text-center;
    }
  }

  &-off {
    .switch-wrapper {
      @apply bg-gray-300;
    }

    .switch-circle {
      @apply ml-0;
    }

    .switch-title.label-inside {
      @apply w-1/2;
      @apply right-1;
    }
  }

  &-on {
    .switch-title.label-inside {
      @apply left-1 right-auto;
      @apply w-1/2;
    }
  }

  &-left {
    @apply pl-[2.125rem];

    .switch-title {
      @apply right-auto left-0;
    }
  }
}
</style>
