<template>
  <div>
    <div class="account-money">
      <template v-for="(company, index) in companies">
        <div
          v-if="!isAvailabilityMoneyInAccounts(company.accounts)"
          :key="company.id"
          class="account-money-block"
        >
          <div class="account-money-header">
            <div class="account-money-wrapper-title">{{ company.name }}</div>
            <div
              v-if="!company.isAllCurrenciesBase"
              class="account-money-wrapper-calculate"
              @click="onClickShowMoneyInBaseCurrency(index)"
            >
              <template v-if="!company.isShownInBaseCurrency">
                {{
                  $t("page.transactions.moneyDetails.showInCurrency", {
                    currency: settings.currency.currentSymbol,
                  })
                }}
              </template>

              <template v-else>
                {{ $t("page.transactions.moneyDetails.inCurrency") }}
              </template>
            </div>
          </div>

          <div v-for="(account, idx) in company.accounts" :key="idx">
            <div v-if="account.money.sum" class="account-money-wrapper">
              <div class="account-money-wrapper-currency-name">{{ account.name }}</div>
              <OurMoney
                v-if="company.isShownInBaseCurrency"
                class="account-money-wrapper-currency-number"
                size="lg"
                :item="account.inBaseCurrencyMoney"
                currency-symbol-align="left"
                :integer="!isShownCents"
              />

              <OurMoney
                v-else
                class="account-money-wrapper-currency-number"
                size="lg"
                :item="account.money"
                currency-symbol-align="left"
                :integer="!isShownCents"
              />
            </div>
          </div>
        </div>
      </template>

      <div v-if="isFuturePayments" class="money-details-body-border" />
    </div>

    <div v-if="isFuturePayments" class="futures-payments">
      <div class="futures-payments-wrapper">
        <div class="futures-payments-wrapper-title">
          {{ $t("page.transactions.moneyDetails.futurePayments") }}
        </div>

        <OurDropdown
          :text="
            $t('page.transactions.moneyDetails.futurePaymentsPeriod', {
              amountOfMonth: futurePaymentsPeriod.number,
            })
          "
          class="custom-dropdown"
          :dropdown-icon="false"
          variant="link"
          size="sm"
        >
          <div
            v-for="(period, index) in futurePaymentsPeriods"
            :key="index"
            @click="onClickSelectPeriod(period)"
          >
            {{ period.number }}
          </div>
        </OurDropdown>
      </div>

      <MoneyDetailsDropdown
        v-if="plannedMoney.income.generalAmount.sum"
        class="futures-payments-dropdown"
        :title="$t('page.transactions.moneyDetails.futureIncome')"
        :planned-money="plannedMoney.income"
      />

      <MoneyDetailsDropdown
        v-if="plannedMoney.expense.generalAmount.sum"
        class="futures-payments-dropdown"
        :title="$t('page.transactions.moneyDetails.futureExpense')"
        :planned-money="plannedMoney.expense"
      />

      <MoneyDetailsDropdown
        class="futures-payments-total-dropdown"
        :title="$t('page.transactions.moneyDetails.totalOnAccounts')"
        :description-title="$t('page.transactions.moneyDetails.consideringFuturePayments')"
        :planned-money="plannedMoney.totals"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { MONEY_FUTURE_PAYMENTS_PERIOD } from "@/api/transaction";

import MoneyDetailsDropdown from "./MoneyDetailsDropdown";

