<template>
  <canvas :id="id" width="400" height="400"></canvas>
</template>

<script>
import Chart from "chart.js/auto";
import { getRandomId } from "@ilevel/our.service.ui";

const verticalinePlugin = {
  id: "verticalLine",
  afterDraw: function (chartInstance) {
    let xScale = chartInstance.scales["x"];
    let canvas = chartInstance.canvas;
    let ctx = chartInstance.ctx;
    let index;
    let line;
    let xValue;

    if (chartInstance.config._config.options.verticalLine) {
      for (index = 0; index < chartInstance.config._config.options.verticalLine.length; index++) {
        line = chartInstance.config._config.options.verticalLine[index];
        xValue = xScale.getPixelForValue(line.x);
        ctx.lineWidth = line.lineWidth || 2;

        if (xValue) {
          ctx.beginPath();
          ctx.moveTo(xValue, 0);
          ctx.lineTo(xValue, canvas.height - 18);
          ctx.strokeStyle = line.style;
          ctx.stroke();
        }

        if (line.text) {
          ctx.fillStyle = line["text-style"];
          ctx.font = line["font-style"];
          ctx.fillText(line.text, xValue + ctx.lineWidth - 60, 10);
        }
      }

      return;
    }
  },
};

Chart.register(verticalinePlugin);

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
    id: `chartbar_${getRandomId()}`,
  }),

  mounted() {
    const ctx = document.querySelector(`#${this.id}`);

    this.graph = new Chart(ctx, {
      type: "bar",
      data: this.chartdata,
      options: this.options,
    });
  },
  beforeDestroy() {
    this.graph.destroy();
  },
};
</script>
