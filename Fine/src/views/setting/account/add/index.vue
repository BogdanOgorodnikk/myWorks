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
        :title="$t('page.setting.account.whatAccountYouWantToAdd')"
      />

      <OurRadioCard v-model="form.accountType" name="account-type" :options="options" />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToAccountList" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.continue')" @click="onClickGoToNextStep" />
    </template>
  </OurPage>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "AccountAdd",

  data() {
    return {
      step: 1,
      totalSteps: 6,
      form: {
        accountType: "cashless",
      },
      options: [
        {
          title: this.$t("label.cashless"),
          description: this.$t("description.cashless"),
          value: "cashless",
          iconName: "Credit-card",
        },
        {
          title: this.$t("label.cash"),
          description: this.$t("description.cash"),
          value: "cash",
          iconName: "Money",
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

  created() {
    this.prefillForm();
  },

  methods: {
    ...mapMutations("bankAccount", ["SET_ACCOUNT"]),

    prefillForm() {
      this.form.accountType = this.account?.accountType || "cashless";
    },

    onClickBackToAccountList() {
      this.SET_ACCOUNT();

      this.$router.push({ name: "AccountList" });
    },

    onClickGoToNextStep() {
      this.SET_ACCOUNT(this.form);

      this.form.accountType === "cash"
        ? this.$router.push({ name: "AddAccountCash" })
        : this.$router.push({ name: "AddAccountChooseBank" });
    },
  },
};
</script>
