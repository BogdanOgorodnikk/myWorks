<template>
  <div>
    <OurPage width="wide">
      <div class="dashboard-title">{{ $t("title.kaperProperty") }}</div>

      <div class="property-wrapper">
        <OurCard class="card card-property">
          <div class="card-title">{{ $t("label.property") }}</div>

          <div class="card-property-image" />
          <div class="card-title">Fake Commere</div>

          <div class="card-property-wrapper">
            <div class="card-property-wrapper-content">
              <div>Accepting Tenants</div>
              <div class="card-property-wrapper-switch">
                <OurSwitch v-model="isActivedAcceptingTenant" with-text size="lg" variant="green" />
              </div>
            </div>
          </div>
        </OurCard>

        <div class="card-double-wrapper">
          <OurCard class="card card-double">
            <div class="card-title">{{ $t("label.occupancyByunits") }}</div>
            <LineChart
              class="card-chart"
              :chartdata="chartDataOccByUnits"
              :options="chartOptionsOccByUnits"
            />
          </OurCard>
          <OurCard class="card card-double">
            <div class="card-title">{{ $t("label.occupancyBySqFt") }}</div>
            <LineChart
              class="card-chart"
              :chartdata="chartDataOccBySqFt"
              :options="chartOptionsOccBySqFt"
            />
          </OurCard>
        </div>

        <div class="card-double-wrapper">
          <OurCard class="card card-double">
            <div class="card-title">{{ $t("label.propertyManager") }}</div>
            <div class="property-manager-wrapper">
              <div class="left-border" />
              <div class="property-manager-block">
                <div class="title">Mike Rapelle</div>
                <OurLink
                  text="pmanager@maildrop.cc"
                  url="`mailto:pmanager@maildrop.cc"
                  size="md"
                  variant="thirdary"
                />
                <div class="phonenumber">+1 303 236 9234</div>
              </div>
              <div class="right-border" />
            </div>
          </OurCard>
          <OurCard class="card card-double">
            <div class="property-announcement-title-wrapper">
              <div class="card-title">{{ $t("label.announcements") }}</div>
              <div class="card-cross">+</div>
            </div>
            <perfect-scrollbar class="perfect-scrollbar" :class="theme">
              <div class="property-announcement-content-wrapper">
                <div class="date">01/22</div>
                <div class="text">Fire Alarm Testing February</div>
                <div class="link">View</div>
              </div>
              <div class="property-announcement-content-wrapper">
                <div class="date">01/04</div>
                <div class="text">Recycling route changes</div>
                <div class="link">View</div>
              </div>
            </perfect-scrollbar>
          </OurCard>
        </div>

        <div class="card-double-wrapper">
          <OurCard class="card card-double">
            <div class="card-title">{{ $t("label.buildings") }}</div>
            <div class="property-buildings-wrapper">
              <div class="left-border" />
              <div class="property-buildings-block">
                <div class="property-buildings-block-image" />
                <div class="property-buildings-block-right">
                  <div class="title">Fake Commerce Plaza</div>
                  <div class="description">100 W Walnut St</div>
                  <div class="description">Pasadena CA, 91100</div>
                </div>
              </div>
              <div class="right-border" />
            </div>
          </OurCard>
        </div>
        <OurCard class="card card-double-size">
          <div class="card-title">{{ $t("label.unitsAndLocations") }}</div>
          <div class="card-table-wrapper">
            <table class="table-auto">
              <thead class="head">
                <tr>
                  <th class="left first-line">{{ $t("page.property.name") }}</th>
                  <th class="right first-line">{{ $t("page.property.sqft") }}</th>
                  <th class="right first-line">{{ $t("page.property.status") }}</th>
                </tr>
              </thead>
              <tbody class="body">
                <tr>
                  <td class="left first-line">Lobby</td>
                  <td class="right first-line">N/A</td>
                  <td class="right first-line medium">Admin</td>
                </tr>
                <tr>
                  <td class="left">Telco Room</td>
                  <td class="right">N/A</td>
                  <td class="right medium">Admin</td>
                </tr>
                <tr>
                  <td class="left">100</td>
                  <td class="right">5100</td>
                  <td class="right medium">Occupied</td>
                </tr>
                <tr>
                  <td class="left">150</td>
                  <td class="right">9400</td>
                  <td class="right medium">Occupied</td>
                </tr>
                <tr>
                  <td class="left">200</td>
                  <td class="right">2000</td>
                  <td class="right medium">Occupied</td>
                </tr>
                <tr>
                  <td class="left">210</td>
                  <td class="right">2200</td>
                  <td class="right medium">Vacant</td>
                </tr>
                <tr>
                  <td class="left">220</td>
                  <td class="right">2800</td>
                  <td class="right medium">Vacant</td>
                </tr>
                <tr>
                  <td class="left">250</td>
                  <td class="right">8000</td>
                  <td class="right medium">Occupied</td>
                </tr>
              </tbody>
            </table>
          </div>
        </OurCard>

        <OurCard class="card">
          <div class="card-table-title-wrapper">
            <div class="card-title">{{ $t("label.tenants") }}</div>
            <div class="card-cross">+</div>
          </div>
          <div class="card-table-wrapper">
            <table class="table-auto">
              <thead class="head">
                <tr>
                  <th class="left first-line">{{ $t("page.property.tenant") }}</th>
                  <th class="left first-line">{{ $t("page.property.unit") }}</th>
                  <th class="right first-line">{{ $t("page.property.contact") }}</th>
                </tr>
              </thead>
              <tbody class="body">
                <tr>
                  <td class="left first-line">Lobby</td>
                  <td class="left first-line">100</td>
                  <td class="first-line medium">Jennifer Reality</td>
                </tr>
                <tr>
                  <td class="left">Husky Benefits</td>
                  <td class="left">150</td>
                  <td class="medium">Mikel Rappaport</td>
                </tr>
                <tr>
                  <td class="left">Fleece Linings Inc</td>
                  <td class="left">200</td>
                  <td class="medium">Lynn Martin</td>
                </tr>
                <tr>
                  <td class="left">Dante Consulting</td>
                  <td class="left">250</td>
                  <td class="medium">Dante Alghen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </OurCard>
      </div>
    </OurPage>
  </div>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";
