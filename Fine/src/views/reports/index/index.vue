<template>
  <OurPage width="2xl" class="reports">
    <div v-for="(link, index) in links" :key="index" class="reports-wrapper">
      <h2 class="reports-title">{{ link.headline }}</h2>

      <div class="reports-cards">
        <SectionCard v-for="(item, id) in link.items" :key="id" :item="item" />
      </div>
    </div>
  </OurPage>
</template>

<script>
import SectionCard from "@/components/SectionCard";
import i18n from "@/plugins/vue-i18n";

const LINKS = [
  {
    headline: i18n.t("title.report._"),
    items: [
      {
        title: i18n.t("title.report.cashFlow._"),
        route: "CashFlowReports",
        description: i18n.t("description.cashFlowReport"),
      },
      {
        title: i18n.t("title.report.profit._"),
        route: "ProfitReports",
        description: i18n.t("description.profitReport"),
      },
      {
        title: i18n.t("title.report.receivables._"),
        route: "ReceivablesReports",
        description: i18n.t("description.receivablesReport"),
      },
      {
        title: i18n.t("title.report.payables._"),
        route: "PayablesReports",
        description: i18n.t("description.payablesReport"),
      },
      {
        title: i18n.t("title.report.project._"),
        route: "ProjectReports",
        description: i18n.t("description.projectReport"),
      },
      {
        title: i18n.t("title.report.balance._"),
        route: "",
        description: i18n.t("description.balanceReport"),
        isFutureSection: true,
      },
    ],
  },
];

export default {
  components: {
    SectionCard,
  },

  data: () => ({
    links: LINKS,
  }),
};
</script>

<style lang="postcss" scoped>
.reports {
  &::v-deep {
    .page-header {
      @apply mb-0;
    }
  }

  &-wrapper {
    @apply mt-12;

    &:first-child {
      @apply mt-0;
    }
  }

  &-title {
    @apply mb-6 text-4xl font-medium text-base-dark;
  }

  &-cards {
    @apply grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-2 md:gap-6;
  }
}
</style>
