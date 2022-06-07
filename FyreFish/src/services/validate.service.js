import ValidationServiceDefault from "@ilevel/our.service.validation";

class ValidationService extends ValidationServiceDefault {
  // You can redefine some part of default class here
  CREDIT_CARD_MIN_LENGTH = 15;
  CREDIT_CARD_MAX_LENGTH = 16;
  CVV_MIN_LENGTH = 3;
  CVV_MAX_LENGTH = 4;
  ROUTING_NUMBER_LENGTH = 9;
  ACCOUNT_NUMBER_MIN_LENGTH = 8;
  ACCOUNT_NUMBER_MAX_LENGTH = 12;

  // Use "g" flag in RegExp,if want to use in OurInput
  KEEP_ONLY_NUMBER_REG_EXP = /[^\d;]/g;

  clearPhone = (value) => {
    return value.replace(this.KEEP_ONLY_NUMBER_REG_EXP, "");
  };

  isNumeric = (val) => {
    return /^-?\d+$/.test(val);
  };

  creditCardMinLength = (value) => {
    return value.length >= this.CREDIT_CARD_MIN_LENGTH;
  };

  creditCardMaxLength = (value) => {
    return value.length <= this.CREDIT_CARD_MAX_LENGTH;
  };

  cvvMinLength = (value) => {
    return value.length >= this.CVV_MIN_LENGTH;
  };

  cvvMaxLength = (value) => {
    return value.length <= this.CVV_MAX_LENGTH;
  };

  routingNumberLength = (value) => {
    return value.length == this.ROUTING_NUMBER_LENGTH;
  };

  accountNumberLength = (value) => {
    return (
      value.length >= this.ACCOUNT_NUMBER_MIN_LENGTH &&
      value.length <= this.ACCOUNT_NUMBER_MAX_LENGTH
    );
  };

  expirationDateFormat = (date) => {
    var dateReg = /^0[1-9]|1[0-2]\/\d{2}$/; //(01 to 12)/(00 to 99) format

    if (date && !date.match(dateReg)) {
      return false;
    }

    return true;
  };

  expirationDateYearInFuture = (param) => (date) => {
    const monthYearTocheck = date.split(param.separatorCharacter);
    const currentMonth = new Date().getMonth() + 1;
    const currentYearLastPart = new Date().getFullYear().toString().slice(2, 4);

    if (
      monthYearTocheck[0] &&
      monthYearTocheck[0].length === 2 &&
      monthYearTocheck[0] < currentMonth
    ) {
      return false;
    }

    if (
      monthYearTocheck[1] &&
      monthYearTocheck[1].length == 2 &&
      monthYearTocheck[1] < currentYearLastPart
    ) {
      return false;
    }

    return true;
  };

  currencyFormat = (value) => {
    const currencyReg = /^(\d+.?\d{0,2})$/;

    if (value && !value.match(currencyReg)) {
      return false;
    }

    return true;
  };
}

export default new ValidationService();
