<template>
  <canvas :id="id" width="400" height="400"></canvas>
</template>

<script>
import Chart from "chart.js/auto";
import { getRandomId } from "@ilevel/our.service.ui";

export default {
  props: {
    chartdata: {
      type: Object,
      default() {
        return {};
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data: () => ({
    graph: null,
    id: `chartline_${getRandomId()}`,
  }),

  mounted() {
    const ctx = document.querySelector(`#${this.id}`);

    this.graph = new Chart(ctx, {
      type: "line",
      data: this.chartdata,
      options: this.options,
    });
  },
  beforeDestroy() {
    this.graph.destroy();
  },
};
</script>
