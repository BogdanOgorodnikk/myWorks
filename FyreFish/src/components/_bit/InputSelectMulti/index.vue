<template>
  <div :class="wrapClasses">
    <div class="multiselect-wrapper" :class="multiselectClass">
      <label class="label" :class="labelClasses" :for="id">
        {{ label }}
      </label>

      <Multiselect
        :id="id"
        v-model="selectValue"
        class="multiselect"
        :options="withInternalSearch ? options : asyncOptions"
        :options-limit="optionsLimit"
        :multiple="true"
        :label="itemLabel"
        :track-by="trackBy"
        :open-direction="openDirection"
        select-label=""
        deselect-label=""
        selected-label=""
        hide-selected
        :group-label="groupLabel"
        :group-values="groupValues"
        :disabled="disabled"
        :placeholder="placeholderState"
        :allow-empty="allowEmpty"
        :internal-search="withInternalSearch"
        :loading="isLoading"
        :taggable="true"
        :tag-position="tagPosition"
        tag-placeholder=""
        @open="onOpen"
        @close="onClose"
        @search-change="onSearchChange"
      >
        <template #selection="{ values }">
          <div class="tags">
            <div v-for="(tag, index) in values" :key="index" class="tags-wrapper">
              <div class="tags-title">
                <slot name="tag-title" :tag="tag">
                  {{ tag.label }}
                </slot>
              </div>

              <OurSvgIcon
                size="sm"
                name="Close"
                interactive
                color="gray"
                @click="onClickRemoveValue(index)"
              />
            </div>
          </div>
        </template>

        <template #noResult>
          {{ i18n.listIsEmpty }}
        </template>

        <template #noOptions>
          {{ i18n.noDataToShow }}
        </template>

        <template v-if="isSelectedAllOptions" #afterList>
          <li class="multiselect__element">
            <span class="multiselect__option">
              {{ i18n.listIsEmpty }}
            </span>
          </li>
        </template>

        <template #caret="{ toggle }">
          <div
            v-show="!selectValue.length"
            class="multiselect-angle"
            @mousedown.prevent.stop="toggle"
          >
            <OurSvgIcon color="gray" name="Angle-down" class="icon" interactive />
          </div>

          <div v-if="selectValue.length" class="multiselect-clear" @click="onClickClearAll">
            <div class="multiselect-clear-text">
              {{ i18n.clear }}
            </div>
          </div>
        </template>
      </Multiselect>

      <div v-if="isShownAfterCaretSlot" class="after-caret">
        <slot name="after-caret" />
      </div>
    </div>

    <template v-if="description">
      <div class="description">
        {{ description }}
      </div>
    </template>

    <p v-if="error && !value.length" class="error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import ApiService from "@ilevel/our.service.api";
import { getTheme, getRandomId } from "@ilevel/our.service.ui";

import Multiselect from "vue-multiselect";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

const OPTIONS_LIMIT = 50;

