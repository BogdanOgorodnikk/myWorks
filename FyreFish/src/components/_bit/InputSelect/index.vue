<template>
  <div :class="[theme, width]">
    <div class="multiselect-wrapper" :class="multiselectClass">
      <label v-if="label" class="label" :class="labelClasses" :for="id">
        {{ label }}
      </label>

      <Multiselect
        :id="id"
        v-model="selectValue"
        class="multiselect"
        :options="selectOptions"
        :options-limit="optionsLimit"
        :label="itemLabel"
        :group-label="groupLabel"
        :group-values="groupValues"
        :group-select="groupSelect"
        :track-by="trackBy"
        :open-direction="openDirection"
        select-label=""
        deselect-label=""
        selected-label=""
        :hide-selected="false"
        :disabled="disabled"
        :placeholder="placeholder"
        :allow-empty="allowEmpty"
        :internal-search="withInternalSearch"
        :loading="isLoading"
        @open="onOpen"
        @close="onClose"
        @search-change="findOptions"
        @remove="removeValue"
        @input="onInput"
      >
        <template #singleLabel="props">
          <slot :scope-props="props" name="singleLabel" />
        </template>

        <template slot="option" slot-scope="props">
          <slot :scope-props="props" name="option" />

          <div v-if="groupValues && !isShownOptionSlot">
            <div v-if="props.option.$groupLabel">
              {{ props.option.$groupLabel }}
            </div>

            <div
              v-else-if="props.option.isSubGroup"
              class="group-label"
              :style="leftMarginForSubCategory(props.option.level)"
            >
              {{ props.option.label }}
            </div>

            <div v-else :style="leftMarginForSubCategory(props.option.level)">
              {{ props.option.label }}
            </div>
          </div>
        </template>

        <template #noResult>
          {{ i18n.listIsEmpty }}
        </template>

        <template #noOptions>
          {{ i18n.noDataToShow }}
        </template>

        <template #caret="{ toggle }">
          <div v-if="!selectValue" class="multiselect-caret" @mousedown.prevent.stop="toggle">
            <OurSvgIcon interactive color="gray" name="Angle-down" class="icon" />
          </div>

          <div v-else class="multiselect-caret">
            <OurSvgIcon
              interactive
              size="sm"
              color="gray"
              name="Close"
              @click="onClickRemoveValue"
            />
          </div>
        </template>
      </Multiselect>

      <div v-if="isShownAfterCaretSlot" class="after-caret-slot">
        <slot name="after-caret" />
      </div>
    </div>

    <div v-if="description && !error" class="description">
      {{ description }}
    </div>

    <p v-if="error && !value.length" class="error-message" data-cy="select-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import ApiService from "@ilevel/our.service.api";
import { getTheme, getRandomId } from "@ilevel/our.service.ui";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";

export default {
  name: "OurSelect",
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
      type: [String, Number],
      default: "",
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

    groupLabel: {
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
      default: false,
    },

    groupSelect: {
      type: Boolean,
      default: false,
    },

    groupValues: {
      type: String,
      default: "",
    },

    withInternalSearch: {
      type: Boolean,
      default: true,
    },

    optionsLimit: {
      type: Number,
      default: 300,
    },

    apiUrl: {
      type: String,
      default: "",
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
  },

  data: () => ({
    isLoading: false,
    asyncValue: "",
    asyncOptions: [],
    isOpen: false,
  }),

  computed: {
    theme() {
      return getTheme();
    },

    multiselectClass() {
      return {
        error: this.error && !this.value.length,
        "multiselect-wrapper-disabled": this.disabled,
        "group-select": this.groupValues,
        "after-caret": this.isShownAfterCaretSlot,
      };
    },

    isShownAfterCaretSlot() {
      return !!this.$slots["after-caret"];
    },

    isShownOptionSlot() {
      return !!this.$slots["option"];
    },

    labelClasses() {
      return {
        required: this.required,
        "label-color": this.isOpen,
        "error-label": this.error && !this.value.length,
      };
    },

    i18n() {
      return {
        listIsEmpty: this.$te("component.select.listIsEmpty")
          ? this.$t("component.select.listIsEmpty")
          : this.$t("listIsEmpty"),
        noDataToShow: this.$te("component.select.noDataToShow")
          ? this.$t("component.select.noDataToShow")
          : this.$t("noDataToShow"),
      };
    },

    selectOptions() {
      return this.withInternalSearch ? this.options : this.asyncOptions;
    },

    selectValue: {
      get() {
        if (this.groupValues) {
          const option = this.options.find((option) => {
            return option[this.groupValues].find((item) => item[this.trackBy] === this.value);
          });

          return option?.[this.groupValues].find((option) => option.id === this.value);
        }

        return this.options.find((option) => option[this.trackBy] === this.value);
      },
      set(newItem) {
        this.$emit("input", newItem?.[this.trackBy]);
      },
    },
  },

  watch: {
    options: {
      handler: "onChangeOptions",
      deep: true,
    },
  },

  methods: {
    onOpen() {
      this.$emit("open");
      this.isOpen = true;
    },

    onClickRemoveValue() {
      this.selectValue = "";
    },

    onChangeOptions() {
      const subOptions = document.querySelectorAll(".group-label");

      subOptions.forEach((subOption) => {
        const subOptionsParent = subOption.parentElement.parentElement;

        subOptionsParent.classList.add("multiselect__option");
        subOptionsParent.classList.add("multiselect__option--group");
        subOptionsParent.classList.add("multiselect__option--disabled");
      });
    },

    onClose() {
      this.isOpen = false;
    },

    onInput() {
      this.$emit("change");
    },

    leftMarginForSubCategory(level) {
      const baseMargin = 1;

      if (level > 1) {
        return `margin-left: ${baseMargin * (level - 1)}rem`;
      }
    },

    removeValue(itemToRemove) {
      this.$emit("remove", itemToRemove);

      if (this.withInternalSearch) return;

      this.asyncValue = null;
    },

    async findOptions(query) {
      if (this.withInternalSearch || !query) return;

      this.isLoading = true;

      const response = await ApiService.get(`${this.apiUrl}${query}`);

      this.asyncOptions = response.data.data;

      this.isLoading = false;
    },
  },
};
</script>

