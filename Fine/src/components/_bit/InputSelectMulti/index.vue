<template>
  <div :class="theme">
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
        :track-by="valueKey"
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
                <!-- @slot Use it to add tag title. -->
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
        <!-- @slot Use it to add something after caret. -->
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
    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },

    /**
     * Set component select value.
     */
    value: {
      type: Array,
      default: () => [],
    },

    /**
     * Set options for component.
     */
    options: {
      type: Array,
      default: () => [],
    },

    /**
     * Set component label.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Label from option Object, that will be visible in the dropdown.
     */
    itemLabel: {
      type: String,
      default: "label",
    },

    /**
     * Set input placeholder.
     */
    placeholder: {
      type: String,
      default: "",
    },

    /**
     * Set error message.
     */
    error: {
      type: String,
      default: "",
    },

    /**
     * Make component inactive.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Allows to remove all selected values. Otherwise one must be left selected.
     */
    allowEmpty: {
      type: Boolean,
      default: true,
    },

    /**
     * Allow internal search.
     */
    withInternalSearch: {
      type: Boolean,
      default: true,
    },

    /**
     * Set limits the options displayed in the dropdown to the first X options.
     */
    optionsLimit: {
      type: Number,
      default: OPTIONS_LIMIT,
    },

    /**
     * Set track value key.
     */
    valueKey: {
      type: String,
      default: "id",
    },

    /**
     * Fixed opening direction (instead of auto). Options are "above"/"top" or "below"/"bottom".
     * @values auto, top, bottom
     */
    openDirection: {
      type: String,
      default: "auto",
    },

    /**
     * Set description for component.
     */
    description: {
      type: String,
      default: "",
    },

    /**
     * By default new tags will appear above the search results. Changing to 'bottom' will revert this behaviour and will proritize the search results.
     * @values top, bottom
     */
    tagPosition: {
      type: String,
      default: "top",
    },

    /**
     * Allow return full value properties.
     */
    returnFullValue: {
      type: Boolean,
      default: false,
    },

    /**
     * Set name of the property containing the group label.
     */
    groupLabel: {
      type: String,
      default: "label",
    },

    /**
     * Set name of the property containing the group values.
     */
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
                return value[this.valueKey] === item;
              });
            });

            return options[this.groupValues].find((value) => {
              return value[this.valueKey] === item;
            });
          }

          const value = item?.[this.valueKey] || item;

          return this.options.find((option) => option[this.valueKey] === value);
        });
      },

      set(value) {
        let newValue = value;

        if (!this.returnFullValue) newValue = value.map((item) => item[this.valueKey]);

        this.$emit("input", newValue);
      },
    },

    theme() {
      return getTheme();
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

<style lang="postcss" scoped>
.multiselect {
  &-wrapper {
    @apply flex w-full items-center;
    @apply rounded-lg border border-gray-300;
    @apply relative;

    &-disabled {
      @apply border-gray-100 bg-gray-100;

      &:hover {
        @apply border-gray-100;
      }

      &:focus-within {
        @apply border-gray-100 ring-0;
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
        @apply static min-h-full w-full overflow-hidden text-left;
        @apply pt-6;
      }

      .multiselect__tags {
        @apply rounded-none border-0 bg-transparent;
        @apply mb-px pt-1 pb-2 pl-4 pr-4;
        @apply min-h-full w-full;
      }

      .multiselect__input {
        @apply text-base font-medium text-base-dark;
        @apply !relative block !w-full align-top;
        @apply mb-0 !pt-px !pb-0 !pl-0 !pr-10;
        @apply rounded-none border-none bg-white;

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
        @apply pointer-events-none;
      }

      .multiselect__content-wrapper {
        @apply my-2 rounded-lg shadow;
        @apply absolute right-0 top-full;
        @apply z-50 block max-h-60 w-full overflow-auto;
        @apply bg-white;
        -webkit-overflow-scrolling: touch;
      }

      .multiselect__content {
        @apply inline-block list-none align-top;
        @apply m-0 min-w-full p-0;
      }

      .multiselect--above {
        .multiselect__content-wrapper {
          @apply top-auto bottom-full;
        }
      }

      .multiselect__element {
        @apply block;
      }

      .multiselect__option {
        @apply whitespace-nowrap text-base font-normal normal-case text-base-dark no-underline;
        @apply relative block min-h-full cursor-pointer align-middle;
        @apply p-3;

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
          @apply !bg-gray-100;
        }

        .multiselect__single {
          @apply font-medium text-base-dark;
          @apply mb-px p-0;
          @apply relative inline-block w-full align-top;
          @apply border-none bg-gray-100;
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

  &-color {
    @apply text-sm font-normal text-gray-500;
    z-index: 9999;
  }
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
    @apply !bg-transparent;
    @apply !text-xs !font-medium uppercase !text-gray-450;
  }
}

.group-label {
  @apply text-xs font-medium uppercase text-gray-450;
}
</style>
