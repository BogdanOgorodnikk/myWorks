<template>
  <div class="form-group" :class="[maxWidthClass, datepickerWrapperClasses]">
    <div class="input-block">
      <t-datepicker
        :id="id"
        ref="datepicker"
        v-model="selectedDate"
        :user-format="customDateFormat || defaultDateFormat"
        :week-start="1"
        :locale="activeLanguage"
        :placeholder="placeholder"
        :disabled="disabled"
        class="datepicker"
        :clearable="false"
        :classes="datepickerClasses"
      >
        <template #day="{ isSelected, dayFormatted }">
          <span v-if="isSelected" @click.prevent.stop="onClickClearDate">
            {{ dayFormatted }}
          </span>

          <span v-else>{{ dayFormatted }}</span>
        </template>
      </t-datepicker>
      <label :for="id">
        <slot name="icon" />
      </label>

      <label v-if="isShownRightSlot" :for="id" class="right-slot-label">
        <slot name="right" />
      </label>
    </div>

    <label class="label" :class="labelClass" :for="id">
      {{ label }}
    </label>

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>

    <p v-if="description && !error" class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { fromUnixTime, getUnixTime } from "date-fns";
import DateService from "@ilevel/our.service.date";
import { getRandomId, getTheme } from "@ilevel/our.service.ui";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import i18nServiceDefault from "@ilevel/our.service.i18n";
import English from "vue-tailwind/dist/l10n/default";
import Russian from "vue-tailwind/dist/l10n/ru";
import Ukrainian from "vue-tailwind/dist/l10n/uk";
import TDatepicker from "vue-tailwind/dist/t-datepicker";

