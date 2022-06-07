<template>
  <div class="date-button">
    <t-button class="arrow arrow-left" @click="onClickShiftRange('prev')">
      <OurSvgIcon class="icon" size="sm" name="Angle-left" />
    </t-button>

    <t-button :id="id" class="date-current" :text="title" @blur="onBlur" @click="onClickRangeSet" />

    <t-button class="arrow arrow-right" @click="onClickShiftRange('next')">
      <OurSvgIcon class="icon" size="sm" name="Angle-right" />
    </t-button>
  </div>
</template>

<script>
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import TButton from "vue-tailwind/dist/t-button";

export default {
  components: {
    OurSvgIcon,
    TButton,
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },

  methods: {
    onClickShiftRange(action) {
      this.$emit("clickShiftRange", action);
    },

    onClickRangeSet() {
      this.$emit("clickRangeSet");
    },

    onBlur() {
      this.$emit("blur");
    },
  },
};
</script>

<style lang="postcss" scoped>
.date {
  &-button {
    @apply flex rounded-lg;
    @apply h-full;

    &:active {
      @apply bg-opacity-5;
    }

    &:focus-within {
      @apply ring-4 ring-gray-600 ring-opacity-15;
    }
  }

  &-current {
    @apply rounded-none shadow-none;
    @apply text-base font-medium text-base-dark;
    @apply border-0 bg-base-dark bg-opacity-5;

    &:hover {
      @apply bg-opacity-10;
    }

    &:focus {
      @apply border-0 ring-0;
    }
  }
}

.arrow {
  @apply flex items-center;
  @apply bg-base-dark bg-opacity-5 shadow-none;
  @apply border-0;

  &:hover {
    @apply bg-opacity-10;
  }

  &:focus {
    @apply border-0 ring-0;
  }

  &-left {
    @apply rounded-l-lg rounded-r-none;
  }

  &-right {
    @apply rounded-r-lg rounded-l-none;
  }
}

.icon {
  @apply cursor-pointer;

  &::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }
}
</style>
