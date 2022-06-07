<template>
  <div class="date">
    <VariantButton
      v-if="datePickerVariant.button"
      :id="id"
      :title="title"
      @clickShiftRange="onClickShiftRange"
      @clickRangeSet="onClickRangeSet"
      @blur="onBlur"
    />

    <VariantInput
      v-if="datePickerVariant.input"
      :id="id"
      :title="title"
      :label="label"
      @clickRangeSet="onClickRangeSet"
      @blur="onBlur"
    >
      <template #right>
        <!-- @slot Use it to add something right. -->
        <slot name="right" />
      </template>
    </VariantInput>

    <div v-if="isOpenedMenu" class="date-menu" @mousedown="onMouseDownDateMenu">
      <div class="date-menu-wrapper">
        <div
          v-for="(datePeriod, index) in datePeriods"
          :key="index"
          class="date-menu-button"
          :class="setActiveButton(datePeriod.name)"
          @mousedown="onClickChangePeriodType(datePeriod.name)"
        >
          {{ datePeriod.title }}
        </div>
      </div>

      <div class="date-menu-wrapper">
        <div
          class="date-menu-button"
          :class="setActiveButton('lastThirtyDays')"
          @mousedown="onClickSelectLastThirtyDays"
          v-html="i18n.lastThirtyDays"
        />

        <div
          class="date-menu-button"
          :class="setActiveButton('ownPeriod')"
          @mousedown.prevent="onClickChangePeriodType('ownPeriod')"
        >
          <OurSvgIcon name="Layout-grid" size="xs" />

          {{ i18n.ownRange }}
        </div>
      </div>

      <div v-if="isShownDateMenu">
        <div v-if="isShownOwnRange">
          <div class="date-menu-datepicker-wrapper">
            <OurInput
              v-model="ownRangeStart"
              :error="ownRangeStartError"
              class="date-menu-input"
              @change="onChangeOwnRangeInput"
              @mousedown="onMouseDownInput"
              @blur="onBlurInput"
              @click="onClickInput"
            />

            <OurInput
              v-model="ownRangeEnd"
              :error="ownRangeEndError"
              class="date-menu-input"
              @change="onChangeOwnRangeInput"
              @mousedown="onMouseDownInput"
              @blur="onBlurInput"
              @click="onClickInput"
            />
          </div>

          <t-datepicker
            ref="datepickerRange"
            v-model="ownRange"
            date-format="d.m.Y"
            :week-start="1"
            :clearable="false"
            :close-on-select="false"
            show
            range
            class="own-range"
            :classes="ownRangeClasses"
            :locale="activeDatepickerLanguage"
          >
            <template
              #day="{ dayFormatted, isInRange, isFirstDayOfRange, isLastDayOfRange, isToday }"
            >
              <span v-if="isToday" class="own-today"> {{ dayFormatted }}</span>

              <span v-else-if="isInRange" class="own-range-day">{{ dayFormatted }}</span>

              <div v-else-if="isFirstDayOfRange" class="first-own-range-day-block">
                <span class="first-own-range-day">{{ dayFormatted }}</span>
              </div>

              <div v-else-if="isLastDayOfRange" class="last-own-range-day-block">
                <span class="last-own-range-day">{{ dayFormatted }}</span>
              </div>

              <span v-else>{{ dayFormatted }}</span>
            </template>
          </t-datepicker>
        </div>

        <div v-else>
          <div class="date-menu-range">
            <OurSvgIcon
              class="icon"
              size="sm"
              name="Angle-left"
              @mousedown.native.prevent="onClickShiftDatesList('prev')"
            />

            <div class="date-menu-range-value">
              <span v-if="shownMenuRangeMonth">{{ selectedDate.monthName }} </span>

              <span v-if="yearPeriodTitle">{{ yearPeriodTitle }}</span>

              <span v-else>{{ selectedDate.year }}</span>
            </div>

            <OurSvgIcon
              class="icon"
              size="sm"
              name="Angle-right"
              @mousedown.native.prevent="onClickShiftDatesList('next')"
            />
          </div>

          <div class="date-menu-list" :class="menuTypeClass">
            <div
              v-for="(date, index) in datesList"
              :key="index"
              class="date-menu-list-item"
              :class="setActiveSelectedDate(date)"
              @mousedown="onClickSelectValue(index)"
            >
              {{ date.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fromUnixTime,
  startOfWeek,
  endOfWeek,
  getMonth,
  getYear,
  getDate,
  getUnixTime,
  addMonths,
  addYears,
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  parse,
  differenceInDays,
} from "date-fns";
import English from "vue-tailwind/dist/l10n/default";
import Russian from "vue-tailwind/dist/l10n/ru";
import Ukrainian from "vue-tailwind/dist/l10n/uk";
import I18nServiceDefault from "@ilevel/our.service.i18n";
import DateServiceDefault from "@ilevel/our.service.date";
import ValidationServiceDefault from "@ilevel/our.service.validation";
import {
  createYears,
  createQuarters,
  createMonthsList,
  createWeeksList,
  prepareOwnRangeDate,
} from "./service/dateRange.service";
import { getRandomId } from "@ilevel/our.service.ui";

import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurInput from "@ilevel/our.ui.input";
import TDatepicker from "vue-tailwind/dist/t-datepicker";
import VariantButton from "./components/VariantButton";
import VariantInput from "./components/VariantInput";

const { dateFormat, wrongDayNumber, wrongMonthNumber } = new ValidationServiceDefault();

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const DATE_PICKER_BUTTON_TYPE = "button";
const DATE_PICKER_INPUT_TYPE = "input";
const GRID_MENU_CLASS = "grid-menu";
const BLOCK_MENU_CLASS = "block-menu";

const WEEK_PERIOD = "week";
const MONTH_PERIOD = "month";
const QUARTER_PERIOD = "quarter";
const YEAR_PERIOD = "year";
const LAST_THIRTY_DAYS_PERIOD = "lastThirtyDays";
const OWN_PERIOD = "ownPeriod";

export default {
  name: "OurDateRangePicker",

  components: {
    VariantInput,
    VariantButton,
    OurInput,
    OurSvgIcon,
    TDatepicker,
  },

  props: {
    /**
     * The variant of the date picker.
     * @values button, input
     */
    variant: {
      type: String,
      default: "button",
    },

    /**
     * Set date picker value (timestamp).
     */
    value: {
      type: Object,
      default: () => {},
    },

    /**
     * Set label text.
     */
    label: {
      type: String,
      default: "",
    },

    /**
     * Generates unique element id.
     * @ignore
     */
    id: {
      type: String,
      default: () => getRandomId(),
    },
  },

  data() {
    return {
      menuTypeClass: BLOCK_MENU_CLASS,
      period: WEEK_PERIOD,
      currentTimestamp: 0,
      datesList: [],
      dateRange: {
        from: 0,
        to: 0,
      },
      ownRange: [],
      ownRangeStart: "",
      ownRangeEnd: "",
      isOpenedMenu: false,
      isShownDateMenu: true,
      isShownOwnRange: false,
      isClickedInDateMenu: false,
      isFocusedInput: false,
    };
  },

  validations: {
    ownRangeStart: { dateFormat, wrongMonthNumber, wrongDayNumber },
    ownRangeEnd: { dateFormat, wrongMonthNumber, wrongDayNumber },
  },

  computed: {
    datePickerVariant() {
      return {
        button: this.variant === DATE_PICKER_BUTTON_TYPE,
        input: this.variant === DATE_PICKER_INPUT_TYPE,
      };
    },

    datePeriods() {
      return [
        {
          name: WEEK_PERIOD,
          title: this.i18n.week,
        },
        {
          name: MONTH_PERIOD,
          title: this.i18n.month,
        },
        {
          name: QUARTER_PERIOD,
          title: this.i18n.quarter,
        },
        {
          name: YEAR_PERIOD,
          title: this.i18n.year,
        },
      ];
    },

    ownRangeStartError() {
      const isDirty = this.$v.ownRangeStart.$dirty;
      const isCorrectDateFormat = this.$v.ownRangeStart.dateFormat;
      const isCorrectMonthNumber = this.$v.ownRangeStart.wrongMonthNumber;
      const isCorrectDayNumber = this.$v.ownRangeStart.wrongDayNumber;

      let error = "";

      if (isDirty && !isCorrectDateFormat && this.ownRangeStart) {
        error = this.i18n.dateFormatWithDot;
      } else if (isDirty && !isCorrectMonthNumber && this.ownRangeStart) {
        error = this.i18n.notCorrectMonthNumber;
      } else if (isDirty && !isCorrectDayNumber && this.ownRangeStart) {
        error = this.i18n.notCorrectDayNumber;
      }

      return error;
    },

    ownRangeEndError() {
      const isDirty = this.$v.ownRangeEnd.$dirty;
      const isCorrectDateFormat = this.$v.ownRangeEnd.dateFormat;
      const isCorrectMonthNumber = this.$v.ownRangeEnd.wrongMonthNumber;
      const isCorrectDayNumber = this.$v.ownRangeEnd.wrongDayNumber;

      let error = "";

      if (isDirty && !isCorrectDateFormat && this.ownRangeEnd) {
        error = this.i18n.dateFormatWithDot;
      } else if (isDirty && !isCorrectMonthNumber && this.ownRangeEnd) {
        error = this.i18n.notCorrectMonthNumber;
      } else if (isDirty && !isCorrectDayNumber && this.ownRangeEnd) {
        error = this.i18n.notCorrectDayNumber;
      }

      return error;
    },

    ownRangeClasses() {
      return {
        wrapper: "flex flex-col",
        dropdownWrapper: "relative z-50",
        dropdown: "overflow-hidden bg-white",
        enterClass: "opacity-0 scale-95",
        enterActiveClass: "transition transform ease-out duration-100",
        enterToClass: "opacity-100 scale-100",
        leaveClass: "opacity-100 scale-100",
        leaveActiveClass: "transition transform ease-in duration-75",
        leaveToClass: "opacity-0 scale-95",
        inlineWrapper: "",
        inlineViews: "rounded bg-white border mt-1 inline-flex",
        inputWrapper: "hidden",
        viewGroup: "inline-flex flex-wrap w-full",
        view: "!w-full",
        input: `input w-full`,
        navigator: "px-2.5 items-center justify-between",
        navigatorViewButton: `navigator-button order-1 w-full justify-center cursor-pointer text-sm
          font-medium text-base-dark`,
        navigatorViewButtonIcon: "hidden",
        navigatorViewButtonBackIcon: "hidden",
        navigatorViewButtonMonth: "text-gray-700 font-semibold",
        navigatorViewButtonYear: "ml-1",
        navigatorViewButtonYearRange: "ml-1",
        navigatorLabel: "py-1",
        navigatorLabelMonth: "text-gray-700 font-semibold",
        navigatorLabelYear: "text-gray-500 ml-1",
        navigatorPrevButton: `order-0 transition ease-in-out duration-100 inline-flex cursor-pointer
          rounded-full disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorNextButton: `order-2 transition ease-in-out duration-100 inline-flex
          cursor-pointer rounded-full disabled:opacity-50 disabled:cursor-not-allowed`,
        navigatorPrevButtonIcon: "text-base-dark !w-4 !h-4 navigation-btn-icon",
        navigatorNextButtonIcon: "text-base-dark !w-4 !h-4 navigation-btn-icon",
        calendarWrapper: "mt-2.5",
        calendarHeaderWrapper: "",
        calendarHeaderWeekDay:
          "uppercase text-sm text-gray-500 h-10 flex items-center justify-center",
        calendarDaysWrapper: "",
        calendarDaysDayWrapper:
          "w-full mb-0.5 h-10 flex flex-shrink-0 items-center calendar-day-button",
        otherMonthDay: `text-sm font-medium w-full h-10 mx-auto hover:bg-gray-100 text-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed`,
        emptyDay: "",
        inRangeFirstDay: "text-sm font-medium text-base-dark w-full h-10",
        inRangeLastDay:
          "text-sm font-medium bg-base-dark bg-opacity-10 text-base-dark w-full h-10 rounded-r-lg hover:bg-gray-100",
        inRangeDay: `text-sm font-medium text-base-dark w-full h-10 hover:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed`,
        selectedDay: `text-sm rounded-lg w-full h-10 mx-auto bg-base-dark text-white disabled:opacity-50
           disabled:cursor-not-allowed`,
        activeDay:
          "text-sm rounded-lg bg-gray-100 w-full h-10 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        highlightedDay:
          "text-sm rounded-lg bg-gray-200 w-full h-10 mx-auto disabled:opacity-50 disabled:cursor-not-allowed",
        day: `text-sm font-medium text-base-dark w-full h-10 mx-auto hover:bg-gray-100 disabled:opacity-50
          disabled:cursor-not-allowed`,
        today: `text-sm font-medium text-base-dark rounded-lg w-full h-10 mx-auto hover:bg-gray-100 disabled:opacity-50
          disabled:cursor-not-allowed border-base-dark`,
        monthWrapper: "px-3 pt-2",
        selectedMonth:
          "text-sm font-medium rounded-lg w-full h-12 mx-auto bg-base-dark bg-opacity-10 text-base-dark",
        activeMonth: "text-sm font-medium rounded-lg w-full h-12 mx-auto bg-gray-200",
        month: "text-sm font-medium rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        yearWrapper: "px-3 pt-2",
        year: "text-sm font-medium rounded-lg w-full h-12 mx-auto hover:bg-gray-100",
        selectedYear: "text-sm font-medium rounded-lg w-full h-12 mx-auto bg-base-dark text-white",
        activeYear: "text-sm font-medium rounded-lg w-full h-12 mx-auto bg-gray-200",
      };
    },

    i18n() {
      return {
        lastThirtyDays: this.$te("component.dateRange.lastThirtyDays")
          ? this.$t("component.dateRange.lastThirtyDays")
          : this.$t("lastThirtyDays"),
        ownRange: this.$te("component.dateRange.ownRange")
          ? this.$t("component.dateRange.ownRange")
          : this.$t("ownRange"),
        week: this.$te("component.dateRange.week")
          ? this.$t("component.dateRange.week")
          : this.$t("week"),
        month: this.$te("component.dateRange.month")
          ? this.$t("component.dateRange.month")
          : this.$t("month"),
        quarter: this.$te("component.dateRange.quarter")
          ? this.$t("component.dateRange.quarter")
          : this.$t("quarter"),
        year: this.$te("component.dateRange.year")
          ? this.$t("component.dateRange.year")
          : this.$t("year"),
        dateFormatWithDot: this.$te("component.dateRange.dateFormatWithDot")
          ? this.$t("component.dateRange.dateFormatWithDot")
          : this.$t("dateFormatWithDot"),
        notCorrectMonthNumber: this.$te("component.dateRange.notCorrectMonthNumber")
          ? this.$t("component.dateRange.notCorrectMonthNumber")
          : this.$t("notCorrectMonthNumber"),
        notCorrectDayNumber: this.$te("component.dateRange.notCorrectDayNumber")
          ? this.$t("component.dateRange.notCorrectDayNumber")
          : this.$t("notCorrectDayNumber"),
        monthShort: this.$te("component.dateRange.monthShort")
          ? this.$t("component.dateRange.monthShort")
          : this.$t("monthShort"),
        declinedMonth: this.$te("component.dateRange.declinedMonth")
          ? this.$t("component.dateRange.declinedMonth")
          : this.$t("declinedMonth"),
        monthList: this.$te("component.dateRange.monthList")
          ? this.$t("component.dateRange.monthList")
          : this.$t("monthList"),
      };
    },

    activeDatepickerLanguage() {
      const language = {
        en: English,
        ru: Russian,
        ua: Ukrainian,
      };

      const activeLanguage = I18nServiceDefault.getActiveLanguage();

      return language[activeLanguage];
    },

    getDefaultValue() {
      return Object.keys(this.value).length !== 2;
    },

    shownMenuRangeMonth() {
      return this.period === WEEK_PERIOD;
    },

    monthsShortLocales() {
      return MONTHS.map((month) => this.i18n.monthShort[month]);
    },

    declinedMonthsFullLocales() {
      return MONTHS.map((month) => this.i18n.declinedMonth[month]);
    },

    monthsFullLocales() {
      return MONTHS.map((month) => this.i18n.monthList[month]);
    },

    yearPeriodTitle() {
      let title = "";

      if (this.period === YEAR_PERIOD) {
        const startRange = this.datesList[0].startRange;
        const endRange = this.datesList[this.datesList.length - 1].endRange;

        const startYear = getYear(fromUnixTime(startRange));
        const endYear = getYear(fromUnixTime(endRange));

        title = `${startYear} – ${endYear}`;
      }

      return title;
    },

    selectedDate() {
      return this.getDateFromTimeStamp(this.currentTimestamp, this.monthsFullLocales);
    },

    title() {
      const startRange = this.getDateFromTimeStamp(
        this.dateRange.from,
        this.declinedMonthsFullLocales
      );
      const endRange = this.getDateFromTimeStamp(this.dateRange.to, this.declinedMonthsFullLocales);

      let title = "";

      const isDefaultTitle =
        this.period === WEEK_PERIOD ||
        this.period === LAST_THIRTY_DAYS_PERIOD ||
        this.period === OWN_PERIOD;

      if (isDefaultTitle) {
        let startMonthName = startRange.monthName;
        let startYear = startRange.year;

        if (startRange.month === endRange.month) {
          startMonthName = "";
        }

        if (startRange.year === endRange.year) {
          startYear = "";
        }

        title = `${startRange.day} ${startMonthName} ${startYear} –
                 ${endRange.day || ""} ${endRange.monthName || ""} ${endRange.year || ""}
        `;
      }

      if (this.period === MONTH_PERIOD) {
        const startRange = this.getDateFromTimeStamp(this.dateRange.from, this.monthsFullLocales);

        title = `${startRange.monthName} ${startRange.year}
        `;
      }

      if (this.period === QUARTER_PERIOD || this.period === YEAR_PERIOD) {
        title = `${startRange.day} ${startRange.monthName} – ${endRange.day} ${endRange.monthName} ${endRange.year}`;
      }

      return title;
    },
  },

  watch: {
    ownRange: "onChangeOwnRange",
    dateRange: {
      handler: "onChangeDateRange",
      immediate: true,
    },
    value: {
      handler: "onChangeValue",
      immediate: true,
    },
  },

  created() {
    this.currentTimestamp = getUnixTime(new Date());

    this.datesList = createWeeksList(this.selectedDate, this.monthsShortLocales);

    this.setDefaultRange();
  },

  updated() {
    const navigatorButton = document.querySelector(".navigator-button");

    if (this.period === OWN_PERIOD && navigatorButton) {
      navigatorButton.onclick = () => {
        document.querySelector(`#${this.id}`).focus();
      };
    }
  },

  methods: {
    onBlur() {
      if (this.period !== OWN_PERIOD) {
        this.isOpenedMenu = false;
      } else {
        this.isOpenedMenu = this.isClickedInDateMenu;
        this.isClickedInDateMenu = false;

        if (this.isOpenedMenu && !this.isFocusedInput) {
          document.querySelector(`#${this.id}`).focus();
        }
      }
    },

    onMouseDownDateMenu() {
      this.isClickedInDateMenu = true;
    },

    onMouseDownInput() {
      this.isFocusedInput = true;
    },

    onClickInput(event) {
      this.isClickedInDateMenu = true;
      this.isFocusedInput = true;
      event.srcElement.focus();
      this.isClickedInDateMenu = false;
    },

    onBlurInput() {
      this.isFocusedInput = false;
      this.isOpenedMenu = this.isClickedInDateMenu;
      this.isClickedInDateMenu = false;

      document.querySelector(`#${this.id}`).focus();
    },

    setActiveButton(buttonPeriod) {
      return buttonPeriod === this.period ? "date-menu-button-active" : "";
    },

    setActiveSelectedDate(date) {
      return this.dateRange.from === date.startRange && this.dateRange.to === date.endRange
        ? "date-menu-list-item-active"
        : "";
    },

    onChangeDateRange() {
      this.$emit("input", this.dateRange);
    },

    onChangeValue() {
      this.dateRange = this.value;
    },

    onChangeOwnRange() {
      let [ownRangeStart, ownRangeEnd] = this.ownRange;

      if (ownRangeStart) {
        const startRangeDate = parse(ownRangeStart, "dd.MM.yyyy", new Date());

        this.ownRangeStart = ownRangeStart;
        this.ownRangeEnd = "";

        this.dateRange.from = getUnixTime(startOfDay(startRangeDate));
      }

      if (ownRangeEnd) {
        const startRangeDate = parse(ownRangeStart, "dd.MM.yyyy", new Date());
        const endRangeDate = parse(ownRangeEnd, "dd.MM.yyyy", new Date());

        if (endRangeDate < startRangeDate) {
          this.ownRangeEnd = ownRangeStart;
          this.dateRange.to = getUnixTime(endOfDay(startRangeDate));
        } else {
          this.ownRangeEnd = ownRangeEnd;
          this.dateRange.to = getUnixTime(endOfDay(endRangeDate));
        }
      }
    },

    getDateFromTimeStamp(timestamp, monthList) {
      const date = fromUnixTime(timestamp);
      const day = getDate(date);
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
      const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
      const month = getMonth(date);
      const monthName = monthList[month];
      const year = getYear(date);

      return {
        date,
        day,
        startOfWeekDate,
        endOfWeekDate,
        month,
        monthName,
        year,
      };
    },

    setDefaultRange() {
      if (this.getDefaultValue) {
        this.selectLastThirtyDays();
      }
    },

    onClickShiftDatesList(action) {
      const defaultRange = action === "prev" ? -1 : 1;
      const yearRange = action === "prev" ? -12 : 12;

      if (this.period === WEEK_PERIOD) {
        this.currentTimestamp = getUnixTime(addMonths(this.selectedDate.date, defaultRange));

        this.datesList = createWeeksList(this.selectedDate, this.monthsShortLocales);
      }

      if (this.period === MONTH_PERIOD) {
        this.currentTimestamp = getUnixTime(addYears(this.selectedDate.date, defaultRange));

        this.datesList = createMonthsList(this.selectedDate, this.monthsFullLocales);
      }

      if (this.period === QUARTER_PERIOD) {
        this.currentTimestamp = getUnixTime(addYears(this.selectedDate.date, defaultRange));

        this.datesList = createQuarters(this.selectedDate, { i18n: this.i18n });
      }

      if (this.period === YEAR_PERIOD) {
        this.currentTimestamp = getUnixTime(addYears(this.selectedDate.date, yearRange));

        this.datesList = createYears(this.selectedDate);
      }
    },

    changePeriodType(period) {
      this.currentTimestamp = getUnixTime(new Date());

      if (period === WEEK_PERIOD) {
        this.datesList = createWeeksList(this.selectedDate, this.monthsShortLocales);

        this.menuTypeClass = BLOCK_MENU_CLASS;
      }

      if (period === MONTH_PERIOD) {
        this.datesList = createMonthsList(this.selectedDate, this.monthsFullLocales);

        this.menuTypeClass = GRID_MENU_CLASS;
      }

      if (period === QUARTER_PERIOD) {
        this.datesList = createQuarters(this.selectedDate, { i18n: this.i18n });

        this.menuTypeClass = BLOCK_MENU_CLASS;
      }

      if (period === YEAR_PERIOD) {
        this.datesList = createYears(this.selectedDate);

        this.menuTypeClass = GRID_MENU_CLASS;
      }

      if (period === OWN_PERIOD) {
        const startRange = this.getDateFromTimeStamp(
          this.dateRange.from,
          this.declinedMonthsFullLocales
        );
        const endRange = this.getDateFromTimeStamp(
          this.dateRange.to,
          this.declinedMonthsFullLocales
        );

        this.ownRangeStart = prepareOwnRangeDate(startRange);
        this.ownRangeEnd = prepareOwnRangeDate(endRange);
        this.ownRange = [this.ownRangeStart, this.ownRangeEnd];
      } else {
        const currentDate = this.datesList.find(
          (item) =>
            item.startRange <= this.currentTimestamp && item.endRange >= this.currentTimestamp
        );

        this.selectValue(currentDate.index);
      }

      this.period = period;
      this.isShownOwnRange = period === OWN_PERIOD;
      this.isShownDateMenu = true;
    },

    onClickChangePeriodType(period) {
      this.changePeriodType(period);
    },

    selectValue(index) {
      const selectedItem = this.datesList[index];

      this.dateRange = {
        from: selectedItem.startRange,
        to: selectedItem.endRange,
      };

      if (this.period !== WEEK_PERIOD) {
        this.currentTimestamp = this.dateRange.from;
      }

      this.isOpenedMenu = false;
    },

    onClickSelectValue(index) {
      this.selectValue(index);
    },

    selectLastThirtyDays() {
      this.currentTimestamp = getUnixTime(new Date());

      const DateService = new DateServiceDefault();

      this.dateRange = {
        from: DateService.thirtyDaysAgo(),
        to: DateService.nextTwoWeek(),
      };

      this.period = LAST_THIRTY_DAYS_PERIOD;
      this.isShownDateMenu = false;
    },

    onClickSelectLastThirtyDays() {
      this.selectLastThirtyDays();

      this.isOpenedMenu = false;
    },

    onChangeOwnRangeInput() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      this.ownRange = [this.ownRangeStart, this.ownRangeEnd];
    },

    onClickRangeSet() {
      this.isOpenedMenu = !this.isOpenedMenu;
    },

    onClickShiftRange(action) {
      if (this.period === LAST_THIRTY_DAYS_PERIOD) {
        this.changePeriodType(OWN_PERIOD);
      }

      const numberForIncludeNextDay = 1;

      const startRangeDate = parse(this.ownRangeStart, "dd.MM.yyyy", new Date());
      const endRangeDate = parse(this.ownRangeEnd, "dd.MM.yyyy", new Date());
      const daysDifference = differenceInDays(endRangeDate, startRangeDate);

      if (action === "next") {
        if (this.period === OWN_PERIOD) {
          const newStartDate = this.getDateFromTimeStamp(
            getUnixTime(addDays(endRangeDate, numberForIncludeNextDay)),
            this.declinedMonthsFullLocales
          );

          const newEndDate = this.getDateFromTimeStamp(
            getUnixTime(addDays(endRangeDate, daysDifference + numberForIncludeNextDay)),
            this.declinedMonthsFullLocales
          );

          this.ownRangeStart = `${newStartDate.day}.${newStartDate.month + 1}.${newStartDate.year}`;
          this.ownRangeEnd = `${newEndDate.day}.${newEndDate.month + 1}.${newEndDate.year}`;

          this.ownRange = [this.ownRangeStart, this.ownRangeEnd];
        } else {
          let nextDate = this.datesList.find((item) => item.endRange > this.dateRange.to);

          if (!nextDate) {
            this.onClickShiftDatesList(action);

            nextDate = this.datesList.find((item) => item.endRange > this.dateRange.to);
          }

          this.dateRange.from = nextDate.startRange;
          this.dateRange.to = nextDate.endRange;
        }
      } else {
        if (this.period === OWN_PERIOD) {
          const newStartDate = this.getDateFromTimeStamp(
            getUnixTime(subDays(startRangeDate, daysDifference + numberForIncludeNextDay)),
            this.declinedMonthsFullLocales
          );

          const newEndDate = this.getDateFromTimeStamp(
            getUnixTime(subDays(endRangeDate, daysDifference + numberForIncludeNextDay)),
            this.declinedMonthsFullLocales
          );

          this.ownRangeStart = `${newStartDate.day}.${newStartDate.month + 1}.${newStartDate.year}`;
          this.ownRangeEnd = `${newEndDate.day}.${newEndDate.month + 1}.${newEndDate.year}`;

          this.ownRange = [this.ownRangeStart, this.ownRangeEnd];
        } else {
          const reverseDatesList = [...this.datesList].reverse();

          let previousDate = reverseDatesList.find((item) => item.endRange < this.dateRange.to);

          if (!previousDate) {
            this.onClickShiftDatesList(action);

            const reverseDatesList = [...this.datesList].reverse();

            previousDate = reverseDatesList.find((item) => item.endRange < this.dateRange.to);
          }

          this.dateRange.from = previousDate.startRange;
          this.dateRange.to = previousDate.endRange;
        }
      }
    },
  },
};
</script>

