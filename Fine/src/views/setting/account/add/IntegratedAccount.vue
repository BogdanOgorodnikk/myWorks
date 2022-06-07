<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.account.add')"
    width="md"
    mobile-footer-reverse
  >
    <OurCard>
      <OurStepper
        :step="step"
        :total-steps="totalSteps"
        :title="$t('page.setting.account.enterYourAccountDetails')"
      />

      <BankInfo
        :bank="form.bankCode"
        :bank-title="form.bankCode"
        status-type="accepted"
        :status-title="$t('label.integrated')"
      />

      <OurRadioGroup
        v-model="form.accountId"
        name="accountId"
        :options="options"
        :label="$t('label.foundBankAccounts')"
      >
        <template #description="{ description }">
          <div class="account-description">
            <div>{{ description.currencyCode }}</div>

            <OurMoney :item="description" :integer="!isShownCents" />
          </div>
        </template>
      </OurRadioGroup>
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPreviousStep" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.continue')" @click="onClickGoToNextStep" />
    </template>
  </OurPage>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";
import MoneyService from "@/services/money.service";
import { getCurrenciesList } from "@/api/currency";
import { BANK_CODES } from "@/api/bankAccount";
import { CATEGORY_ACTIVITIES } from "@/api/category";

import BankInfo from "../_components/BankInfo";

export default {
  name: "AddAccountIntegratedAccount",

  components: {
    BankInfo,
  },

  data() {
    return {
      step: 4,
      totalSteps: 6,
      form: {
        accountId: "",
      },
      options: [],
      currencies: [],
    };
  },

  validations: {
    form: {
      accountId: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    ...mapGetters("settings", ["isShownCents"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },
  },

  async created() {
    this.prefillForm();

    this.currencies = await getCurrenciesList();

    this.prefillOptions();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillOptions() {
      this.options = this.form.accounts.map((item) => {
        return {
          value: item.accountId,
          title: this.preparedCardOrIban(item?.card || item.iban),
          currencyId: item.currency.id,
          description: {
            sum: item.balance,
            type: CATEGORY_ACTIVITIES.income,
            currencySymbol: this.selectCurrencySymbol(item.currency.code),
            currencyCode: `${item.currency.code} –`,
          },
        };
      });
    },

    preparedCardOrIban(value) {
      const firstValueCharacters = value.substring(0, 2);
      const isIban = !Number(firstValueCharacters);

      return isIban ? MoneyService.formatIban(value) : MoneyService.formatCardNumber(value);
    },

    selectCurrencySymbol(currencyCode) {
      const selectedCurrencySymbol = this.currencies.find(
        (currency) => currency.code === currencyCode
      );

      return selectedCurrencySymbol.symbol;
    },

    prefillForm() {
      this.account ? Object.assign(this.form, this.account) : this.form;
    },

    onClickBackToPreviousStep() {
      const bankCode = this.form.bankCode;
      const accountType = this.form.accountType;

      if (accountType === "cashless" && bankCode === BANK_CODES.monobankPersonal) {
        this.$router.push({ name: "AddAccountIntegrationMonoBank" });
      } else if (accountType === "cashless" && bankCode === BANK_CODES.privatPersonal) {
        this.$router.push({ name: "AddAccountIntegrationPrivatPersonal" });
      } else if (accountType === "cashless" && bankCode === BANK_CODES.privatBusiness) {
        this.$router.push({ name: "AddAccountIntegrationPrivatBusiness" });
      }
    },

    onClickGoToNextStep() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const selectedOption = this.options.find((item) => item.value === this.form.accountId);

      this.form.currencyId = selectedOption.currencyId;

      this.SET_ACCOUNT(this.form);

      this.$router.push({ name: "AddAccountImportAccountDataFromBank" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.account-description {
  @apply flex items-center;
  @apply text-xs font-bold text-gray-450;
  @apply pl-4 pt-1;

  &::v-deep {
    .money-block {
      @apply text-gray-450;
      @apply mb-0;

      .sum {
        @apply ml-0.5 text-xs;
      }
    }
  }
}
</style>
