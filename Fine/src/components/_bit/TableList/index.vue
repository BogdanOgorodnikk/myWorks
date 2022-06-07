<template>
  <draggable
    v-bind="dragOptions"
    :list="list"
    :group="{ name: group }"
    class="list"
    handle=".drag-icon"
    drag-class="draggable-item"
    :class="theme"
    :move="onDragMove"
    @end="onDragEnd"
  >
    <div v-for="item in list" :id="item.id" :key="item.id" class="list-items">
      <div class="list-item-parent" data-cy="list-item">
        <div class="list-item-left">
          <OurSvgIcon class="icon-dial-numbers drag-icon" name="Dial-numbers" color="gray" />
        </div>

        <slot :item="item">
          <div class="list-item-left-title">{{ item.name }}</div>
        </slot>

        <div v-if="!item.isHiddenAction" class="list-item-right">
          <div v-if="isShownIconsSlot" class="icon-wrapper">
            <!-- @slot Use it to add icons. -->
            <slot name="icons" :item="item" />
          </div>

          <OurSvgIcon
            interactive
            class="icon-trash icon"
            name="Trash"
            color="red"
            data-cy="delete-list-item-icon"
            @click="onClickDelete(item.id, item.name)"
          />

          <OurSvgIcon
            class="icon-edit"
            name="Edit"
            color="gray"
            data-cy="edit-list-item-icon"
            @click="onClickEdit(item.id)"
          />
        </div>
      </div>

      <OurTableList
        v-if="nesting && !item.isDisabledNesting"
        :nesting="nesting"
        class="list-nested"
        :list="item.children"
        :group="group"
        @clickDelete="onClickDelete"
        @clickEdit="onClickEdit"
        @dragSort="onDragEnd"
      >
        <template #icons>
          <!-- @slot Use it to add icons. -->
          <slot name="icons" :item="item" />
        </template>
      </OurTableList>
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurTableList",

  components: {
    OurSvgIcon,
    draggable,
  },

  props: {
    /**
     * Set data list for component.
     */
    list: {
      type: Array,
      default: () => [],
    },

    /**
     * Set group name.
     */
    group: {
      type: String,
      default: "",
    },

    /**
     * Enable or disable nesting.
     */
    nesting: {
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

    theme() {
      return getTheme();
    },

    isShownIconsSlot() {
      return !!this.$slots["icons"];
    },
  },

  methods: {
    onDragMove(event) {
      const isDisabledNestingItem = event.draggedContext.element.isDisabledNesting;
      const isNestingAction = !event.relatedContext.element?.isDisabledNesting;

      if (isDisabledNestingItem && isNestingAction) {
        return false;
      }
    },

    onDragEnd() {
      const sortData = this.prepareSortData(this.list);

      this.$emit("dragSort", sortData);
    },

    onClickEdit(id) {
      this.$emit("clickEdit", id);
    },

    onClickDelete(id, title) {
      this.$emit("clickDelete", id, title);
    },

    prepareSortData(list, parentId) {
      let sortData = [];

      list.forEach((item) => {
        let hasItemChildren = item?.children?.length;

        if (hasItemChildren) {
          let childrenItem = this.prepareSortData(item.children, item.id);

          childrenItem.forEach((item) => {
            sortData.push(item);
          });
        }

        let parentItem = { id: item.id, parentId: 0 || parentId };

        sortData.push(parentItem);
      });

      return sortData;
    },
  },
};
</script>

<style lang="postcss" scoped>
.ghost {
  @apply bg-blue-100 bg-opacity-50;
}

.draggable-item {
  @apply rounded-lg bg-gray-200;
  @apply border-b-0;
}

.sortable-chosen {
  @apply rounded-lg;

  .list-item-parent {
    @apply border-b-0;
  }
}

.list {
  &-nested {
    @apply ml-6;
  }

  &-item {
    &-parent {
      @apply flex items-center justify-between;
      @apply py-4;
      @apply border border-r-0 border-l-0 border-t-0 border-solid border-gray-100;

      &:hover {
        &::v-deep {
          .icon {
            @apply opacity-100;
            @apply transition duration-100 ease-in-out;
          }
        }

        .icon-wrapper {
          @apply opacity-100;
          @apply transition duration-100 ease-in-out;
        }
      }
    }

    &-left {
      @apply flex items-center;

      &-title {
        @apply flex-auto;
        @apply text-base font-normal text-base-dark;
        @apply ml-5 pt-px;
      }
    }

    &-right {
      @apply flex flex-none items-center justify-end;
      @apply w-28 space-x-5;
    }
  }

  &-items {
    &:last-child {
      .list-item-parent {
        @apply border-b-0;
      }
    }
  }

  &-nested {
    .list-items {
      &:last-child {
        .list-item-parent {
          @apply border-b;
        }
      }
    }
  }
}

.icon {
  @apply opacity-0;

  &-wrapper {
    @apply flex items-center space-x-5;
    @apply opacity-0;
  }

  &-dial-numbers {
    @apply cursor-move;

    &::v-deep {
      & g [fill] {
        @apply text-gray-400;
        @apply opacity-100;
      }

      &:hover {
        g [fill] {
          @apply text-gray-500;
        }
      }
    }
  }

  &-trash {
    @apply cursor-pointer;

    &::v-deep g [fill] {
      @apply text-red-500;
    }
  }

  &-edit {
    @apply cursor-pointer;

    &::v-deep {
      & g [fill] {
        @apply text-gray-300;
      }

      &:hover {
        g [fill] {
          @apply text-gray-500;
        }
      }
    }
  }
}
</style>