<i18n>
en:
  lastThirtyDays: "Last 30 days <span> and 2 next two weeks </span>"
  ownRange: "Own range"
  week: "Week"
  month: "Month"
  quarter: "Quarter"
  year: "Year"
  dateFormatWithDot: Date should be in format 'dd.mm.yyyy'.
  notCorrectMonthNumber: Wrong month number.
  notCorrectDayNumber: Wrong day in month.
  monthShort:
    january: Jan
    february: Feb
    march: Mar
    april: Apr
    may: May
    june: Jun
    july: Jul
    august: Aug
    september: Sep
    october: Oct
    november: Nov
    december: Dec
  declinedMonth:
    january: January
    february: February
    march: March
    april: April
    may: May
    june: June
    july: July
    august: August
    september: September
    october: October
    november: November
    december: December
  monthList:
    january: January
    february: February
    march: March
    april: April
    may: May
    june: June
    july: July
    august: August
    september: September
    october: October
    november: November
    december: December
ru:
  lastThirtyDays: "Последние 30 дней <span> и 2 неделе вперед </span>"
  ownRange: "Свой диапазон"
  week: "Неделя"
  month: "Месяц"
  quarter: "Квартал"
  year: "Год"
  dateFormatWithDot: Дата должна быть в формате 'dd.mm.yyyy'.
  notCorrectMonthNumber: Неверный номер месяца.
  notCorrectDayNumber: Неверный день месяца.
  monthShort:
    january: Янв
    february: Фев
    march: Мар
    april: Апр
    may: Май
    june: Июнь
    july: Июль
    august: Авг
    september: Сен
    october: Окт
    november: Ноя
    december: Дек
  declinedMonth:
    january: Января
    february: Февраля
    march: Марта
    april: Апреля
    may: Мая
    june: Июня
    july: Июля
    august: Августа
    september: Сентября
    october: Октября
    november: Ноября
    december: Декабря
  monthList:
    january: Январь
    february: Февраль
    march: Март
    april: Апрель
    may: Май
    june: Июн
    july: Июл
    august: Август
    september: Сентябрь
    october: Октябрь
    november: Ноябрь
    december: Декабрь
