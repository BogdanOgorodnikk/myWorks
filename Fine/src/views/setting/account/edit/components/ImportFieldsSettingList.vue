<template>
  <draggable
    :list="list"
    :group="{ name: group, pull: pull }"
    :change="list"
    v-bind="dragOptions"
    class="list"
    filter=".disabled"
    :sort="sort"
    :move="onMove"
    @sort="onSort"
    @end="onEnd"
  >
    <div
      v-for="item in list"
      :key="item.id"
      :ref="item.code"
      class="list-items"
      :class="setColumnClass(item.code)"
    >
      <div class="list-item-wrapper">
        <OurSvgIcon
          class="dial-numbers-icon drag-icon"
          name="Dial-numbers"
          color="gray"
          size="xs"
        />

        <div class="list-item-title">
          {{ item.name }}
        </div>
      </div>

      <div>
        <OurSvgIcon class="info-icon" name="Info-circle" size="xs" :tooltip="item.description" />
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    group: {
      type: String,
      default: "",
    },

    pull: {
      type: [Boolean, String],
      default: true,
    },

    sort: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: this.group,
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  methods: {
    onSort() {
      this.$emit("sort");
    },

    setColumnClass(code) {
      return `item-column-${code}`;
    },

    onMove() {
      this.$emit("move");
    },

    onEnd() {
      this.$emit("end");
    },
  },
};
</script>

<style lang="postcss" scoped>
.ghost {
  @apply bg-blue-100 bg-opacity-50 shadow-md !important;

  .list-item .list-item-left .list-left-title {
    @apply text-opacity-50;
  }

  .dial-numbers-icon::v-deep g [fill] {
    @apply fill-current text-gray-600;
  }
}

.list {
  @apply h-full;

  .disabled {
    @apply shadow-none;

    &:hover {
      @apply shadow-none;
      @apply border-gray-200;

      .dial-numbers-icon::v-deep g [fill] {
        @apply text-gray-450;
      }
    }
  }

  &-items {
    @apply flex items-center justify-between;
    @apply mb-2 p-3;
    @apply rounded-lg border border-gray-200 bg-white shadow-sm;
    @apply cursor-pointer;

    &:last-child {
      @apply mb-0;
    }

    &:hover {
      @apply border-gray-300 shadow;

      .dial-numbers-icon::v-deep g [fill] {
        @apply text-gray-600;
      }

      .disabled-dial-numbers-icon::v-deep g [fill] {
        @apply text-gray-300;
      }

      .info-icon {
        @apply block;
      }
    }
  }

  &-item {
    &-wrapper {
      @apply flex items-center;
    }

    &-title {
      @apply text-sm font-medium text-base-dark;
      @apply ml-2;
    }
  }
}

.dial-numbers-icon::v-deep g [fill] {
  @apply text-gray-450 opacity-100;
}

.info-icon {
  @apply hidden;

  &::v-deep g [fill] {
    @apply fill-current text-gray-450;
  }
}
</style>
