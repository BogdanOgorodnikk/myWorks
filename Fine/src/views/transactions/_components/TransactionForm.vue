<template>
  <div class="form-wrapper" data-cy="transaction-form">
    <OurCard>
      <OurMoneyInput
        v-if="isDownloadedData"
        ref="moneyInput"
        v-model="form.money"
        :type="moneyInputType"
        :error="moneyError"
        positive-only
        :with-minus="isShownMinus"
        data-cy="money-input-block"
      >
        <template #base-currency-icon>
          <OurSvgIcon
            v-if="isShownDivideAmountTable"
            name="Close"
            class="base-currency-icon"
            :tooltip="$t('label.undoSplitting')"
            @click="onClickChangePatitioningTableState"
          />

          <OurSvgIcon
            v-else
            name="Github"
            class="base-currency-icon"
            :tooltip="$t('label.split')"
            @click="onClickChangePatitioningTableState"
          />
        </template>
      </OurMoneyInput>

      <DivideAmoutTable
        v-if="isShownDivideAmountTable"
        v-model="form.children"
        :general-amount="form.money.initialCurrency.sum"
        :accrual-date="isShownDifferentDealDate"
        :transaction-type="transactionType"
        :form="form"
      />

      <BankAccountSelect
        v-if="!isShownDivideAmountTable"
        v-model="form.bankAccountId"
        :error="bankAccountError"
        data-cy="bank-account-select"
        @change="onChangeBankAccount"
      />

      <OurSelect
        v-if="!isShownDivideAmountTable"
        v-model="form.categoryId"
        :label="$t('label.category')"
        :options="categoriesForSelect"
        group-label="category"
        data-cy="categories-select"
        group-values="subCategories"
        :error="categoryError"
      />

      <OurSelect
        v-if="!isShownDivideAmountTable"
        v-model="form.counterpartyId"
        :label="$t('label.counteragent')"
        :placeholder="$t('placeholder.counteragent')"
        :options="contragentsForSelect"
        data-cy="contragent-select"
      />

      <OurTextarea
        v-if="!isShownDivideAmountTable"
        v-model="form.description"
        :label="$t('label.description')"
        :placeholder="$t('placeholder.fewWordsAboutOperation')"
        data-cy="description-textarea"
      />
    </OurCard>

    <OurCard v-if="isShownDivideAmountTable">
      <BankAccountSelect
        v-model="form.bankAccountId"
        :error="bankAccountError"
        @change="onChangeBankAccount"
      />

      <OurTextarea
        v-model="form.description"
        :label="$t('label.description')"
        :placeholder="$t('placeholder.fewWordsAboutOperation')"
        data-cy="description-textarea"
      />
    </OurCard>

    <OurCard>
      <OurDatePicker
        v-model="form.paymentDate"
        :error="paymentDateError"
        :label="$t('label.paymentDate')"
        data-cy="payment-datepicker"
      >
        <template #right>
          <OurCheckbox
            v-model="form.isConfirmedPaymentDay"
            :label="$t('label.confirmed')"
            data-cy="payment-datepicker-checkbox"
          />
        </template>
      </OurDatePicker>

      <OurDatePicker
        v-show="isShownDifferentDealDate && !isShownDivideAmountTable"
        v-model="form.accrualDate"
        :error="accrualDateError"
        :label="$t('label.accrualDate')"
        data-cy="accrual-datepicker"
        :show="isShownDifferentDealDate"
        class="accrual-datepicker"
      >
        <template #right>
          <OurCheckbox
            v-model="form.isConfirmedAccrualDay"
            :label="$t('label.confirmed')"
            data-cy="accrual-datepicker-checkbox"
          />
        </template>
      </OurDatePicker>

      <div v-show="isShownRecurring" data-cy="recurring-form">
        <OurSelect
          v-model="form.repeat"
          class="recurring-select"
          :label="$t('label.repeat')"
          :options="repeatDateOptions"
          value-key="code"
          data-cy="recurring-select"
          :error="repeatSelectError"
        >
          <template #after-caret>
            <OurCheckbox
              v-model="form.isRepeated"
              data-cy="recurring-datepicker-checkbox"
              :label="$t('label.limit')"
            />
          </template>
        </OurSelect>

        <OurDatePicker
          v-if="form.isRepeated"
          v-model="form.stopRepeat"
          class="repeated-datepicker"
          :label="$t('label.stopRepeating')"
          :placeholder="stopRepeatTransactionsPlaceholder"
          data-cy="stop-recurring-datepicker"
          :error="stopRepeatError"
        />
      </div>

      <OurExpandButton :buttons="buttons" data-cy="transaction-form-more-button">
        <template slot-scope="{ button }">
          <OurExpandButtonItem
            v-if="button.isShown"
            :text="button.text"
            :icon-name="button.iconName"
            @click="onClickMoreButton(button.name)"
          />
        </template>
      </OurExpandButton>
    </OurCard>

    <OurCard v-show="isShownExtraFields" data-cy="extra-fields-form">
      <OurSelect
        v-if="!isShownDivideAmountTable"
        v-model="form.project"
        :label="$t('label.project')"
        :placeholder="$t('placeholder.project')"
        :options="projectsForSelect"
        data-cy="project-select"
        class="project-select"
      />

      <OurMultiselect
        v-model="form.tags"
        :label="$t('label.tags')"
        :placeholder="$t('placeholder.tags')"
        :options="tagsForSelect"
        data-cy="tags-multiselect"
      />
    </OurCard>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { getUnixTime, addYears } from "date-fns";