ua:
  lastThirtyDays: "Останніх 30 днів <span> і 2 тижні вперед </span>"
  ownRange: "Свій діапазон"
  week: "Тиждень"
  month: "Місяць"
  quarter: "Квартал"
  year: "Рік"
  dateFormatWithDot: Дата повинна бути в форматі 'dd.mm.yyyy'.
  notCorrectMonthNumber: Невірний номер місяця.
  notCorrectDayNumber: Невірний день місяця.
  monthShort:
    january: Січ
    february: Лют
    march: Бер
    april: Кві
    may: Тра
    june: Чер
    july: Лип
    august: Сер
    september: Вер
    october: Жов
    november: Лис
    december: Гру
  declinedMonth:
    january: Січня
    february: Лютого
    march: Березня
    april: Квітня
    may: Травня
    june: Червня
    july: Липня
    august: Серпня
    september: Вересня
    october: Жовтня
    november: Листопада
    december: Грудня
  monthList:
    january: Січень
    february: Лютий
    march: Березень
    april: Квітень
    may: Травень
    june: Червень
    july: Липень
    august: Серпень
    september: Вересень
    october: Жовтень
    november: Листопад
    december: Грудень
</i18n>

<style lang="postcss" scoped>
.date {
  @apply relative z-20;

  &-menu {
    @apply absolute mt-2;
    @apply rounded-2xl bg-white shadow;
    @apply z-10 w-80 p-2;

    &-wrapper {
      @apply flex;
      @apply space-x-1;
      @apply mb-1;

      &:last-child {
        @apply mb-0;
      }
    }

    &-datepicker-wrapper {
      @apply flex;
      @apply mt-4;
    }

    &-input {
      &::v-deep {
        &:first-child {
          .input {
            @apply rounded-r-none border-r-transparent;

            &:focus {
              @apply z-10 border-r-gray-500;

              &:hover {
                @apply border-r-gray-500;
              }
            }

            &:hover {
              @apply border-r-gray-400;
            }
          }
        }

        &:last-child {
          .input {
            @apply rounded-l-none;

            &:focus {
              @apply z-10;
            }
          }
        }

        .input {
          @apply text-sm;
          @apply border-gray-100;
          @apply py-2.5 px-4;
        }
      }
    }

    &-button {
      @apply flex flex-col items-center justify-center;
      @apply text-center text-xs font-medium text-base-dark;
      @apply rounded-lg bg-base-dark bg-opacity-5;
      @apply py-2.5 px-1.5;
      @apply h-[3.125rem] w-full cursor-pointer;

      &:hover {
        @apply bg-opacity-10;
      }

      &::v-deep {
        span {
          @apply block font-normal text-gray-500;
        }
      }

      &-active {
        @apply bg-opacity-15;
      }
    }

    &-range {
      @apply flex items-center justify-between;
      @apply mt-4 mb-2.5 px-2.5 py-2;

      &-value {
        @apply text-sm font-medium text-base-dark;
      }
    }

    &-list {
      &-item {
        @apply text-center text-sm font-medium text-base-dark;
        @apply py-2.5;
        @apply cursor-pointer;

        &:hover {
          @apply rounded-lg bg-gray-50;
        }

        &-active {
          @apply rounded-lg bg-base-dark bg-opacity-5;
          @apply py-3;
        }
      }
    }
  }
}

.icon {
  @apply cursor-pointer;

  &::v-deep g [fill] {
    @apply fill-current text-base-dark;
  }
}

.grid-menu {
  @apply grid grid-cols-3 grid-rows-1 gap-0.5;

  .date-menu-list-item {
    @apply py-3;
  }
}

.own-today {
  @apply flex items-center justify-center;
  @apply h-full rounded-lg bg-base-dark;
  @apply text-white;
}

.own-range {
  @apply mt-6 pt-0.5;

  &-day {
    @apply flex items-center justify-center;
    @apply h-full bg-base-dark bg-opacity-5;
  }
}

.first-own-range-day {
  @apply flex items-center justify-center;
  @apply h-full rounded-l-lg bg-base-dark bg-opacity-10 font-medium;

  &:hover {
    @apply bg-gray-100;
  }

  &-block {
    @apply h-full bg-white;
  }
}

.last-own-range-day {
  @apply flex items-center justify-center;
  @apply h-full rounded-r-lg bg-base-dark bg-opacity-10 font-medium;

  &:hover {
    @apply bg-gray-100;
  }

  &-block {
    @apply h-full bg-white;
  }
}
</style>