export default {
  name: "OurDatepicker",

  components: {
    OurSvgIcon,
    TDatepicker,
  },

  props: {
    label: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    value: {
      type: Number,
      default: 0,
    },

    required: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      default: () => getRandomId(),
    },

    maxWidth: {
      type: String,
      default: "full",
    },

    description: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "md",
    },

    customDateFormat: {
      type: String,
      default: "",
    },
  },

  computed: {
    selectedDate: {
      get() {
        if (!this.value) return;

        return fromUnixTime(this.value);
      },
      set(value) {
        const timestamp = value ? getUnixTime(new Date(value)) : null;

        this.$emit("input", timestamp);
      },
    },

    datepickerWrapperClasses() {
      return {
        "right-slot": this.isShownRightSlot,
        "size-md": this.size === "md",
        "size-lg": this.size === "lg",
      };
    },

    isShownRightSlot() {
      return !!this.$slots["right"];
    },

    activeLanguage() {
      const language = {
        en: English,
        ru: Russian,
        ua: Ukrainian,
      };

      if (i18nServiceDefault.getActiveLanguage() === "en") {
        return language.en;
      } else if (i18nServiceDefault.getActiveLanguage() === "ru") {
        return language.ru;
      } else {
        return language.ua;
      }
    },

    inputClass() {
      const theme = getTheme();
      const classes = {
        disabled: this.disabled ? "disabled" : "",
        error: this.error ? "error-input" : "",
      };

      return `${theme} ${classes.error} ${classes.disabled}}`;
    },

    labelClass() {
      return {
        required: this.required,
        "error-label": this.error,
        "label-md": this.size === "md",
        "label-lg": this.size === "lg",
      };
    },

    maxWidthClass() {
      return {
        "max-w-xs": this.maxWidth === "xs",
        "max-w-sm": this.maxWidth === "sm",
        "max-w-md": this.maxWidth === "md",
        "max-w-lg": this.maxWidth === "lg",
        "max-w-xl": this.maxWidth === "xl",
        "max-w-full": this.maxWidth === "full",
      };
    },

    datepickerClasses() {
      return {
        wrapper: "flex flex-col",
        dropdownWrapper: "relative z-50",
        dropdown:
          "origin-top-left absolute rounded-lg shadow bg-white overflow-hidden mt-2 pl-1 pr-1 pb-4",
        enterClass: "opacity-0 scale-95",
        enterActiveClass: "transition transform ease-out duration-100",
        enterToClass: "opacity-100 scale-100",
        leaveClass: "opacity-100 scale-100",
        leaveActiveClass: "transition transform ease-in duration-75",
        leaveToClass: "opacity-0 scale-95",
        inlineWrapper: "",
        inlineViews: "rounded bg-white border mt-1 inline-flex",
        inputWrapper: "",
        input: `input w-full ${this.inputClass}`,
        navigator: "pt-2 px-3 items-center",
        navigatorViewButton: `transition ease-in-out duration-100 inline-flex cursor-pointer rounded-full pr-1 pl-3
          py-1 -ml-1 hover:bg-gray-100`,
        navigatorViewButtonIcon: "fill-current text-gray-400",
        navigatorViewButtonBackIcon: "fill-current text-gray-400",
        navigatorViewButtonMonth: "text-gray-700 font-semibold",
        navigatorViewButtonYear: "text-gray-500 ml-1",
        navigatorViewButtonYearRange: "text-gray-500 ml-1",
        navigatorLabel: "py-1",
        navigatorLabelMonth: "text-gray-700 font-semibold",
        navigatorLabelYear: "text-gray-500 ml-1",
        navigatorPrevButton: `transition ease-in-out duration-100 inline-flex cursor-pointer
          hover:bg-gray-100 rounded-full p-1 ml-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorNextButton: `transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-100
          rounded-full p-1 -mr-1 disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorPrevButtonIcon: "text-gray-400 navigation-btn-icon",
        navigatorNextButtonIcon: "text-gray-400 navigation-btn-icon",
        calendarWrapper: "px-3 pt-2",
        calendarHeaderWrapper: "",
        calendarHeaderWeekDay:
          "uppercase text-xs text-gray-500 w-8 h-8 flex items-center justify-center",
        calendarDaysWrapper: "",
        calendarDaysDayWrapper: "w-full h-8 flex shrink-0 items-center calendar-day-button",
        otherMonthDay: `text-sm rounded-lg w-8 h-8 mx-auto hover:bg-gray-100 text-gray-400 disabled:opacity-50
          disabled:cursor-not-allowed`,
        emptyDay: "",
        inRangeFirstDay: "text-sm bg-base-dark text-white w-full h-8 rounded-l-full",
        inRangeLastDay: "text-sm bg-base-dark text-white w-full h-8 rounded-r-full",
        inRangeDay:
          "text-sm bg-gray-200 w-full h-8 disabled:opacity-50 disabled:cursor-not-allowed",
        selectedDay:
          "text-sm rounded-lg w-8 h-8 mx-auto bg-base-dark text-white disabled:opacity-50 disabled:cursor-not-allowed",
        activeDay:
          "text-sm rounded-lg bg-gray-100 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        highlightedDay:
          "text-sm rounded-lg bg-gray-200 w-8 h-8 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        day: "text-sm rounded-lg w-8 h-8 mx-auto hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
        today: `text-sm rounded-lg w-8 h-8 mx-auto hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
          border-2 border-base-dark`,
        monthWrapper: "px-3 pt-2",
        selectedMonth: "text-sm rounded-lg w-full h-12 mx-auto bg-base-dark text-white",
        activeMonth: "text-sm rounded-lg w-full h-12 mx-auto bg-gray-200",
        month: "text-sm rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        yearWrapper: "px-3 pt-2",
        year: "text-sm rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        selectedYear: "text-sm rounded-lg w-full h-12 mx-auto bg-base-dark text-white",
        activeYear: "text-sm rounded-lg w-full h-12 mx-auto bg-gray-200",
      };
    },

    i18n() {
      return {
        yesterday: this.$te("component.datePicker.yesterday")
          ? this.$t("component.datePicker.yesterday")
          : this.$t("yesterday"),
        today: this.$te("component.datePicker.today")
          ? this.$t("component.datePicker.today")
          : this.$t("today"),
        tomorrow: this.$te("component.datePicker.tomorrow")
          ? this.$t("component.datePicker.tomorrow")
          : this.$t("tomorrow"),
      };
    },

    defaultDateFormat() {
      if (!this.value) {
        return;
      }

      const SPACE_BETWEEN_LETTER_REG_EXP = /./g;

      let date = new DateService().formatDate(this.selectedDate, { i18n: this.i18n }).toLowerCase();

      const separatedDate = date.match(SPACE_BETWEEN_LETTER_REG_EXP).join("\\");

      return "\\" + separatedDate.charAt(0).toUpperCase() + separatedDate.slice(1);
    },
  },

  methods: {
    onClickClearDate() {
      this.selectedDate = null;

      this.$refs.datepicker.$refs.dropdown.localShow = false;
    },
  },
};
</script>

