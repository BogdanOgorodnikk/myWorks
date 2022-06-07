<template>
  <div class="form-wrapper" data-cy="transfer-form">
    <OurCard>
      <OurMoneyInput
        v-if="isDownloadedData"
        ref="moneyInput"
        v-model="form.money"
        :type="moneyInputType"
        :separated-initial-currency="isSeparatedMoneyInput"
        :error="moneyError"
        :base-currency-symbol="baseCurrency.currentSymbol"
        positive-only
      />

      <BankAccountSelect
        v-model="form.intoAccount"
        data-cy="into-account-select"
        :error="intoAccountError"
        :label="$t('label.intoAccount')"
        class="account-select"
        :options="bankAccountsFrom"
        @change="onChangeAccount('into')"
      />

      <BankAccountSelect
        v-model="form.fromAccount"
        data-cy="from-account-select"
        :error="fromAccountError"
        :label="$t('label.fromAccount')"
        class="account-select"
        :options="bankAccountsInto"
        @change="onChangeAccount('from')"
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
        :label="$t('label.transferDate')"
        data-cy="transfer-datepicker"
      >
        <template #right>
          <OurCheckbox
            v-model="form.isConfirmedPaymentDay"
            :label="$t('label.confirmed')"
            data-cy="transfer-datepicker-checkbox"
          />
        </template>
      </OurDatePicker>

      <OurSelect
        v-if="isShownSetCategory"
        v-model="form.categoryId"
        :label="$t('label.category')"
        :options="transferCategories"
        data-cy="category-select"
        class="category-select"
      />

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

    <OurCard v-if="isShownExtraFields" data-cy="extra-fields-form">
      <OurSelect
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
import { mapState, mapActions, mapGetters } from "vuex";
import { CATEGORY_ACTIVITIES } from "@/api/category";
import { required } from "vuelidate/lib/validators";
import { getUnixTime } from "date-fns";

import BankAccountSelect from "@/components/BankAccountSelect";

const SET_CATEGORY = "setCategory";
const SHOW_EXTRA_FIELDS = "showExtraFields";
const MONEY_TYPE_SINGLE = "single";
const MONEY_TYPE_CONVERTIBLE = "convertible";

