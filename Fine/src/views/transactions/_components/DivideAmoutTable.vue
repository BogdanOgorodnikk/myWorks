<template>
  <div class="main-wrapper">
    <div class="divide-amount-table">
      <div class="table">
        <div class="table-head">
          <div class="table-head-item table-head-item-sum">{{ $t("label.amount") }}</div>
          <div class="table-head-item table-head-item-percent">%</div>
          <div v-if="accrualDate" class="table-head-item table-head-item-payment">
            {{ $t("label.accrued") }}
          </div>
          <div v-if="accrualDate" class="table-head-item table-head-item-info">
            <OurSvgIcon
              name="Info-circle"
              class="info-icon"
              size="xs"
              :tooltip="$t('label.confirmed')"
            />
          </div>
          <div class="table-head-item">
            {{ $t("label.project") }}
          </div>
          <div class="table-head-item">
            {{ $t("label.category") }}
          </div>
          <div class="table-head-item">
            {{ $t("label.counteragent") }}
          </div>
        </div>

        <div class="table-body">
          <div v-for="(item, index) in tableItems" :key="index" class="table-body-row">
            <div class="table-body-row-item table-body-row-item-sum">
              <OurMoneyInput
                v-model="item.amount"
                class="table-money-input table-money-input-sum"
                type="single"
                hide-label
                positive-only
                @keyup="onKeyupCalculateNumbers(index, amountType)"
              />
            </div>
            <div class="table-body-row-item table-body-row-item-percent">
              <OurMoneyInput
                v-model="item.percent"
                hide-label
                type="single"
                class="table-money-input"
                positive-only
                @keyup="onKeyupCalculateNumbers(index, percentType)"
              />
            </div>

            <div v-if="accrualDate" class="table-body-row-item table-body-row-item-payment">
              <OurDatePicker
                v-model="item.accrualDate"
                class="table-datepicker"
                :custom-date-format="dateFormat"
                :placeholder="$t('placeholder.notSpecified')"
              />
            </div>
            <div v-if="accrualDate" class="table-body-row-item table-body-row-item-info">
              <OurCheckbox
                v-model="item.accrualConfirmed"
                size="sm"
                class="payment-date-checkbox"
              />
            </div>
            <div class="table-body-row-item table-body-row-item-select">
              <OurSelect
                v-model="item.projectId"
                class="table-select"
                :options="preparedProjects"
                :placeholder="$t('placeholder.notSelected')"
                @open="onOpenSelect(index)"
              />
            </div>
            <div class="table-body-row-item table-body-row-item-select">
              <OurSelect
                v-model="item.categoryId"
                :options="categoriesForSelect"
                group-label="category"
                group-values="subCategories"
                class="table-select"
                @open="onOpenSelect(index)"
              />
            </div>
            <div class="table-body-row-item table-body-row-item-select">
              <OurSelect
                v-model="item.counterpartyId"
                class="table-select"
                :options="preparedCountragents"
                :placeholder="$t('placeholder.notSelected')"
                @open="onOpenSelect(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-buttons-wrapper">
      <div class="table-buttons" @click="onClickAddTableItem">
        {{ $t("button.addMore") }}
      </div>
      <div class="table-buttons">
        {{ $t("button.customize") }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

const DATE_FORMAT = "d.m.Y";
const AMOUNT_TYPE = "amount";
const PERCENT_TYPE = "percent";
const MIN_AMOUNT = 0;
const MAX_PERCENT = 100;

export default {
  props: {
    accrualDate: {
      type: Boolean,
      default: false,
    },
    generalAmount: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => {},
    },
    transactionType: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      dateFormat: DATE_FORMAT,
      tableItems: [],
      amountType: AMOUNT_TYPE,
      percentType: PERCENT_TYPE,
    };
  },

  computed: {
    ...mapState("project", ["projects"]),
    ...mapState("contragent", ["contragents"]),

    ...mapGetters("category", ["nestedCategoriesForSelect", "defaultCategories"]),
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    categoriesForSelect() {
      return this.nestedCategoriesForSelect(this.transactionType);
    },

    preparedProjects() {
      return this.projects.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },

    preparedCountragents() {
      return this.contragents.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },

    defaultCategory() {
      return this.defaultCategories[this.transactionType].id;
    },
  },

  watch: {
    generalAmount() {
      this.tableItems.forEach((item, index) => {
        this.calculateNumbers(index, PERCENT_TYPE);
      });
    },

    transactionType: "onChangeTransactionType",

    tableItems: {
      handler: "onChangeTableItems",
      deep: true,
    },
  },

  async created() {
    await Promise.all([this.getProjects(), this.getContragents(), this.getCategories()]);

    await this.prefillTableItems();
  },

  methods: {
    ...mapActions("project", ["getProjects"]),
    ...mapActions("contragent", ["getContragents"]),
    ...mapActions("category", ["getCategories"]),

    onOpenSelect(index) {
      this.setSelectMenuPosition(index);
    },

    setSelectMenuPosition(rowIndex) {
      if (this.isMobileDevice) {
        this.$nextTick(() => {
          const itemHeight = 38;
          const startPosition = 62;

          const menu = document.querySelector(".multiselect--active .multiselect__content-wrapper");
          const newPosition = itemHeight * rowIndex + startPosition;

          menu.style.top = `${newPosition}px`;
        });
      }
    },

    onChangeTableItems(items) {
      const preparedItems = items.map((item) => ({
        sum: item.amount?.initialCurrency?.sum || "",
        categoryId: item.categoryId || "",
        counterpartyId: item.counterpartyId || null,
        accrualDate: item.accrualDate || null,
        accrualConfirmed: item.accrualConfirmed || false,
        projectId: item.projectId || null,
      }));

      this.$emit("input", preparedItems);
    },

    prefillTableItems() {
      if (this.value.length) {
        this.tableItems = this.value.map((item) => {
          const percentInAmount = (item.sum / this.generalAmount) * MAX_PERCENT;

          return {
            amount: {
              initialCurrency: {
                sum: item.sum,
              },
            },
            percent: {
              initialCurrency: {
                sum: percentInAmount,
              },
            },
            categoryId: item.categoryId,
            counterpartyId: item.counterpartyId || "",
            accrualDate: item.accrualDate || null,
            accrualConfirmed: item.accrualConfirmed || false,
            projectId: item.projectId || "",
          };
        });
      } else {
        this.tableItems.push(
          {
            categoryId: this.form?.categoryId || this.defaultCategory,
            accrualConfirmed: this.form?.isConfirmedAccrualDay || false,
            accrualDate: this.form?.accrualDate || null,
            projectId: this.form.project,
            counterpartyId: this.form.counterpartyId,
          },
          {
            categoryId: this.form?.categoryId || this.defaultCategory,
            accrualConfirmed: this.form?.isConfirmedAccrualDay || false,
            accrualDate: this.form?.accrualDate || null,
            projectId: this.form.project,
            counterpartyId: this.form.counterpartyId,
          }
        );
      }
    },

    onChangeTransactionType() {
      this.tableItems.forEach((item) => {
        item.categoryId = this.defaultCategory;
      });
    },

    onClickAddTableItem() {
      this.tableItems.push({
        categoryId: this.form?.categoryId || this.defaultCategory,
        accrualConfirmed: this.form?.isConfirmedAccrualDay || false,
        accrualDate: this.form?.accrualDate || null,
        projectId: this.form.project,
        counterpartyId: this.form.counterpartyId,
      });
    },

    calculateCurrentGeneralAmount() {
      let currentAmount = this.generalAmount;

      this.tableItems.forEach((item) => {
        currentAmount -= item.amount.initialCurrency.sum;
      });

      return currentAmount;
    },

    calculateCurrentPercent() {
      let currentPercent = 0;

      this.tableItems.forEach((item) => {
        currentPercent += Number(item.percent.initialCurrency.sum);
      });

      return currentPercent;
    },

    calculateNumbers(index, type) {
      const currentAmount = this.calculateCurrentGeneralAmount();
      const currentPercent = this.calculateCurrentPercent();

      if (type === AMOUNT_TYPE) {
        if (currentAmount < MIN_AMOUNT) {
          this.tableItems[index].amount.initialCurrency.sum -= -currentAmount;
        }

        const amountInPercent = this.tableItems[index].amount.initialCurrency.sum * MAX_PERCENT;

        if (amountInPercent && this.generalAmount) {
          this.tableItems[index].percent.initialCurrency.sum = amountInPercent / this.generalAmount;
        }
      }

      if (type === PERCENT_TYPE) {
        if (currentPercent > MAX_PERCENT) {
          this.tableItems[index].percent.initialCurrency.sum =
            MAX_PERCENT - (currentPercent - this.tableItems[index].percent.initialCurrency.sum);
        }

        const percentInAmount = this.tableItems[index].percent.initialCurrency.sum / MAX_PERCENT;

        if (percentInAmount && this.generalAmount) {
          this.tableItems[index].amount.initialCurrency.sum = this.generalAmount * percentInAmount;
        }
      }
    },

    onKeyupCalculateNumbers(index, type) {
      this.calculateNumbers(index, type);
    },
  },
};
</script>

