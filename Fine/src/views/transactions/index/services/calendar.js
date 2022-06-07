import i18n from "@/plugins/vue-i18n";

import {
  addMonths,
  differenceInCalendarDays,
  endOfWeek,
  fromUnixTime,
  getDaysInMonth,
  getMonth,
  getUnixTime,
  getYear,
  isToday,
  startOfWeek,
  startOfDay,
} from "date-fns";

const MONTHES_LOCALES = [
  i18n.t("label.month.january"),
  i18n.t("label.month.february"),
  i18n.t("label.month.march"),
  i18n.t("label.month.april"),
  i18n.t("label.month.may"),
  i18n.t("label.month.june"),
  i18n.t("label.month.july"),
  i18n.t("label.month.august"),
  i18n.t("label.month.september"),
  i18n.t("label.month.october"),
  i18n.t("label.month.november"),
  i18n.t("label.month.december"),
];

export default class Calendar {
  constructor(startDate, endDate, transactions, baseCurrency) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.transactions = transactions;
    this.baseCurrency = baseCurrency;
  }

  getData() {
    const calendarDates = this.#prepareCalendarDates(this.startDate, this.endDate);

    return calendarDates.map((date) => {
      const prevMonth = this.#createPreviousMonth(date.year, date.month);
      const currentMonth = this.#createCurrentMonth(date);
      const nextMonth = this.#createNextMonth(date.year, date.month, date.daysCount);
      const calendarDays = [...prevMonth, ...currentMonth, ...nextMonth];

      return {
        month: date.monthLocale,
        year: date.year,
        days: calendarDays,
      };
    });
  }

  #getRange(start, end) {
    const rangeDifference = end - start;
    const range = [];

    for (let i = 0; i < rangeDifference; i++) {
      range.push(start + i);
    }

    range.push(end);

    return range;
  }

  #getMonthsRange(years, startMonth, endMonth) {
    const isOnlyOneYear = years.length === 1;
    let months = [];

    if (isOnlyOneYear) {
      const monthRange = this.#getRange(startMonth, endMonth);

      months.push(monthRange);
    } else {
      const [startYear] = years;
      const endYear = years[years.length - 1];
      const monthNumber = MONTHES_LOCALES.length;

      years.forEach((year) => {
        let monthsInYear = [];

        if (year === startYear) {
          for (let i = startMonth; i < monthNumber; i++) {
            monthsInYear.push(i);
          }

          months.push(monthsInYear);
        } else if (year === endYear) {
          for (let i = 0; i <= endMonth; i++) {
            monthsInYear.push(i);
          }

          months.push(monthsInYear);
        } else {
          for (let i = 0; i < monthNumber; i++) {
            monthsInYear.push(i);
          }

          months.push(monthsInYear);
        }
      });
    }

    return months;
  }

  #getDateRange(startDate, endDate) {
    const startYear = getYear(fromUnixTime(startDate));
    const endYear = getYear(fromUnixTime(endDate));

    const startMonth = getMonth(fromUnixTime(startDate));
    const endMonth = getMonth(fromUnixTime(endDate));

    const years = this.#getRange(startYear, endYear);
    const months = this.#getMonthsRange(years, startMonth, endMonth);

    return [years, months];
  }

  #prepareCalendarDates(startDate, endDate) {
    const [years, months] = this.#getDateRange(startDate, endDate);
    const dates = [];

    years.forEach((year, index) => {
      const yearWithMonthAndDays = months[index].map((month) => {
        const daysCount = getDaysInMonth(new Date(year, month));

        return {
          monthLocale: MONTHES_LOCALES[month],
          month,
          year,
          daysCount,
        };
      });

      dates.push(...yearWithMonthAndDays);
    });

    return dates;
  }

  #createPreviousMonth(year, month) {
    let calendarDays = [];

    const date = new Date(year, month);

    const daysOfPrevMonthInFirstCalendarRow = differenceInCalendarDays(
      date,
      startOfWeek(date, { weekStartsOn: 1 })
    );

    const prevMonthDate = addMonths(date, -1);
    const prevMonth = getMonth(prevMonthDate);
    const prevMonthYear = getYear(prevMonthDate);
    const daysInPrevMonth = getDaysInMonth(new Date(prevMonthYear, prevMonth));

    for (let i = 1; i <= daysOfPrevMonthInFirstCalendarRow; i++) {
      const prevDay = daysInPrevMonth - daysOfPrevMonthInFirstCalendarRow + i;
      const timestampTime = getUnixTime(new Date(prevMonthYear, prevMonth, prevDay));

      const calendarTransactions = this.transactions.find((item) => {
        const itemDate = fromUnixTime(item.date);
        const startDateTimestamp = getUnixTime(startOfDay(itemDate));

        return startDateTimestamp === timestampTime;
      });

      calendarDays.push({
        dayNumber: prevDay,
        timestampTime,
        month: i === 1 ? MONTHES_LOCALES[prevMonth] : "",
        otherMonth: true,
        income: {
          type: "income",
          sum: calendarTransactions?.income || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
        expense: {
          type: "expense",
          sum: calendarTransactions?.expense || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
      });
    }

    return calendarDays;
  }

  #createCurrentMonth(date) {
    let calendarDays = [];

    for (let i = 0; i < date.daysCount; i++) {
      const currentDay = i + 1;
      const day = new Date(date.year, date.month, currentDay);
      const timestampTime = getUnixTime(day);

      const calendarTransactions = this.transactions.find((item) => {
        const itemDate = fromUnixTime(item.date);
        const startDateTimestamp = getUnixTime(startOfDay(itemDate));

        return startDateTimestamp === timestampTime;
      });

      calendarDays.push({
        dayNumber: currentDay,
        timestampTime,
        month: i === 0 ? date.monthLocale : "",
        isCurrentDay: isToday(day),
        income: {
          type: "income",
          sum: calendarTransactions?.income || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
        expense: {
          type: "expense",
          sum: calendarTransactions?.expense || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
      });
    }

    return calendarDays;
  }

  #createNextMonth(year, month, day) {
    let calendarDays = [];

    const date = new Date(year, month, day);

    const daysOfNextMonthInLastCalendarRow = differenceInCalendarDays(
      endOfWeek(date, { weekStartsOn: 1 }),
      date
    );

    const nextMonthDate = addMonths(new Date(year, month), 1);
    const nextMonth = getMonth(nextMonthDate);
    const nextMonthYear = getYear(nextMonthDate);

    for (let i = 0; i < daysOfNextMonthInLastCalendarRow; i++) {
      const nextDay = i + 1;
      const timestampTime = getUnixTime(new Date(nextMonthYear, nextMonth, nextDay));

      const calendarTransactions = this.transactions.find((item) => {
        const itemDate = fromUnixTime(item.date);
        const startDateTimestamp = getUnixTime(startOfDay(itemDate));

        return startDateTimestamp === timestampTime;
      });

      calendarDays.push({
        dayNumber: nextDay,
        timestampTime,
        month: i === 0 ? MONTHES_LOCALES[nextMonth] : "",
        otherMonth: true,
        income: {
          type: "income",
          sum: calendarTransactions?.income || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
        expense: {
          type: "expense",
          sum: calendarTransactions?.expense || "",
          currencySymbol: this.baseCurrency.currentSymbol,
        },
      });
    }

    return calendarDays;
  }
}
