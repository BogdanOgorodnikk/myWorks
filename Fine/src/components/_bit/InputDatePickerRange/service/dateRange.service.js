import {
  addQuarters,
  addWeeks,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  getDate,
  getDaysInMonth,
  getMonth,
  getUnixTime,
  getWeeksInMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";

export function createYears(dateRange) {
  const NUMBER_ADDING_YEAR = 12;

  const { year, month } = dateRange;

  let years = [];

  for (let i = 0; i < NUMBER_ADDING_YEAR; i++) {
    const currentYear = year + i;

    years.push({
      index: i,
      title: currentYear,
      startRange: getUnixTime(startOfYear(new Date(currentYear, month))),
      endRange: getUnixTime(endOfYear(new Date(currentYear, month))),
    });
  }

  return [...years];
}

export function createQuarters(dateRange, settings) {
  const QUARTER_NUMBER = 4;
  const { year } = dateRange;

  let quarters = [];

  const firstQuarter = new Date(year, 0, 1);

  for (let quarter = 0; quarter < QUARTER_NUMBER; quarter++) {
    const newQuarter = addQuarters(firstQuarter, quarter);

    quarters.push({
      index: quarter,
      title: `${quarter + 1} ${settings.i18n.quarter}`,
      startRange: getUnixTime(startOfQuarter(newQuarter)),
      endRange: getUnixTime(endOfQuarter(newQuarter)),
    });
  }

  return [...quarters];
}

export function createMonthsList(dateRange, monthLocales) {
  const { year } = dateRange;

  const months = monthLocales.map((item, index) => {
    const currentMonth = new Date(year, index);
    const firstDayOfMonth = 1;
    const lastDayOfMonth = getDaysInMonth(currentMonth);

    return {
      index: index,
      title: item,
      startRange: getUnixTime(new Date(year, index, firstDayOfMonth)),
      endRange: getUnixTime(new Date(year, index, lastDayOfMonth)),
    };
  });

  return [...months];
}

export function createWeeksList(dateRange, monthShortLocales) {
  const { date, month, year } = dateRange;

  const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });

  let weeks = [];

  for (let week = 0; week < weeksInMonth; week++) {
    const date = addWeeks(new Date(year, month, 1), week);
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

    const firstDayOfWeek = getDate(startOfWeekDate);
    const lastDayOfWeek = getDate(endOfWeekDate);

    const isDayInPreviousMonth = week === 0 && firstDayOfWeek > 1;
    const isLastWeek = week + 1 === weeksInMonth;

    let monthFirstDayOfWeek = "";
    let monthLastDayOfWeek = getMonth(endOfWeekDate);

    if (isDayInPreviousMonth || isLastWeek) {
      monthFirstDayOfWeek = getMonth(startOfWeekDate);
    }

    const title = `${firstDayOfWeek} ${
      monthShortLocales[monthFirstDayOfWeek] || ""
    } – ${lastDayOfWeek} ${monthShortLocales[monthLastDayOfWeek]}`;

    weeks.push({
      index: week,
      title,
      startRange: getUnixTime(startOfWeekDate),
      endRange: getUnixTime(endOfWeekDate),
    });
  }

  return [...weeks];
}

export function prepareOwnRangeDate(range) {
  range.month = range.month + 1;

  if (range.day < 10) {
    range.day = `0${range.day}`;
  }

  if (range.month < 10) {
    range.month = `0${range.month}`;
  }

  return `${range.day}.${range.month}.${range.year}`;
}

export default {
  createYears,
  createQuarters,
  createMonthsList,
};