import { getTheme } from "@ilevel/our.service.ui";
import { mapState } from "vuex";
import LineChart from "@/components/LineChart";
import tailwindConfig from "@/../tailwind.config.js";

export default {
  components: {
    LineChart,
  },

  data() {
    return {
      chartOptionsOccByUnits: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxHeight: 1,
            },
          },
          title: {
            display: false,
            text: "",
          },
        },
      },
      chartDataOccByUnits: {
        labels: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
        ],
        datasets: [
          {
            label: "Occupied",
            data: [1, 2, 3, 5, 1, 3, 2, 1, 2, 3, 4, 5],
            backgroundColor: tailwindConfig.theme.colors.base["bright-green"],
            borderColor: tailwindConfig.theme.colors.base["bright-green"],
          },
          {
            label: "unoccupied",
            data: [5, 4, 2, 3, 4, 8, 4, 1, 6, 4, 1, 2],
            backgroundColor: tailwindConfig.theme.colors.base["bright-orange"],
            borderColor: tailwindConfig.theme.colors.base["bright-orange"],
          },
        ],
      },
      chartOptionsOccBySqFt: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxHeight: 1,
            },
          },
          title: {
            display: false,
            text: "",
          },
        },
      },
      chartDataOccBySqFt: {
        labels: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
        ],
        datasets: [
          {
            label: "Occupied",
            data: [1, 2, 3, 5, 1, 3, 2, 1, 2, 3, 4, 5],
            backgroundColor: tailwindConfig.theme.colors.base["bright-green"],
            borderColor: tailwindConfig.theme.colors.base["bright-green"],
          },
          {
            label: "unoccupied",
            data: [5, 4, 2, 3, 4, 8, 4, 1, 6, 4, 1, 2],
            backgroundColor: tailwindConfig.theme.colors.base["bright-orange"],
            borderColor: tailwindConfig.theme.colors.base["bright-orange"],
          },
        ],
      },
      isActivedAcceptingTenant: true,
      isActivedAutopay: true,
    };
  },

  computed: {
    ...mapState("user", ["userLogin"]),

    theme() {
      return getTheme();
    },
  },
};
</script>

