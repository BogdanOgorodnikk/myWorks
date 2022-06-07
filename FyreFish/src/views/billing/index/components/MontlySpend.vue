<template>
  <OurCard class="card">
    <div class="card-title">{{ $t("page.bill.monthlySpend") }}</div>
    <BarChart class="card-chart" :chartdata="chartData" :options="chartOptions" />
  </OurCard>
</template>

<script>
import BarChart from "@/components/BarChart";

export default {
  components: {
    BarChart,
  },
  data: () => ({
    chartData: {
      labels: ["Nov", "Dec", "Jan", "Feb"],
      datasets: [
        {
          label: "Montly Spend",
          barPercentage: 0.5,
          backgroundColor: ["#4472C4", "#4472C4", "#4472C4", "#E2F0D9"],
          data: [0, 0, 90, 290],
        },
      ],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      verticalLine: [
        {
          x: 2.5,
          style: "#ff0000",
          text: "Previous     Next",
          "text-style": "#494949",
          lineWidth: 2,
          "font-style": "bold",
        },
      ],
      plugins: {
        legend: {
          display: false,
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
