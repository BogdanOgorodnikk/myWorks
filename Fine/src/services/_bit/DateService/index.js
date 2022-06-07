import I18nServiceDefault from "@ilevel/our.service.i18n";
import { enGB, ru, uk } from "date-fns/locale";
import {
  addDays,
  endOfDay,
  endOfTomorrow,
  format,
  getUnixTime,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  subDays,
} from "date-fns";

export default class DateServiceDefault {
  #languages = {
    en: enGB,
    ru: ru,
    ua: uk,
  };

  #settings = {
    yearFormat: "y",
    monthFormat: "MMMM",
    dayFormat: "EEEE",
    dateNumberFormat: "dd",
  };

  TOMORROW_TIMESTAMP = getUnixTime(endOfTomorrow());

  constructor(languages = null) {
    this.#languages = languages || this.#languages;
  }

  formatDate(date, settings) {
    const mergedSettings = {
      ...this.#settings,
      ...settings,
    };
    const { dayFormat, monthFormat, yearFormat, dateNumberFormat, i18n } = mergedSettings;
    const locale = this.#languages[I18nServiceDefault.getActiveLanguage()];

    const day = format(date, dayFormat, { locale });
    const month = format(date, monthFormat, { locale }).split(".").join(""); //Removes dot from Ukr and Rus localization;
    const year = format(date, yearFormat);
    const dateNumber = format(date, dateNumberFormat);

    let formattedDate = `${day}, ${dateNumber} ${month} ${year}`;

    if (isYesterday(date)) {
      formattedDate = `${i18n.yesterday}, ${dateNumber} ${month} ${year}`;
    }

    if (isToday(date)) {
      formattedDate = `${i18n.today}, ${dateNumber} ${month} ${year}`;
    }

    if (isTomorrow(date)) {
      formattedDate = `${i18n.tomorrow}, ${dateNumber} ${month} ${year}`;
    }

    return formattedDate;
  }

  dateConverter(timestamp, type = "date") {
    const locale = this.#languages[I18nServiceDefault.getActiveLanguage()];
    const date = new Date(timestamp * 1000);
    let options = "";

    if (type.includes("date")) {
      options = "dd.MM.yyyy";
    }

    if (type.includes("time")) {
      options = "HH:mm:ss";
    }

    if (type.includes("datetime")) {
      options = "HH:mm dd.MM.yyyy";
    }

    if (type.includes("dateWithFullMonth")) {
      options = "dd MMMM yyyy";
    }

    return format(date, options, { locale });
  }

  thirtyDaysAgo() {
    const date = new Date();
    const thirtyDaysAgo = subDays(date, 30);

    return getUnixTime(startOfDay(thirtyDaysAgo));
  }

  nextTwoWeek() {
    const date = new Date();
    const nextTwoWeek = addDays(date, 14);

    return getUnixTime(endOfDay(nextTwoWeek));
  }
}