<style lang="postcss" scoped>
.left-border {
  @apply absolute z-30;
  @apply rounded-l-lg bg-accent;
  @apply h-full w-3.5;
  @apply left-0;
}
.right-border {
  @apply absolute right-0 top-0 z-20;
  @apply rounded-r-lg bg-accent;
  @apply h-full w-3.5;
}

.dashboard {
  &-title {
    @apply text-4xl font-medium text-base-dark;
    @apply mb-11;
  }
}

.property-wrapper {
  @apply mt-6 grid grid-cols-3 gap-x-2 gap-y-4;

  .card-property {
    @apply relative h-96;

    &-image {
      @apply h-32 w-full bg-gray-100 bg-cover bg-center bg-no-repeat;
      background-image: url(/src/assets/images/building.jpg);
    }

    &-wrapper {
      @apply absolute bottom-4 left-0 w-full px-4;

      &-content {
        @apply flex items-center;
      }
      &-switch {
        @apply ml-auto;
      }
    }
  }
  .card-double-wrapper {
    @apply flex flex-col justify-between;

    .perfect-scrollbar {
      @apply h-24;
    }
    .property-manager-wrapper {
      @apply relative flex;
    }
    .property-buildings-wrapper {
      @apply relative flex;
    }
    .property-manager-block {
      @apply relative z-40 mx-1 w-full rounded-lg border border-gray-300 bg-gray-50 !p-4;

      .title {
        @apply text-lg font-medium;
      }
      .phonenumber {
        @apply text-gray-500;
      }
    }
    .property-announcement-title-wrapper {
      @apply flex;
    }
    .property-announcement-content-wrapper {
      @apply mb-4 flex;

      .date {
        @apply text-base font-bold;
      }
      .text {
        @apply ml-2 text-base;
      }
      .link {
        @apply ml-auto cursor-pointer text-base font-medium text-base-deep-red underline;
      }
    }
    .property-buildings-block {
      @apply relative z-40 mx-1 flex w-full rounded-lg bg-white;

      &-right {
        @apply ml-4 self-center;
      }
      &-image {
        @apply h-16 w-24 rounded-lg bg-gray-100 bg-cover bg-center bg-no-repeat;
        background-image: url(/src/assets/images/building.jpg);
      }
      .title {
        @apply text-sm font-medium;
      }
      .description {
        @apply text-xs;
      }
    }
  }
  .card-double {
    @apply h-[11.75rem];
  }
  .card-double-size {
    @apply h-96;
  }
}

.card {
  @apply h-80 space-y-4;

  .card-cross {
    @apply ml-auto cursor-pointer text-4xl leading-3 text-base-deep-red;
  }

  &-title {
    @apply text-lg font-medium text-base-dark;
  }

  &-wrapper {
    @apply space-y-2;
  }

  &-table {
    @apply flex flex-col justify-between;

    &-title-wrapper {
      @apply relative flex;
    }
    &-wrapper {
      .table-auto {
        @apply w-full;
      }
      .head {
        @apply border-b border-base-deep-red;
        .first-line {
          @apply pb-2;
        }
      }
      .first-line {
        @apply pt-2;
      }
      .left {
        @apply pr-4 text-left;
      }
      .right {
        @apply text-right;
      }
      .medium {
        @apply font-bold;
      }
    }

    &-title {
      @apply pr-4 text-base font-normal text-black;
    }
  }
}
</style>