<style lang="postcss" scoped>
.table {
  @apply w-250 md:w-full;

  &-head {
    @apply flex;

    &-item {
      @apply text-sm font-normal text-gray-500;
      @apply pl-4 pb-2;
      @apply w-full;

      &-sum {
        @apply flex-none;
        @apply w-28;
      }

      &-percent {
        @apply flex-none;
        width: 4.5rem;
      }

      &-payment {
        @apply w-auto flex-none pr-0.5;
        @apply w-24;
      }

      &-info {
        @apply w-auto flex-none pr-5 pl-5;
      }
    }
  }

  &-body {
    @apply rounded-lg border border-gray-300;

    &-row {
      @apply flex items-center;
      @apply border-b border-gray-300;

      &:last-child {
        @apply border-b-0;
      }

      &-item {
        @apply border-r border-gray-300;
        @apply px-4 py-2;
        @apply w-full;

        &::v-deep {
          .multiselect-wrapper {
            @apply static md:relative;

            .multiselect__content-wrapper {
              @apply left-0 md:-left-3 !important;
            }
          }
        }

        &:last-child {
          @apply border-r-0;
        }

        &-sum {
          @apply flex-none;
          @apply border-r-0 pr-0;
          @apply w-28;
        }

        &-percent {
          @apply flex-none;
          width: 4.5rem;
        }

        &-payment {
          @apply w-auto flex-none;
          @apply border-r-0 pr-0;
        }

        &-info {
          @apply w-auto flex-none pl-3.5;
        }

        &-select {
          @apply min-w-0 flex-1;
          @apply pr-0;
        }
      }
    }
  }
}