export default {
  components: {
    MoneyDetailsDropdown,
  },

  data: () => ({
    companies: [],
    futurePaymentsPeriod: {
      number: 1,
      value: MONEY_FUTURE_PAYMENTS_PERIOD.one,
    },
    futurePaymentsPeriods: [
      { number: 1, value: MONEY_FUTURE_PAYMENTS_PERIOD.one },
      { number: 3, value: MONEY_FUTURE_PAYMENTS_PERIOD.three },
      { number: 6, value: MONEY_FUTURE_PAYMENTS_PERIOD.six },
      { number: 12, value: MONEY_FUTURE_PAYMENTS_PERIOD.twelve },
    ],
    plannedMoney: {},
  }),

  computed: {
    ...mapState("settings", ["settings"]),
    ...mapState("transaction", ["totalsBalance"]),

    ...mapGetters("settings", ["baseCurrency", "isShownCents"]),

    isFuturePayments() {
      const plannedTotals = this.totalsBalance.planned;

      const futurePayments = {
        oneMonth:
          plannedTotals.oneMoth.income.inBaseCurrency.income ||
          plannedTotals.oneMoth.outcome.inBaseCurrency.outcome,
        threeMonths:
          plannedTotals.threeMonths.income.inBaseCurrency.income ||
          plannedTotals.threeMonths.outcome.inBaseCurrency.outcome,
        sixMonths:
          plannedTotals.sixMonths.income.inBaseCurrency.income ||
          plannedTotals.sixMonths.outcome.inBaseCurrency.outcome,
        twelveMonths:
          plannedTotals.twelveMonths.income.inBaseCurrency.income ||
          plannedTotals.twelveMonths.outcome.inBaseCurrency.outcome,
      };

      return (
        futurePayments.oneMonth &&
        futurePayments.threeMonths &&
        futurePayments.sixMonths &&
        futurePayments.twelveMonths
      );
    },
  },

  created() {
    this.prepareCompanies();
    this.preparePlannedMoney();
  },

  methods: {
    preparePlannedMoney() {
      const plannedMoney = this.totalsBalance.planned[this.futurePaymentsPeriod.value];

      this.plannedMoney = {
        income: {
          generalAmount: {
            sum: plannedMoney.income.inBaseCurrency.income,
            currencySymbol: plannedMoney.income.inBaseCurrency.currency.symbol,
          },
          money: plannedMoney.income.byCurrencies.map((money) => {
            return {
              sum: money.income,
              currencySymbol: money.currency.symbol,
            };
          }),
        },
        expense: {
          generalAmount: {
            sum: plannedMoney.outcome.inBaseCurrency.outcome,
            currencySymbol: plannedMoney.outcome.inBaseCurrency.currency.symbol,
          },
          money: plannedMoney.outcome.byCurrencies.map((money) => {
            return {
              sum: money.outcome,
              currencySymbol: money.currency.symbol,
            };
          }),
        },
        totals: {
          generalAmount: {
            sum: plannedMoney.totals.inBaseCurrency.balance,
            currencySymbol: plannedMoney.totals.inBaseCurrency.currency.symbol,
          },
          money: plannedMoney.totals.byCurrencies.map((money) => {
            return {
              sum: money.balance,
              currencySymbol: money.currency.symbol,
            };
          }),
        },
      };
    },

    prepareCompanies() {
      const companiesMoney = this.totalsBalance?.factual?.byCompanies;

      this.companies = companiesMoney.map((item) => {
        const companyAllAccountsCurrency = item.byAccounts.map(
          (account) => account.balance.currency.id
        );

        const isBaseCurrency = companyAllAccountsCurrency.every(
          (currency) => currency === this.baseCurrency.currentId
        );

        return {
          id: item.company.id,
          name: item.company.name,
          isAllCurrenciesBase: isBaseCurrency,
          isShownInBaseCurrency: false,
          accounts: item.byAccounts.map((account) => {
            return {
              name: `${account.bankAccount.name}, ${account.balance.currency.symbol}`,
              money: {
                sum: account?.balance.balance,
                currencySymbol: account.balance.currency.symbol,
              },
              inBaseCurrencyMoney: {
                sum: account?.inBaseCurrency.balance,
                currencySymbol: account.inBaseCurrency.currency.symbol,
              },
            };
          }),
        };
      });
    },

    isAvailabilityMoneyInAccounts(accounts) {
      return accounts.every((item) => item.money.sum === 0);
    },

    onClickShowMoneyInBaseCurrency(index) {
      this.companies[index].isShownInBaseCurrency = !this.companies[index].isShownInBaseCurrency;
    },

    onClickSelectPeriod(period) {
      this.futurePaymentsPeriod = period;

      this.preparePlannedMoney();
    },
  },
};
</script>

<style lang="postcss" scoped>
.account-money {
  @apply px-4 md:px-8;

  &-header {
    @apply flex items-center justify-between;
    @apply !mb-4;
  }

  &-block {
    @apply mb-8;

    &:last-child {
      @apply mb-0;
    }
  }

  &-wrapper {
    @apply flex items-center justify-between;
    @apply mb-2;

    &-title {
      @apply text-lg font-bold text-white;
    }

    &-calculate {
      @apply text-sm font-normal text-gray-400;
      @apply border border-t-0 border-r-0 border-l-0 border-dashed border-gray-400;
      @apply cursor-pointer;
    }

    &-currency-name {
      @apply text-base font-normal text-gray-400;
    }

    &-currency-number {
      &::v-deep {
        .money-block {
          @apply font-normal text-white;

          .sum {
            @apply ml-0;
          }
        }
      }
    }
  }
}

.futures-payments {
  @apply my-8 px-4 md:px-8;

  &-dropdown {
    @apply -mb-2;
  }

  &-wrapper {
    @apply flex justify-between;
    @apply mb-4;

    &-title {
      @apply text-lg font-bold text-white;
    }
  }
}

.futures-payments-total-dropdown::v-deep {
  @apply mt-5;

  .money-details-dropdown {
    .money-details-dropdown-title {
      @apply font-bold;
    }

    .money-details-dropdown-sum {
      @apply font-bold;
    }
  }
}

.money-details-body-border {
  @apply border-b border-gray-700;
  @apply my-8;
}

.custom-dropdown::v-deep {
  div {
    .dropdown {
      @apply text-gray-400;
      @apply border-gray-400;
    }

    div {
      @apply w-14;
      @apply left-0;
    }
  }
}
</style>
