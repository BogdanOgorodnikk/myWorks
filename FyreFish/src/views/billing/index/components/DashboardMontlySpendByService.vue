<template>
  <OurCard class="card">
    <div class="card-title">{{ $t("page.bill.monthlySpendService") }}</div>
    <PieChart class="card-chart" :chartdata="chartData" :options="chartOptions" />
  </OurCard>
</template>

<script>
import PieChart from "@/components/PieChart";

export default {
  components: {
    PieChart,
  },

  data: () => ({
    chartData: {
      labels: ["Business Internet - 250 Mbps", "Standard Business Voice"],
      datasets: [
        {
          label: "Montly Spend",
          backgroundColor: ["#FFDC67", "#F7B385"],
          data: [90, 180],
        },
      ],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  }),
};
</script>

<style lang="postcss" scoped>
.card {
  @apply h-80 space-y-4;

  &-title {
    @apply text-lg font-medium text-base-dark;
  }
  &-chart {
    @apply relative h-64;
  }
}
</style>