.payment-date-checkbox {
}

.info-icon {
  @apply block;

  &::v-deep g [fill] {
    @apply fill-current text-gray-500;
  }
}

.table-datepicker {
  @apply w-[5.25rem];
}

.table-datepicker::v-deep div .datepicker div .input {
  @apply rounded-none border-0 p-0 ring-0;
}

.table-select::v-deep {
  .multiselect-wrapper {
    @apply rounded-none border-0;

    &:focus-within {
      @apply border-0 ring-0;
    }

    .multiselect {
      @apply items-center;
      @apply pt-0;

      .multiselect-caret {
        @apply mt-0;
        @apply h-5;
      }

      .multiselect__tags {
        @apply w-4/5 overflow-hidden;
        @apply p-0;

        .multiselect__single {
          @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
        }
      }

      .multiselect__content-wrapper {
        @apply -top-2 -left-3 mt-0 md:mt-10;
        @apply w-max min-w-full;
      }
    }
  }
}

.table-money-input::v-deep {
  .money {
    @apply rounded-none border-0 p-0;

    &:focus-within {
      @apply ring-0;
    }

    .base-currency {
      .money-input {
        @apply pr-0;
      }
    }
  }
}

.table-money-input-sum {
  @apply border-r border-gray-300;
  @apply pr-4;
}

.table-buttons {
  @apply text-xs font-normal text-gray-500;
  @apply border-b border-dashed border-gray-500;
  @apply cursor-pointer;

  &-wrapper {
    @apply flex;
    @apply space-x-4;
    @apply mt-3 ml-4;
  }
}

.divide-amount-table {
  @apply overflow-x-scroll md:overflow-x-visible;
}

.main-wrapper {
  @apply relative;
}
</style>