export default {
  components: {
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
  },

  data() {
    return {
      isDownloadedData: false,
      isShownSetCategory: false,
      isShownExtraFields: false,
      form: {
        id: "",
        money: {
          initialCurrency: {
            symbol: " ",
            sum: "",
          },
          convertibleCurrency: {
            symbol: "",
            sum: "",
          },
          firstRate: {
            symbol: " ",
            sum: "",
          },
          secondRate: {
            symbol: " ",
            sum: "",
          },
        },
        fromAccount: "",
        intoAccount: "",
        paymentDate: 0,
        isConfirmedPaymentDay: false,
        tags: [],
        categoryId: "",
        description: "",
        project: "",
        counterpartyId: "",
        accrualDate: 0,
        isConfirmedAccrualDay: false,
        isRepeated: false,
        repeat: "",
        stopRepeat: 0,
        expenseCategoryId: "",
        incomeCategoryId: "",
      },
      buttons: [
        {
          text: this.$t("button.setCategory"),
          iconName: "Edit",
          name: SET_CATEGORY,
          isShown: true,
        },
        {
          text: this.$t("button.showExtraFields"),
          iconName: "Other2",
          name: SHOW_EXTRA_FIELDS,
          isShown: true,
        },
      ],
    };
  },

  validations() {
    return {
      form: {
        money: {
          initialCurrency: { sum: { required } },
        },
        fromAccount: { required },
        intoAccount: { required },
      },
    };
  },

  computed: {
    ...mapState("bankAccount", ["accounts"]),

    ...mapGetters("category", ["categoriesByType", "defaultCategories"]),
    ...mapGetters("tag", ["tagsForSelect"]),
    ...mapGetters("project", ["projectsForSelect"]),
    ...mapGetters("currency", ["currencyRate"]),
    ...mapGetters("bankAccount", ["bankAccountsGroupedByCompanies"]),
    ...mapGetters("settings", ["baseCurrency"]),

    moneyError() {
      const isDirty = this.$v.form.money.initialCurrency.sum.$dirty;
      const isFilled = this.$v.form.money.initialCurrency.sum.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    fromAccountError() {
      const isDirty = this.$v.form.fromAccount.$dirty;
      const isFilled = this.$v.form.fromAccount.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    intoAccountError() {
      const isDirty = this.$v.form.intoAccount.$dirty;
      const isFilled = this.$v.form.intoAccount.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    transferCategories() {
      return this.categoriesByType(CATEGORY_ACTIVITIES.transfer);
    },

    isShownDivideAmountTable: {
      get() {
        return this.divideTable;
      },
      set(value) {
        this.$emit("update:divideTable", value);
      },
    },

    moneyInputType() {
      return this.form.money.initialCurrency.symbol ===
        this.form.money.convertibleCurrency.symbol || !this.form.money.convertibleCurrency.symbol
        ? MONEY_TYPE_SINGLE
        : MONEY_TYPE_CONVERTIBLE;
    },

    isSeparatedMoneyInput() {
      return (
        this.form.money.convertibleCurrency.symbol &&
        this.form.money.convertibleCurrency.symbol !== this.baseCurrency.currentSymbol &&
        this.form.money.initialCurrency.symbol &&
        this.form.money.initialCurrency.symbol !== this.baseCurrency.currentSymbol
      );
    },

    bankAccountsFrom() {
      return this.prepareBankAccountsForSelect(this.form.fromAccount);
    },

    bankAccountsInto() {
      return this.prepareBankAccountsForSelect(this.form.intoAccount);
    },

    defaultCategory() {
      return this.defaultCategories.transfer.id;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    this.isShownDivideAmountTable = false;

    await Promise.all([
      this.getProjects(),
      this.getTags(),
      this.getCategories(),
      this.getAccounts(),
      this.getCompanies(),
    ]);

    await this.prefillForm();

    this.$refs.moneyInput.$refs.input.$refs.initialCurrency.focus();
  },

  methods: {
    ...mapActions("project", ["getProjects"]),
    ...mapActions("tag", ["getTags"]),
    ...mapActions("category", ["getCategories"]),
    ...mapActions("bankAccount", ["getAccounts"]),
    ...mapActions("currency", ["getCurrencyRate"]),
    ...mapActions("company", ["getCompanies"]),

    prepareBankAccountsForSelect(accountId) {
      return this.bankAccountsGroupedByCompanies.map((group) => {
        const preparedAccounts = group.accounts.map((account) => {
          return {
            company: account.company,
            $isDisabled: account.id === accountId,
            id: account.id,
            label: account.label,
          };
        });

        return {
          company: group.company,
          accounts: preparedAccounts,
        };
      });
    },

    async prefillForm() {
      const defaultBankAccount = this.accounts.find((account) => account);
      const bankAccountFrom = this.value.fromAccount
        ? this.accounts.find((account) => account.id === this.value.fromAccount)
        : "";
      const bankAccountTo =
        this.value.bankAccountId && this.value.bankAccountId !== this.value.fromAccount
          ? this.accounts.find((account) => account.id === this.value.bankAccountId)
          : "";

      await this.getAccountCurrencyRate([
        this.value?.currencyIdTo || bankAccountTo?.currency?.id || defaultBankAccount.currency.id,
      ]);

      const rateToAccount = this.currencyRate({
        timestamp: getUnixTime(new Date()),
        id:
          this.value?.currencyIdTo || bankAccountTo?.currency?.id || defaultBankAccount.currency.id,
      });

      if (this.value?.currencyIdFrom || bankAccountFrom) {
        await this.getAccountCurrencyRate([
          this.value?.currencyIdFrom || bankAccountFrom?.currency?.id,
        ]);

        const rateFromAccount = this.currencyRate({
          timestamp: getUnixTime(new Date()),
          id: this.value?.currencyIdFrom || bankAccountFrom?.currency?.id,
        });

        this.form.money.firstRate.placeholder = String(rateFromAccount);
      }

      this.form.money.initialCurrency.sum =
        this.value.sumTo || this.value?.money?.initialCurrency?.sum
          ? String(this.value.sumTo || this.value?.money?.initialCurrency?.sum)
          : "";
      this.form.money.initialCurrency.symbol =
        this.value.symbolTo ||
        this.value?.money?.initialCurrency?.symbol ||
        defaultBankAccount.currency.symbol;

      this.form.money.convertibleCurrency.sum = this.value.sumFrom
        ? String(this.value.sumFrom)
        : "";
      this.form.money.convertibleCurrency.symbol =
        this.value.symbolFrom || bankAccountFrom?.currency?.symbol || "";

      if (
        this.value.symbolFrom === this.baseCurrency.currentSymbol ||
        bankAccountFrom?.currency?.symbol === this.baseCurrency.currentSymbol
      ) {
        this.form.money.firstRate.symbol =
          this.value.symbolTo || this.value?.money?.initialCurrency?.symbol;
        this.form.money.firstRate.placeholder = String(rateToAccount);
        this.form.money.firstRate.sum = this.value.rateTo || "";
      } else {
        this.form.money.firstRate.symbol =
          this.value.symbolFrom || bankAccountFrom?.currency?.symbol || "";
        this.form.money.firstRate.sum = this.value.rateFrom || "";
      }

      this.form.money.secondRate.sum = this.value.rateTo || "";
      this.form.money.secondRate.placeholder = String(rateToAccount);
      this.form.money.secondRate.symbol =
        this.value.symbolTo || bankAccountTo?.currency?.symbol || "";

      const valueCategory = this.transferCategories.find(
        (item) => item.id === this.value.categoryId
      );

      this.form.id = this.value.id;
      this.form.intoAccount =
        this.value.bankAccountToId || this.value.bankAccountId || defaultBankAccount.id;

      const preparedValueFromAccount =
        this.value.fromAccount && this.value.bankAccountId !== this.value.fromAccount
          ? this.value.fromAccount
          : "";

      this.form.fromAccount = this.value.bankAccountFromId || preparedValueFromAccount;
      this.form.paymentDate = this.value.paymentDate || getUnixTime(new Date());
      this.form.isConfirmedPaymentDay = this.value.isConfirmedPaymentDay;
      this.form.tags = this.value?.tags || [];
      this.form.categoryId =
        valueCategory?.id || this.value.transferCategoryId || this.defaultCategory;
      this.form.description = this.value.description;
      this.form.project = this.value.project;
      this.form.counterpartyId = this.value.counterpartyId;
      this.form.repeat = this.value.repeat;
      this.form.isRepeated = this.value.isRepeated || false;
      this.form.stopRepeat = this.value.stopRepeat;
      this.form.accrualDate = this.value.accrualDate;
      this.form.isConfirmedAccrualDay = this.value.isConfirmedAccrualDay;
      this.form.expenseCategoryId = this.value.expenseCategoryId;
      this.form.incomeCategoryId = this.value.incomeCategoryId;

      this.isDownloadedData = true;

      if (this.form.categoryId && this.form.categoryId !== this.defaultCategory) {
        this.changeMoreButtonState(SET_CATEGORY);
      }

      if (this.form.tags.length) {
        this.changeMoreButtonState(SHOW_EXTRA_FIELDS);
      }
    },

    async onChangeAccount(accountType) {
      const account = {
        into: this.accounts.find((account) => account.id === this.form.intoAccount),
        from: this.accounts.find((account) => account.id === this.form.fromAccount),
      };

      await this.getAccountCurrencyRate([account.into.currency.id, account.from.currency.id]);

      const currencyRate = {
        intoAccount: account.into
          ? this.currencyRate({ timestamp: getUnixTime(new Date()), id: account.into.currency.id })
          : "",
        fromAccount: account.from
          ? this.currencyRate({ timestamp: getUnixTime(new Date()), id: account.from.currency.id })
          : "",
      };

      if (accountType === "into") {
        this.form.money.initialCurrency.symbol = account.into?.currency?.symbol || "";
      } else {
        this.form.money.convertibleCurrency.symbol = account.from.currency.symbol;
      }

      if (this.form.money.initialCurrency.symbol === this.baseCurrency.currentSymbol) {
        this.form.money.firstRate.symbol = account.from?.currency?.symbol || "";
        this.form.money.firstRate.placeholder = String(currencyRate?.fromAccount) || "";
      } else if (this.isSeparatedMoneyInput) {
        this.form.money.secondRate = {
          symbol: account.into?.currency?.symbol || "",
          placeholder: String(currencyRate?.intoAccount) || "",
          label: this.$t("label.rate"),
        };

        this.form.money.firstRate.symbol = account.from?.currency?.symbol || "";
        this.form.money.firstRate.placeholder = String(currencyRate?.fromAccount) || "";
      } else {
        this.form.money.firstRate.symbol = account.into?.currency?.symbol || "";
        this.form.money.firstRate.placeholder = String(currencyRate?.intoAccount) || "";
      }
    },

    async getAccountCurrencyRate(accountCurrencyIds) {
      const params = {
        currencyIds: accountCurrencyIds,
        timestamp: getUnixTime(new Date()),
      };

      await this.getCurrencyRate(params);
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;
      form.transferCategoryId = this.form.categoryId;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },

    changeMoreButtonState(name) {
      if (name === SET_CATEGORY) {
        this.isShownSetCategory = true;
      }

      if (name === SHOW_EXTRA_FIELDS) {
        this.isShownExtraFields = true;
      }

      this.buttons.forEach((item) => {
        if (item.name === name) {
          item.isShown = false;
        }
      });
    },

    onClickMoreButton(name) {
      this.changeMoreButtonState(name);

      if (name === SET_CATEGORY) {
        this.$nextTick(() => {
          document.querySelector(".category-select  .multiselect__input").focus();
        });
      }

      if (name === SHOW_EXTRA_FIELDS) {
        setTimeout(() => {
          document.querySelector(".project-select  .multiselect__input").focus();
        }, 0);
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.form-wrapper {
  @apply space-y-4;
}
</style>