export default {
  name: "OurMultiselect",
  components: {
    Multiselect,
    OurSvgIcon,
  },

  props: {
    id: {
      type: String,
      default: () => getRandomId(),
    },

    value: {
      type: Array,
      default: () => [],
    },

    options: {
      type: Array,
      default: () => [],
    },

    label: {
      type: String,
      default: "",
    },

    itemLabel: {
      type: String,
      default: "label",
    },

    placeholder: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    allowEmpty: {
      type: Boolean,
      default: true,
    },

    withInternalSearch: {
      type: Boolean,
      default: true,
    },

    optionsLimit: {
      type: Number,
      default: OPTIONS_LIMIT,
    },

    trackBy: {
      type: String,
      default: "id",
    },

    openDirection: {
      type: String,
      default: "bottom",
    },

    description: {
      type: String,
      default: "",
    },

    width: {
      type: String,
      default: "w-full",
    },

    tagPosition: {
      type: String,
      default: "top",
    },

    returnFullValue: {
      type: Boolean,
      default: false,
    },

    groupLabel: {
      type: String,
      default: "label",
    },

    groupValues: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    isLoading: false,
    asyncValue: "",
    asyncOptions: [],
    isOpen: false,
  }),

  computed: {
    selectValue: {
      get() {
        return this.value.map((item) => {
          if (this.groupValues) {
            const options = this.options.find((option) => {
              return option[this.groupValues].find((value) => {
                return value[this.trackBy] === item;
              });
            });

            return options[this.groupValues].find((value) => {
              return value[this.trackBy] === item;
            });
          }

          const value = item?.[this.trackBy] || item;

          return this.options.find((option) => option[this.trackBy] === value);
        });
      },

      set(value) {
        let newValue = value;

        if (!this.returnFullValue) newValue = value.map((item) => item[this.trackBy]);

        this.$emit("input", newValue);
      },
    },

    wrapClasses() {
      const theme = getTheme();

      return [theme, this.width];
    },

    multiselectClass() {
      return {
        error: this.error && !this.value.length,
        "multiselect-wrapper-disabled": this.disabled,
        "group-select": this.groupValues,
      };
    },

    i18n() {
      return {
        clear: this.$te("component.multiselect.clear")
          ? this.$t("component.multiselect.clear")
          : this.$t("clear"),
        listIsEmpty: this.$te("component.multiselect.listIsEmpty")
          ? this.$t("component.multiselect.listIsEmpty")
          : this.$t("listIsEmpty"),
        noDataToShow: this.$te("component.multiselect.noDataToShow")
          ? this.$t("component.multiselect.noDataToShow")
          : this.$t("noDataToShow"),
        addMore: this.$te("component.multiselect.addMorePlaceholder")
          ? this.$t("component.multiselect.addMorePlaceholder")
          : this.$t("addMore"),
      };
    },

    isSelectedAllOptions() {
      return this.options.length && this.options.length === this.selectValue.length;
    },

    labelClasses() {
      return {
        required: this.required,
        "label-color": this.isOpen,
        "error-label": this.error && !this.value.length,
      };
    },

    isShownAfterCaretSlot() {
      return !!this.$slots["after-caret"] && !this.selectValue.length;
    },

    placeholderState() {
      return this.selectValue.length
        ? this.i18n.addMore
        : this.placeholder || this.$t("placeholder.addMore");
    },
  },

  watch: {
    resetAsync() {
      this.asyncValue = "";
      this.asyncOptions = [];
    },
  },

  methods: {
    onOpen() {
      this.$emit("open");
      this.isOpen = true;
    },

    onClose() {
      this.isOpen = false;
    },

    onClickRemoveValue(index) {
      const intermediateValue = [...this.selectValue];

      intermediateValue.splice(index, 1);

      this.selectValue = intermediateValue;
    },

    onClickClearAll() {
      this.selectValue = [];
    },

    async onSearchChange(query) {
      if (this.withInternalSearch || !query) return;

      this.isLoading = true;

      this.asyncOptions = await ApiService.get(`${this.apiUrl}${query}`).then(
        (result) => result.data.data
      );

      this.isLoading = false;
    },
  },
};
</script>

<i18n>
en:
  listIsEmpty: "List is empty."
  noDataToShow: "No data to show."
  clear: "clear"
  addMore: "Add more..."
ru:
  listIsEmpty: "Список пуст."
  noDataToShow: "Нет данных."
  clear: "очистить"
  addMore: "Добавить ещё..."
ua:
  listIsEmpty: "Список порожній."
  noDataToShow: "Дані відсутні."
  clear: "очистити"
  addMore: "Додати ще..."
</i18n>

