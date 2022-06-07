<template>
  <div class="building-block">
    <label class="building-wrapper" :class="buildingClass">
      <div class="left-border" />

      <div class="building-image" :style="buildingImage" />

      <div class="building-information">
        <div>
          <div class="building-information-title">{{ building.name }}</div>

          <div class="building-information-description">
            {{ building.street }} {{ building.city }} {{ building.stateProv }}
            {{ building.postalCode }}
          </div>
        </div>

        <t-radio
          :id="buildingId"
          v-model="selectedBuilding"
          class="building-radio"
          name="building-radio"
          :value="buildingId"
        />
      </div>

      <div class="right-border" />
    </label>
  </div>
</template>

<script>
import { getBuildingImage } from "@/api/building";

export default {
  name: "Building",

  props: {
    value: {
      type: String,
      default: "",
    },

    building: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    buildingImage: "",
  }),

  computed: {
    selectedBuilding: {
      get() {
        return this.value;
      },

      set(building) {
        this.$emit("input", building);
      },
    },

    buildingId() {
      return String(this.building.id);
    },

    buildingClass() {
      return this.buildingId === this.value ? "building-active" : "";
    },
  },

  async created() {
    await this.buildingImageStyle();
  },

  methods: {
    async buildingImageStyle() {
      const src = await getBuildingImage(`place-${this.building.id}-small`);

      this.buildingImage = `background-image: url(${src});`;
    },
  },
};
</script>

<style lang="postcss" scoped>
.left-border {
  @apply absolute z-30;
  @apply rounded-l-lg bg-accent;
  @apply h-full w-0;
}

.right-border {
  @apply absolute right-0 top-0 z-20;
  @apply rounded-r-lg bg-accent;
  @apply h-full w-0;
}

.building {
  &-block {
    @apply relative;
  }

  &-wrapper {
    @apply flex;
    @apply cursor-pointer;

    &:hover {
      @apply rounded-lg;
      @apply border-base-deep-red;

      .building-information {
        @apply border-gray-200;
      }

      .right-border,
      .left-border {
        @apply w-3.5;
      }
    }
  }

  &-active {
    .building-information {
      @apply border-gray-200;
    }

    .right-border,
    .left-border {
      @apply w-3.5;
    }
  }

  &-image {
    @apply z-40 ml-1.5 h-[4.5rem] w-[6.75rem];
    @apply rounded-lg;
    @apply bg-gray-100 bg-cover bg-center bg-no-repeat;
  }

  &-information {
    @apply flex flex-1 items-center justify-between;
    @apply z-30 -ml-3 mr-1.5 pl-6;
    @apply rounded-lg rounded-l-none border border-l-0 border-transparent;
    @apply bg-white;

    &-title {
      @apply text-lg font-medium text-base-dark;
    }

    &-description {
      @apply text-base font-medium text-gray-500;
    }
  }

  &-radio {
    @apply border border-solid border-gray-300;
    @apply h-6 w-6;
    @apply mr-4;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-base-deep-red ring-4 ring-red-200;
    }

    &:active {
      @apply border-base-deep-red bg-base-deep-red;
    }

    &:checked {
      @apply border-base-deep-red bg-base-deep-red;
    }
  }
}
</style>
