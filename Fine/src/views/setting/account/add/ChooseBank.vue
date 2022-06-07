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
        :title="$t('page.setting.account.whichBankIsTheAccountOpenedWith')"
      />

      <OurRadioCard v-model="form.bankCode" name="account-type" :options="options">
        <template #icon="{ item }">
          <OurSvgIcon v-if="item.iconName" :name="item.iconName" size="xl" class="icon" />

          <BankIcon v-else :bank="item.bank" />
        </template>
      </OurRadioCard>
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
import { mapMutations, mapState } from "vuex";
import { BANK_CODES } from "@/api/bankAccount";

import BankIcon from "@/components/BankIcon";

export default {
  name: "AddAccountChooseBank",

  components: {
    BankIcon,
  },

  data() {
    return {
      step: 2,
      totalSteps: 6,
      form: {
        bankCode: BANK_CODES.monobankPersonal,
      },
      options: [
        {
          title: this.$t("label.monoBank"),
          description: this.$t("description.businessAccountOrPersonalCard"),
          value: BANK_CODES.monobankPersonal,
          bank: BANK_CODES.monobankPersonal,
        },
        {
          title: this.$t("label.privatBank"),
          description: this.$t("description.privatBankBusiness"),
          value: BANK_CODES.privatBusiness,
          bank: BANK_CODES.privatBusiness,
        },
        {
          title: this.$t("label.privatBank"),
          description: this.$t("description.privatBankPersonal"),
          value: BANK_CODES.privatPersonal,
          bank: BANK_CODES.privatPersonal,
        },
        {
          title: this.$t("label.otherAccount"),
          description: this.$t("description.businessAccountOrPersonalCard"),
          value: BANK_CODES.other,
          iconName: "Safe",
        },
      ],
    };
  },

  computed: {
    ...mapState("bankAccount", ["account"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },
  },

  async created() {
    this.prefillForm();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillForm() {
      this.form.bankCode = this.account?.bankCode || BANK_CODES.monobankPersonal;
      this.form.accountType = this.account?.accountType;
      this.form.accountName = this.account?.accountName;
      this.form.accountCompanyId = this.account?.accountCompanyId;
    },

    onClickBackToPreviousStep() {
      this.$router.push({ name: "AccountAdd" });
    },

    onClickGoToNextStep() {
      const bankCode = this.form.bankCode;
      const accountType = this.form.accountType;

      this.SET_ACCOUNT(this.form);

      if (accountType === "cashless" && bankCode === BANK_CODES.monobankPersonal) {
        this.$router.push({ name: "AddAccountIntegrationMonoBank" });
      } else if (accountType === "cashless" && bankCode === BANK_CODES.privatPersonal) {
        this.$router.push({ name: "AddAccountIntegrationPrivatPersonal" });
      } else if (accountType === "cashless" && bankCode === BANK_CODES.privatBusiness) {
        this.$router.push({ name: "AddAccountIntegrationPrivatBusiness" });
      } else if (accountType === "cashless" && bankCode === BANK_CODES.other) {
        this.$router.push({ name: "AddAccountIntegrationWithOtherBank" });
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.icon ::v-deep g [fill] {
  @apply fill-current text-blue-500;
}
</style>