<style src="../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="postcss" scoped>
.multiselect {
  &-wrapper {
    @apply flex items-center;
    @apply rounded-lg border border-gray-300;
    @apply relative;

    &-disabled {
      @apply border-gray-100 bg-gray-100;

      &:hover {
        @apply border-gray-100 !important;
      }

      &:focus-within {
        @apply border-gray-100 ring-0 !important;
      }
    }

    &:hover {
      @apply border-gray-400;
      @apply transition duration-100 ease-in-out;
    }

    &:focus-within {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    &::v-deep {
      .multiselect {
        @apply flex flex-row-reverse justify-between;
        @apply static min-h-full;
        @apply pt-6;
      }

      .multiselect__tags {
        @apply rounded-none border-0 bg-transparent;
        @apply mb-px pt-1 pb-2 pl-4 pr-4;
        @apply min-h-full w-full;
      }

      .multiselect__input {
        @apply text-base font-medium text-base-dark;
        @apply relative block w-full !important;
        @apply mb-0 py-0 pl-0 pr-10 !important;
        @apply rounded-none;

        &:focus {
          @apply shadow-none outline-none ring-0;
        }

        &::placeholder {
          @apply text-base font-medium text-gray-400;
        }
      }

      .multiselect__placeholder {
        @apply hidden;
      }

      .multiselect--disabled {
        @apply rounded-lg bg-transparent;
        @apply opacity-100;
      }

      .multiselect__content-wrapper {
        @apply mt-2 rounded-lg shadow;
        @apply right-0 top-full;
      }

      .multiselect__option {
        @apply min-h-full p-4 text-base font-normal text-base-dark;

        &:hover {
          @apply bg-gray-100;
        }

        &:active {
          @apply bg-gray-200 font-medium;
        }

        &:disabled {
          @apply text-gray-500;
        }
      }

      .multiselect__option--selected {
        @apply bg-gray-200 font-medium;

        &:hover {
          @apply bg-gray-200 font-medium;
        }
      }

      .multiselect__option--highlight {
        @apply bg-transparent;
      }

      .multiselect--disabled {
        .multiselect__input {
          @apply bg-gray-100 !important;
        }

        .multiselect__single {
          @apply bg-gray-100;
        }
      }
    }
  }

  &-angle {
    @apply -mt-1.5 mr-4;
    @apply cursor-pointer;
  }

  &--active .icon {
    @apply rotate-180 transform transition-all duration-300;
  }

  &-clear {
    @apply absolute right-0 bottom-3.5 pr-4;
    @apply z-10 cursor-pointer;

    &-text {
      @apply transition-all duration-100 ease-in-out;
      @apply text-sm font-normal text-gray-400;

      &:hover {
        @apply text-gray-500;
      }
    }

    &:active {
      @apply text-gray-700;
    }
  }

  .tags {
    &-wrapper {
      @apply flex items-center justify-between;
      @apply border border-t-0 border-r-0 border-l-0 border-gray-100;
      @apply py-3;

      &:last-child {
        @apply mb-2.5;
      }
    }

    &-title {
      @apply text-base font-medium text-base-dark;
    }
  }
}

.icon {
  @apply transition-all duration-300;
}

.label {
  @apply absolute top-2.5 left-4 block;
  @apply text-sm font-normal text-gray-500;
  @apply z-10;

  &.required {
    &:after {
      content: "*";
      @apply absolute -right-1 font-bold text-red-600;
    }
  }

  &-color {
    @apply text-sm font-normal text-gray-500;
    z-index: 9999;
  }
}

.required:after {
  content: "*";
  @apply absolute font-medium text-red-600;
}

.description {
  @apply text-xs font-normal text-gray-450;
  @apply pl-4 pt-2;
}

.error {
  @apply border-red-300;

  &:hover {
    @apply border-red-400;
  }

  &:focus-within {
    @apply border-red-500 ring-4 ring-red-100;
  }

  &-label {
    @apply text-red-500;
  }

  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }
}

.after-caret {
  @apply pr-4;
}

.group-select::v-deep {
  .multiselect__option--group {
    @apply bg-transparent !important;
    @apply text-xs font-medium uppercase text-gray-450 !important;
  }
}

.group-label {
  @apply text-xs font-medium uppercase text-gray-450 !important;
}
</style>
