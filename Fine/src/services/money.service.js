import MoneyServiceDefault, {
  CREDIT_OBLIGATION,
  DEBIT_OBLIGATION,
} from "@ilevel/our.service.money";
import { TRANSACTION_TYPE } from "@/api/transaction";

class MoneyService extends MoneyServiceDefault {
  // You can redefine some part of default class here

  setMoneyObligation(paymentDate, accrualDate, moneyType) {
    let moneyObligation = "";

    if (!!paymentDate && !!accrualDate && paymentDate > accrualDate) {
      if (moneyType === TRANSACTION_TYPE.income) {
        moneyObligation = DEBIT_OBLIGATION;
      } else if (moneyType === TRANSACTION_TYPE.expense) {
        moneyObligation = CREDIT_OBLIGATION;
      }
    } else if (!!paymentDate && !!accrualDate && accrualDate > paymentDate) {
      if (moneyType === TRANSACTION_TYPE.income) {
        moneyObligation = CREDIT_OBLIGATION;
      } else if (moneyType === TRANSACTION_TYPE.expense) {
        moneyObligation = DEBIT_OBLIGATION;
      }
    }

    return moneyObligation;
  }
}

export default new MoneyService();