<i18n>
en:
  listIsEmpty: "List is empty."
  noDataToShow: "No data to show."
ru:
  listIsEmpty: "Список пуст."
  noDataToShow: "Нет данных."
ua:
  listIsEmpty: "Список порожній."
  noDataToShow: "Дані відсутні."
</i18n>

<style src="../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="postcss" scoped>
.multiselect-wrapper {
  @apply flex items-center;
  @apply rounded-lg border border-gray-300;
  @apply relative;

  &:hover {
    @apply border-gray-400;
    @apply transition duration-100 ease-in-out;
  }

  &:focus-within {
    @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
  }

  .multiselect {
    &-caret {
      @apply -mt-1.5 mr-4;
      @apply cursor-pointer;
    }

    &--active {
      @apply z-[inherit];

      .icon {
        @apply rotate-180 transform transition-all duration-300;
      }
    }

    &::v-deep {
      @apply flex flex-row-reverse justify-between;
      @apply static min-h-full overflow-hidden;
      @apply pt-6;

      .multiselect {
        &__tags {
          @apply rounded-none border-0 bg-transparent;
          @apply mb-px pt-1 pb-2 pl-4 pr-4;
          @apply min-h-full w-full;
        }

        &__input {
          @apply text-base font-medium text-base-dark;
          @apply mb-px p-0;
          @apply min-h-full;

          &:focus {
            @apply shadow-none outline-none ring-0;
          }

          &::placeholder {
            @apply text-base font-medium text-gray-400;
          }
        }

        &__placeholder {
          @apply whitespace-nowrap text-base font-medium text-gray-400;
          @apply mb-0 w-0 pt-0;
        }

        &__content-wrapper {
          @apply mt-10 rounded-lg shadow;
          @apply right-0;
        }

        &__content {
          .multiselect__element:first-child {
            .multiselect__option--group {
              @apply pt-4 !important;
            }
          }
        }

        &__option {
          @apply text-base font-normal text-base-dark;
          @apply min-h-full;
          @apply p-3;

          &:hover {
            @apply bg-gray-100;
          }

          &:active,
          &--selected {
            @apply !bg-gray-200 font-medium;
          }

          &:disabled {
            @apply text-gray-500;
          }

          &--highlight {
            @apply bg-transparent;
          }
        }

        &__single {
          @apply font-medium text-base-dark;
          @apply mb-0 p-0;
        }
      }
    }
  }
}

.multiselect-wrapper-disabled {
  @apply border-gray-100 bg-gray-100;

  &:hover {
    @apply border-gray-100 !important;
  }

  &:focus-within {
    @apply border-gray-100 ring-0 !important;
  }

  &::v-deep {
    .multiselect--disabled {
      @apply rounded-lg bg-transparent;
      @apply opacity-100;

      .multiselect__single {
        @apply bg-gray-100;
      }
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

.required {
  &:after {
    content: "*";
    @apply absolute -right-1 font-bold text-red-600;
  }
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

.description {
  @apply text-xs font-normal text-gray-450;
  @apply pl-4 pt-2;
}

.group-select::v-deep {
  .multiselect__option--group {
    @apply bg-transparent !important;
    @apply text-xs font-medium uppercase text-gray-450 !important;
    @apply pb-2 pt-6 !important;
  }
}

.group-label {
  @apply text-xs font-medium uppercase text-gray-450 !important;
}

.after-caret {
  @apply flex-col items-start md:flex-row md:items-center;

  .after-caret-slot {
    @apply pb-2.5 pl-4 pr-4 md:pb-0 md:pl-0;
  }
}
</style>