<i18n>
en:
  yesterday: Yesterday
  today: Today
  tomorrow: Tomorrow
ru:
  yesterday: Вчера
  today: Сегодня
  tomorrow: Завтра
ua:
  yesterday: Вчора
  today: Сьогодні
  tomorrow: Завтра
</i18n>

<style lang="postcss" scoped>
.form-group {
  @apply relative;

  .description {
    @apply text-xs font-normal text-gray-450;
    @apply pl-4 pt-2;
  }
}

.input-block::v-deep {
  @apply relative;

  &:focus-within {
    .input {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    .error-input {
      @apply border-red-500 ring-red-100 !important;
    }
  }

  .navigation-btn-icon {
    @apply h-4 !important;
  }

  .right-slot-label {
    @apply absolute left-4 md:top-4 md:right-4 md:left-auto !important;
    @apply pt-0.5;
  }

  .input {
    @apply font-medium text-base-dark;
    @apply rounded-lg border border-solid border-gray-300 bg-white shadow-none;
    @apply pl-4 pr-4 md:pr-11;

    &:hover {
      @apply border-gray-400;
    }

    &:focus {
      @apply border-gray-500 ring-4 ring-gray-600 ring-opacity-15;
    }

    &::placeholder {
      @apply font-medium text-gray-400;
    }

    &:disabled {
      @apply text-gray-500;
      @apply border-gray-100 bg-gray-100;
    }
  }

  .error-input {
    @apply border-red-300 !important;

    &:hover {
      @apply border-red-400 !important;
    }

    &:focus {
      @apply border-red-500 ring-red-100 !important;
    }
  }
}

.label {
  @apply absolute font-normal text-gray-500;

  &-md {
    @apply text-sm;
    @apply left-4 top-2.5;
  }

  &-lg {
    @apply text-base;
    @apply left-4 top-3;
  }
}

.required {
  &:after {
    content: "*";
    @apply absolute pl-0.5 font-medium text-red-600;
  }
}

.error {
  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }

  &-label {
    @apply text-red-500;
  }
}

.size {
  &-md {
    .right-slot-label {
      @apply top-14;
    }

    &::v-deep {
      &.right-slot {
        .input {
          @apply md:pb-2.5 !important;
        }
      }

      .input {
        @apply text-base;
        @apply pt-7 pb-2.5;

        &::placeholder {
          @apply text-base;
        }
      }
    }
  }

  &-lg {
    .right-slot-label {
      @apply top-[3.875rem];
    }

    &::v-deep {
      &.right-slot {
        .input {
          @apply md:pb-3 !important;
        }
      }

      .input {
        @apply text-lg;
        @apply pt-8 pb-3;

        &::placeholder {
          @apply text-lg;
        }
      }
    }
  }
}

.right-slot {
  &::v-deep {
    .input {
      @apply pb-11;
    }
  }
}
</style>