import DateService from "@/services/date.service";
import { required, requiredIf, minValue } from "vuelidate/lib/validators";

import DivideAmoutTable from "./DivideAmoutTable";
import BankAccountSelect from "@/components/BankAccountSelect";
import { TRANSACTION_TYPE } from "@/api/transaction";

const DIFFERENT_DEAL_DATE = "differentDealDate";
const SHOW_EXTRA_FIELDS = "showExtraFields";
const RECURRING = "recurring";
const MIN_MONEY_VALUE = 1;
const MONEY_TYPE_SINGLE = "single";
const MONEY_TYPE_CONVERTIBLE = "convertible";

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default {
  components: {
    DivideAmoutTable,
    BankAccountSelect,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    divideTable: {
      type: Boolean,
      default: false,
    },

    transactionType: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isShownDifferentDealDate: false,
      isShownExtraFields: false,
      isShownRecurring: false,
      isDownloadedData: false,
      form: {
        isValid: false,
        id: "",
        counterpartyId: 0,
        bankAccountId: 0,
        categoryId: 0,
        paymentDate: 0,
        accrualDate: 0,
        project: 0,
        tags: [],
        children: [],
        description: "",
        money: {
          initialCurrency: {
            symbol: "",
            sum: "",
          },
          convertibleCurrency: {
            symbol: "",
            sum: "",
          },
          firstRate: {
            sum: "",
            label: "",
            symbol: "",
            placeholder: "",
          },
        },
        isConfirmedPaymentDay: false,
        isConfirmedAccrualDay: false,
        isRepeated: false,
        repeat: "",
        stopRepeat: 0,
        fromAccount: "",
        transferCategoryId: "",
        expenseCategoryId: "",
        incomeCategoryId: "",
      },
      buttons: [
        {
          text: this.$t("button.differentDealDate"),
          iconName: "Flag",
          name: DIFFERENT_DEAL_DATE,
          isShown: true,
        },
        {
          text: this.$t("button.recurring"),
          iconName: "Time-schedule",
          name: RECURRING,
          isShown: true,
        },
        {
          text: this.$t("button.showExtraFields"),
          iconName: "Other2",
          name: SHOW_EXTRA_FIELDS,
          isShown: true,
        },
      ],
      repeatDateOptions: [
        {
          code: "week",
          label: this.$t("label.repeatInterval.everyWeek"),
        },
        {
          code: "month",
          label: this.$t("label.repeatInterval.everyMonth"),
        },
        {
          code: "quarter",
          label: this.$t("label.repeatInterval.everyQuarter"),
        },
        {
          code: "year",
          label: this.$t("label.repeatInterval.everyYear"),
        },
      ],
    };
  },

  validations: {
    form: {
      money: {
        initialCurrency: { sum: { required, minValue: minValue(MIN_MONEY_VALUE) } },
      },
      bankAccountId: { required },
      categoryId: { required },
      paymentDate: { required },
      accrualDate: {
        required: requiredIf(function () {
          return this.form.isConfirmedAccrualDay;
        }),
      },
      repeat: {
        required: requiredIf(function () {
          return this.form.isRepeated;
        }),
      },
      stopRepeat: {
        required: requiredIf(function () {
          return this.form.isRepeated;
        }),
      },
    },
  },

  computed: {
    ...mapState("bankAccount", ["accounts"]),

    ...mapGetters("category", [
      "nestedCategoriesForSelect",
      "defaultCategories",
      "categoriesByType",
    ]),
    ...mapGetters("bankAccount", ["bankAccountsForSelect"]),
    ...mapGetters("contragent", ["contragentsForSelect"]),
    ...mapGetters("tag", ["tagsForSelect"]),
    ...mapGetters("project", ["projectsForSelect"]),
    ...mapGetters("currency", ["currencyRate"]),
    ...mapGetters("settings", ["baseCurrency"]),

    repeatSelectError() {
      const isDirty = this.$v.form.repeat.$dirty;
      const isFilled = this.$v.form.repeat.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    stopRepeatError() {
      const isDirty = this.$v.form.stopRepeat.$dirty;
      const isFilled = this.$v.form.stopRepeat.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    paymentDateError() {
      const isDirty = this.$v.form.paymentDate.$dirty;
      const isFilled = this.$v.form.paymentDate.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    accrualDateError() {
      const isDirty = this.$v.form.accrualDate.$dirty;
      const isFilled = this.$v.form.accrualDate.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    moneyError() {
      const isDirty = this.$v.form.money.initialCurrency.sum.$dirty;
      const isFilled = this.$v.form.money.initialCurrency.sum.required;
      const isMinValue = this.$v.form.money.initialCurrency.sum.minValue;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinValue) {
        error = this.$t("validation.moneyMinValue");
      }

      return error;
    },

    bankAccountError() {
      const isDirty = this.$v.form.bankAccountId.$dirty;
      const isFilled = this.$v.form.bankAccountId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    categoryError() {
      const isDirty = this.$v.form.categoryId.$dirty;

      const isFilled = this.$v.form.categoryId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    isShownMinus() {
      return this.transactionType === TRANSACTION_TYPE.expense;
    },

    defaultCategory() {
      return this.defaultCategories[this.transactionType].id;
    },

    categoriesForSelect() {
      return this.nestedCategoriesForSelect(this.transactionType);
    },

    transactionTypeCategories() {
      return this.categoriesByType(this.transactionType);
    },

    isShownDivideAmountTable: {
      get() {
        return this.divideTable;
      },
      set(value) {
        this.$emit("update:divideTable", value);
      },
    },

    stopRepeatTransactionsPlaceholder() {
      const date = addYears(new Date(), 10);

      return DateService.formatDate(date).capitalize();
    },

    moneyInputType() {
      return this.form.money.initialCurrency.symbol === this.baseCurrency.currentSymbol
        ? MONEY_TYPE_SINGLE
        : MONEY_TYPE_CONVERTIBLE;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },

    transactionType: "onChangeTransactionType",

    divideTable: {
      handler: "onChangeDivideTable",
      immediate: true,
    },

    isDownloadedData: "onChangeDownloadedData",
  },

  async mounted() {
    this.isShownDivideAmountTable = false;

    await Promise.all([
      this.getAccounts(),
      this.getCategories(),
      this.getProjects(),
      this.getTags(),
      this.getContragents(),
    ]);

    await this.prefillForm();
  },

  methods: {
    ...mapActions("bankAccount", ["getAccounts"]),
    ...mapActions("project", ["getProjects"]),
    ...mapActions("tag", ["getTags"]),
    ...mapActions("category", ["getCategories"]),
    ...mapActions("contragent", ["getContragents"]),
    ...mapActions("currency", ["getCurrencyRate"]),

    onChangeTransactionType() {
      this.form.categoryId =
        this.transactionType === TRANSACTION_TYPE.expense
          ? this.value.expenseCategoryId || this.defaultCategory
          : this.value.incomeCategoryId || this.defaultCategory;

      this.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
    },

    onChangeDownloadedData() {
      const timeToRenderingMoneyInput = 500;

      setTimeout(() => {
        this.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
      }, timeToRenderingMoneyInput);
    },

    async onChangeBankAccount() {
      const selectedAccount = this.accounts.find(
        (account) => account.id === this.form.bankAccountId
      );

      const params = {
        currencyIds: [selectedAccount.currency.id],
        timestamp: getUnixTime(new Date()),
      };

      await this.getCurrencyRate(params);

      const selectedAccountRate = this.currencyRate({
        timestamp: getUnixTime(new Date()),
        id: selectedAccount.currency.id,
      });

      this.form.money.initialCurrency.symbol = selectedAccount.currency.symbol;
      this.form.money.firstRate.sum = "";
      this.form.money.firstRate.placeholder = String(selectedAccountRate);
      this.form.money.firstRate.symbol = selectedAccount.currency.symbol;
      this.form.money.convertibleCurrency.sum =
        this.form.money.initialCurrency.sum * selectedAccountRate;
      this.form.money.convertibleCurrency.symbol = this.baseCurrency.currentSymbol;
    },

    async prefillForm() {
      const firstBankAccount = this.bankAccountsForSelect.find((item) => item);

      const bankAccountCurrencyId =
        this.value?.currencyId || firstBankAccount?.currencyId || this.baseCurrency.currentId;

      const params = {
        currencyIds: [bankAccountCurrencyId],
        timestamp: getUnixTime(new Date()),
      };

      await this.getCurrencyRate(params);

      const currencyRate = this.currencyRate({
        timestamp: getUnixTime(new Date()),
        id: bankAccountCurrencyId,
      });

      const valueCategory = this.transactionTypeCategories.find(
        (item) => item.id === this.value.categoryId
      );

      let valueCategoryId = valueCategory?.id;

      if (!valueCategoryId && this.transactionType === TRANSACTION_TYPE.expense) {
        valueCategoryId = this.value.expenseCategoryId;
      } else if (!valueCategoryId && this.transactionType === TRANSACTION_TYPE.income) {
        valueCategoryId = this.value.incomeCategoryId;
      }

      this.form.id = this.value.id;
      this.form.counterpartyId = this.value.counterpartyId;
      this.form.description = this.value.description;
      this.form.bankAccountId =
        this.value.bankAccountId || this.value.intoAccount || firstBankAccount?.id;
      this.form.categoryId = valueCategoryId || this.defaultCategory;
      this.form.counterpartyId = this.value.counterpartyId;
      this.form.paymentDate = this.value.paymentDate
        ? this.value.paymentDate
        : getUnixTime(new Date());
      this.form.isConfirmedPaymentDay = this.value.isConfirmedPaymentDay;
      this.form.accrualDate = this.value.accrualDate;
      this.form.isConfirmedAccrualDay = this.value.isConfirmedAccrualDay;
      this.form.repeat = this.value.repeat;
      this.form.isRepeated = this.value.isRepeated || false;
      this.form.stopRepeat = this.value.stopRepeat;
      this.form.project = this.value.project;
      this.form.tags = this.value?.tags || [];
      this.form.description = this.value.description;
      this.form.fromAccount = this.value.fromAccount;
      this.form.transferCategoryId = this.value.transferCategoryId;
      this.form.expenseCategoryId = this.value.expenseCategoryId;
      this.form.incomeCategoryId = this.value.incomeCategoryId;
      this.form.children =
        this.value.children?.map((item) => ({
          sum: item.sum,
          categoryId: item.category.id,
          counterpartyId: item.counterparty?.id || "",
          accrualDate: item.accrualDate || "",
          accrualConfirmed: item.accrualConfirmed,
          projectId: item.project?.id || "",
        })) || [];

      this.form.money.initialCurrency.sum =
        this.value.sum || this.value?.money?.initialCurrency?.sum
          ? String(this.value.sum || this.value?.money?.initialCurrency?.sum)
          : "";
      this.form.money.initialCurrency.symbol =
        this.value.symbol ||
        this.value?.money?.initialCurrency?.symbol ||
        firstBankAccount?.currencySymbol ||
        this.baseCurrency.currentSymbol;
      this.form.money.firstRate.sum = this.value?.rate || "";
      this.form.money.firstRate.placeholder = String(
        this.value?.money?.secondRate?.placeholder || currencyRate
      );
      this.form.money.firstRate.symbol =
        this.value.symbol ||
        this.value?.money?.initialCurrency?.symbol ||
        firstBankAccount?.currencySymbol ||
        this.baseCurrency.currentSymbol;
      this.form.money.convertibleCurrency.sum = this.value.sum * this.value.rate || "";
      this.form.money.convertibleCurrency.symbol = this.baseCurrency.currentSymbol;

      setTimeout(() => {
        this.isShownDivideAmountTable = !!this.form.children.length;
      }, 0);

      this.isDownloadedData = true;

      const accrualChild = this.form.children.find((child) => child.accrualDate);

      if (this.form.accrualDate || this.form.isConfirmedAccrualDay || accrualChild?.accrualDate) {
        this.changeMoreButtonState(DIFFERENT_DEAL_DATE);
      }

      if (this.form.project || this.form.tags.length) {
        this.changeMoreButtonState(SHOW_EXTRA_FIELDS);
      }

      if (this.form.repeat || this.form.isRepeated) {
        this.changeMoreButtonState(RECURRING);
      }
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      if (this.transactionType === TRANSACTION_TYPE.expense) {
        form.expenseCategoryId = this.form.categoryId;
      } else if (this.transactionType === TRANSACTION_TYPE.income) {
        form.incomeCategoryId = this.form.categoryId;
      }

      if (this.isShownDivideAmountTable && !form.categoryId) {
        form.categoryId = this.defaultCategory;
      }

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();

      if (this.isShownDivideAmountTable) {
        delete this.form.counterpartyId;
        delete this.form.project;

        this.form.categoryId = this.defaultCategory;

        this.form.children = this.form.children.filter((item) => item.sum && item.categoryId);
      } else {
        this.form.children = [];
      }
    },

    changeMoreButtonState(name) {
      if (name === SHOW_EXTRA_FIELDS) {
        this.isShownExtraFields = true;
      }

      if (name === DIFFERENT_DEAL_DATE) {
        this.isShownDifferentDealDate = true;
      }

      if (name === RECURRING) {
        this.isShownRecurring = true;
      }

      this.buttons.forEach((item) => {
        if (item.name === name) {
          item.isShown = false;
        }
      });
    },

    onClickMoreButton(name) {
      this.changeMoreButtonState(name);

      if (name === SHOW_EXTRA_FIELDS) {
        this.$nextTick(() => {
          if (!this.isShownDivideAmountTable) {
            this.$nextTick(() => {
              document.querySelector(".project-select  .multiselect__input").focus();
            });
          }

          const formWrapper = document.querySelector(".form-wrapper");

          formWrapper.scrollTo({ bottom: 0 });
        });
      }

      if (name === DIFFERENT_DEAL_DATE) {
        this.$nextTick(() => {
          document.querySelector(".accrual-datepicker  .input").focus();
        });
      }

      if (name === RECURRING) {
        this.$nextTick(() => {
          document.querySelector(".recurring-select  .multiselect__input").focus();
        });
      }
    },

    onChangeDivideTable() {
      let buttonIndex;

      this.buttons.find((button, index) => {
        if (button.name === SHOW_EXTRA_FIELDS) {
          buttonIndex = index;
        }
      });

      if (this.isShownDivideAmountTable) {
        this.buttons[buttonIndex].text = this.$t("button.addTag");
      } else {
        this.buttons[buttonIndex].text = this.$t("button.showExtraFields");
      }
    },

    onClickChangePatitioningTableState() {
      this.isShownDivideAmountTable = !this.isShownDivideAmountTable;
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-wrapper {
  @apply space-y-4;
}

.wrapper {
  @apply relative;
}

.repeated-datepicker {
  @apply mt-6;
}

.base-currency-icon {
  @apply flex items-center;
  @apply absolute top-0 right-4;
  @apply h-full cursor-pointer;

  &::v-deep g [fill] {
    @apply fill-current text-gray-500;
  }

  &:hover ::v-deep g [fill] {
    @apply text-gray-700 duration-300;
  }
}

.account-select-company {
  @apply text-sm text-gray-500;
}
</style>
