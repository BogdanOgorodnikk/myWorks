<template>
  <OurPage :title="$t('title.setting.account.edit')" width="lg" :back-route="backRouteParams">
    <OurCard class="card-margin">
      <OurInput v-model="form.name" :label="$t('label.name')" :error="accountNameError" />

      <OurInput v-model="form.currency" disabled :label="$t('label.currency')" />

      <OurMoneyInput v-model="form.startingBalance" :error="startBalanceError" />

      <OurSelect
        v-model="form.companyId"
        :label="$t('label.company')"
        :options="companiesForSelect"
        :error="companyError"
      />

      <OurExpandButton :buttons="buttons">
        <template slot-scope="{ button }">
          <OurExpandButtonItem
            v-if="button.isShown"
            :text="button.text"
            :icon-name="button.iconName"
            @click="onClickMoreButton(button.name)"
          />
        </template>
      </OurExpandButton>
    </OurCard>

    <OurCard v-if="integratedAccount" class="card-margin">
      <div class="bank-description">
        <BankInfo
          bank="monobankPersonal"
          :bank-title="$t('label.monoBankPersonal')"
          bank-account="*00999"
          :action="$t('label.cancelIntegration')"
          @сlickTakeAction="onClickCancelIntegrationWithBank"
        />

        <div class="bank-update-date">
          <div class="bank-update-date-wrapper">
            <div class="bank-update-date-title">{{ $t("label.lastUpdated") }}</div>
            <div class="bank-update-date-title">{{ lastIntegrationUpdate }}</div>
          </div>
          <OurSvgIcon
            class="bank-update-date-icon"
            name="Update"
            @click="onClickUpdateAccountIntegration"
          />
        </div>
      </div>

      <OurDatePicker :label="$t('label.startLoadTransactionsFrom')">
        <template #icon>
          <OurSvgIcon name="Time-schedule" color="gray" class="datepicker-icon" />
        </template>
      </OurDatePicker>

      <OurTextarea
        :label="$t('label.stopWords')"
        :placeholder="$t('placeholder.stopWords')"
        :description="$t('description.stopWords')"
      />
    </OurCard>

    <OurCard v-if="isShownSettingImportFileFormat" class="setting-import-File">
      <OurHint>
        <h3>{{ $t("page.setting.account.settingImportFileFormListTitle") }}</h3>

        <ul>
          <li>{{ $t("page.setting.account.rowNumberInTheTableStartingFrom") }}</li>
          <li>{{ $t("page.setting.account.sheetNumberOnWhichTheDataIsLocated") }}</li>
          <li>{{ $t("page.setting.account.statementDateFormat") }}</li>
        </ul>

        <router-link to="/">{{ $t("page.setting.account.readInstruction") }}</router-link>
      </OurHint>

      <OurRow>
        <OurRow>
          <OurInput
            v-model="form.initialRow"
            :label="$t('label.line')"
            :placeholder="importFileDateFormat.line"
          />

          <OurInput
            v-model="form.importPage"
            :label="$t('label.sheet')"
            :placeholder="importFileDateFormat.letter"
          />
        </OurRow>

        <OurInput
          v-model="form.dateFormat"
          :label="$t('label.dateFormat')"
          :placeholder="importFileDateFormat.dateFormat"
        />
      </OurRow>

      <OurRow v-if="isSelectedOperationTypeField">
        <OurInput
          v-model="form.debitWord"
          :label="$t('label.expenseType')"
          :placeholder="$t('placeholder.expenseType')"
        />

        <OurInput
          v-model="form.creditWord"
          :label="$t('label.incomeType')"
          :placeholder="$t('placeholder.incomeType')"
        />
      </OurRow>

      <OurTextarea
        v-model="form.ignoredColumns"
        :label="$t('label.stopWords')"
        :placeholder="$t('placeholder.stopWords')"
        :description="$t('description.stopWords')"
      />

      <OurHint>
        <p class="description">
          {{ $t("page.setting.account.setColumnsInTheSameOrderAsInYourImportFile") }}
        </p>

        <router-link to="/">{{ $t("page.setting.account.readInstruction") }}</router-link>
      </OurHint>

      <div class="setting-import-file-format-wrapper">
        <div class="setting-import-file-format-columns">
          <div class="setting-import-file-format-columns-title">
            {{ $t("page.setting.account.availableColumns") }}
          </div>

          <ImportFieldsSettingList
            ref="availableColumn"
            group="import-file-format"
            :list="availableColumn"
            class="available-column"
            pull="clone"
            @sort="onSortAvailableColumn"
            @move="onMoveAvailableColumn"
            @end="onEndAvailableColumn"
          />
        </div>
        <div class="setting-import-file-format-columns">
          <div class="setting-import-file-format-columns-title">
            {{ $t("page.setting.account.yourFileColumns") }}
          </div>

          <div
            v-if="!isMovingImportField && !selectedColumn.length"
            class="setting-import-selected-column-wrapper"
          >
            <OurSvgIcon
              class="setting-import-selected-column-icon"
              name="DownloadedFile"
              size="lg"
              color="gray-light"
            />

            <div class="setting-import-selected-column-description">
              {{ $t("description.dragImportFieldColumn") }}
            </div>
          </div>

          <ImportFieldsSettingList
            group="import-file-format"
            :list="selectedColumn"
            sort
            put
            @sort="onSortSelectedColumn"
          />
        </div>
      </div>
    </OurCard>

    <DeleteModal v-model="isShownModal" delay-success-notify :item="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onClickEditAccount" />
      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToAccountList" />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary">
        <div @click="onClickDeleteAccount">{{ $t("button.delete") }}</div>
      </OurDropdown>
    </template>
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import { IMPORT_FIELDS } from "@/api/transaction";
import NotifyService from "@/services/notify.service";

import router from "@/router";
import BankInfo from "../_components/BankInfo";
import ImportFieldsSettingList from "./components/ImportFieldsSettingList";
import DeleteModal from "../delete/Modal";
import {
  getIntegrationAccounts,
  updateIntegrationAccount,
  stopIntegrationAccount,
} from "@/api/bankAccount";
import { fromUnixTime, format } from "date-fns";
import { enGB, ru, uk } from "date-fns/locale";
import I18nServiceDefault from "@ilevel/our.service.i18n";

const SETTING_FORMAT_FILE_IMPORT = "settingFormatFileImport";
const SEPARATOR = ",";

export default {
  components: {
    ImportFieldsSettingList,
    BankInfo,
    DeleteModal,
  },

  data() {
    return {
      isShownSettingImportFileFormat: false,
      isShownModal: false,
      selectedColumn: [],
      isMovingImportField: false,
      integratedAccount: null,
      importFileDateFormat: {
        line: "",
        letter: "",
        dateFormat: "",
      },
      form: {
        name: "",
        startingBalance: {
          initialCurrency: {
            sum: 0,
            label: this.$t("label.startBalance"),
            placeholder: this.$t("placeholder.startBalance"),
            symbol: "",
          },
        },
        companyId: "",
        creditWord: "",
        debitWord: "",
        currency: "",
      },
      buttons: [
        {
          text: this.$t("button.settingFormatFileImport"),
          iconName: "Import",
          name: SETTING_FORMAT_FILE_IMPORT,
          isShown: true,
        },
      ],
      availableColumn: [],
    };
  },

  validations: {
    form: {
      name: { required },
      startingBalance: { initialCurrency: { sum: { required } } },
      companyId: { required },
    },
  },

  computed: {
    ...mapState("bankAccount", ["account"]),
    ...mapState("settings", ["settings"]),

    ...mapGetters("company", ["companiesForSelect"]),
    ...mapGetters("currency", ["currencyLabel"]),

    accountNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    startBalanceError() {
      const isDirty = this.$v.form.startingBalance.initialCurrency.sum.$dirty;
      const isFilled = this.$v.form.startingBalance.initialCurrency.sum.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    companyError() {
      const isDirty = this.$v.form.companyId.$dirty;
      const isFilled = this.$v.form.companyId.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    preparedImportFields() {
      return [
        {
          name: this.$t("label.sum"),
          description: this.$t("description.sumField"),
          code: IMPORT_FIELDS.sum.name,
          isRequired: IMPORT_FIELDS.sum.isRequired,
        },
        {
          name: this.$t("label.paidIn"),
          description: this.$t("description.paidIn"),
          code: IMPORT_FIELDS.paidIn.name,
          isRequired: IMPORT_FIELDS.paidIn.isRequired,
        },
        {
          name: this.$t("label.paidOut"),
          description: this.$t("description.paidOut"),
          code: IMPORT_FIELDS.paidOut.name,
          isRequired: IMPORT_FIELDS.paidOut.isRequired,
        },
        {
          name: this.$t("label.paymentDate"),
          description: this.$t("description.paymentDate"),
          code: IMPORT_FIELDS.paymentDate.name,
          isRequired: IMPORT_FIELDS.paymentDate.isRequired,
        },
        {
          name: this.$t("label.description"),
          description: this.$t("description.description"),
          code: IMPORT_FIELDS.description.name,
          isRequired: IMPORT_FIELDS.description.isRequired,
        },
        {
          name: this.$t("label.skip"),
          description: this.$t("description.skip"),
          code: IMPORT_FIELDS.skip.name,
          isRequired: IMPORT_FIELDS.skip.isRequired,
        },
        {
          name: this.$t("label.category"),
          description: this.$t("description.categoryField"),
          code: IMPORT_FIELDS.category.name,
          isRequired: IMPORT_FIELDS.category.isRequired,
        },
        {
          name: this.$t("label.accrualDate"),
          description: this.$t("description.accrualDate"),
          code: IMPORT_FIELDS.accrualDate.name,
          isRequired: IMPORT_FIELDS.accrualDate.isRequired,
        },
        {
          name: this.$t("label.accrualConfirmed"),
          description: this.$t("description.accrualConfirmed"),
          code: IMPORT_FIELDS.accrualConfirmed.name,
          isRequired: IMPORT_FIELDS.accrualConfirmed.isRequired,
        },
        {
          name: this.$t("label.paymentConfirmed"),
          description: this.$t("description.paymentConfirmed"),
          code: IMPORT_FIELDS.paymentConfirmed.name,
          isRequired: IMPORT_FIELDS.paymentConfirmed.isRequired,
        },
        {
          name: this.$t("label.operationType"),
          description: this.$t("description.operationType"),
          code: IMPORT_FIELDS.operationType.name,
          isRequired: IMPORT_FIELDS.operationType.isRequired,
        },
        {
          name: this.$t("label.rate"),
          description: this.$t("description.rate"),
          code: IMPORT_FIELDS.rate.name,
          isRequired: IMPORT_FIELDS.rate.isRequired,
        },
      ];
    },

    isSelectedOperationTypeField() {
      return !!this.selectedColumn.find((item) => item.code === IMPORT_FIELDS.operationType.name);
    },

    backRouteParams() {
      return {
        title: this.$t("title.setting.account.list"),
        name: "AccountList",
      };
    },

    lastIntegrationUpdate() {
      const date = fromUnixTime(this.integratedAccount.updatedAt);
      const activeLocalization = I18nServiceDefault.getActiveLanguage();
      const localization = {
        en: enGB,
        ru: ru,
        ua: uk,
      };

      return format(date, `dd MMMM yyyy '${this.$t("label.in")}' HH:mm`, {
        locale: localization[activeLocalization],
      });
    },
  },

  watch: {
    account: {
      handler: "onChangeAccount",
      deep: true,
    },

    availableColumn: {
      handler: "onChangeAvailableColumn",
      deep: true,
    },
  },

  async created() {
    const companyId = this.$route.params.id;

    await Promise.all([this.getAccount(companyId), this.getCompanies()]);
  },

  methods: {
    ...mapActions("bankAccount", ["getAccount", "updateAccount"]),
    ...mapActions("company", ["getCompanies"]),

    onSortSelectedColumn() {
      const selectedColumn = [...this.selectedColumn];

      this.selectedColumn = [];

      this.$nextTick(() => {
        this.selectedColumn = [...selectedColumn];
      });
    },

    async onChangeAccount(account) {
      const integratedAccounts = await getIntegrationAccounts();

      this.integratedAccount = integratedAccounts.find((item) => item.bankAccountId === account.id);

      this.openFileSettingsAfterPageRendering();

      this.form.id = account.id;
      this.form.name = account.name;
      this.form.startingBalance.initialCurrency.sum = account.startingBalance;
      this.form.companyId = account.company.id;
      this.form.initialRow = account.settings?.initialRow;
      this.form.importPage = account.settings?.importPage;
      this.form.dateFormat = account.settings?.dateFormat;
      this.form.ignoredColumns = account.settings?.ignoredColumns?.join(SEPARATOR);
      this.form.startingBalance.initialCurrency.symbol = account.currency?.symbol;
      this.form.creditWord = account.settings?.creditWord || "";
      this.form.debitWord = account.settings?.debitWord || "";
      this.form.currency = this.currencyLabel(account.currency);

      this.selectedColumn =
        account.settings?.importFields?.map((item) => {
          const field = this.preparedImportFields.find((field) => field.code === item);

          return {
            name: field.name,
            code: item,
            description: field.description,
          };
        }) || [];

      this.preparedImportFields.forEach((item) => {
        const isSelectedField = this.selectedColumn.find((field) => field.code === item.code);

        if (!isSelectedField || item.code === IMPORT_FIELDS.skip.name) {
          this.availableColumn.push(item);
        }
      });

      if (
        this.form.initialRow ||
        this.form.importPage ||
        this.form.dateFormat ||
        this.form.ignoredColumns ||
        this.selectedColumn.length
      ) {
        this.changeMoreButtonState(SETTING_FORMAT_FILE_IMPORT);
      }
    },

    openFileSettingsAfterPageRendering() {
      const isNeedOpenSettings = this.$route.query.openSettings;

      if (isNeedOpenSettings) {
        this.changeMoreButtonState(SETTING_FORMAT_FILE_IMPORT);

        this.$nextTick(() => {
          const settingImportFileElement = document.querySelector(".setting-import-File");
          const settingElementPosition = settingImportFileElement.getBoundingClientRect();

          window.scrollTo({ top: settingElementPosition.top });
        });
      }
    },

    async onClickEditAccount() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      const selectedColumnCode = this.selectedColumn.map((item) => {
        return item.code;
      });

      let preparedForm = {
        id: this.account.id,
        startingBalance: this.form.startingBalance.initialCurrency.sum,
        name: this.form.name,
        companyId: this.form.companyId,
        currencyId: this.account.currency.id,
      };

      if (selectedColumnCode.length) {
        const isSelectedPadInInField = this.selectedColumn.find(
          (item) => item.code === IMPORT_FIELDS.paidIn.name
        );
        const isSelectedPaidOutInField = this.selectedColumn.find(
          (item) => item.code === IMPORT_FIELDS.paidOut.name
        );
        const isSelectedSumField = this.selectedColumn.find(
          (item) => item.code === IMPORT_FIELDS.sum.name
        );
        const isSelectedPaymentDateField = this.selectedColumn.find(
          (item) => item.code === IMPORT_FIELDS.paymentDate.name
        );
        const isSelectedDescriptionField = this.selectedColumn.find(
          (item) => item.code === IMPORT_FIELDS.description.name
        );

        if (!isSelectedPaymentDateField) {
          const errorCode = "missingColumnPaymentDate";

          NotifyService.error(errorCode);

          return;
        } else if (!isSelectedDescriptionField) {
          const errorCode = "missingColumnDescription";

          NotifyService.error(errorCode);

          return;
        } else if (
          (isSelectedPadInInField && !isSelectedPaidOutInField) ||
          (!isSelectedPadInInField && isSelectedPaidOutInField)
        ) {
          const errorCode = "missingColumnSumPlusOrMinus";

          NotifyService.error(errorCode);

          return;
        } else if (!isSelectedSumField && !isSelectedPadInInField && !isSelectedPaidOutInField) {
          const errorCode = "missingColumnSum";

          NotifyService.error(errorCode);

          return;
        }

        preparedForm = {
          ...preparedForm,
          settings: {
            importPage: this.form.importPage,
            initialRow: this.form.initialRow,
            dateFormat: this.form.dateFormat,
            ignoredColumns: this.form?.ignoredColumns?.split(SEPARATOR),
            importFields: selectedColumnCode,
            creditWord: this.form.creditWord,
            debitWord: this.form.debitWord,
          },
        };
      }

      await this.updateAccount(preparedForm);

      await router.push({ name: "AccountList" });
    },

    onClickBackToAccountList() {
      router.push({ name: "AccountList" });
    },

    changeMoreButtonState(name) {
      if (name === SETTING_FORMAT_FILE_IMPORT) {
        this.isShownSettingImportFileFormat = true;
      }

      this.buttons.forEach((item) => {
        if (item.name === name) {
          item.isShown = false;
        }
      });
    },

    onClickMoreButton(name) {
      this.changeMoreButtonState(name);
    },

    onChangeAvailableColumn() {
      this.availableColumn.forEach((item) => {
        const isSelectedColumn = this.selectedColumn.find((column) => column.code === item.code);

        if (!isSelectedColumn) {
          const [blockElement] = this.$refs.availableColumn?.$refs?.[item.code] || "";

          blockElement?.classList?.remove("disabled");
        }
      });
    },

    onSortAvailableColumn() {
      this.$nextTick(() => {
        this.availableColumn = [];

        this.$nextTick(() => {
          this.preparedImportFields.forEach((item) => {
            const isSelectedField = this.selectedColumn.find((field) => field.code === item.code);

            if (!isSelectedField || item.code === IMPORT_FIELDS.skip.name) {
              this.availableColumn.push(item);
            }
          });

          const selectedColumnCodes = this.selectedColumn.map((item) => {
            return item.code;
          });

          const hasSum = selectedColumnCodes.includes(IMPORT_FIELDS.sum.name);
          const hasPaidIn = selectedColumnCodes.includes(IMPORT_FIELDS.paidIn.name);
          const hasPaidOut = selectedColumnCodes.includes(IMPORT_FIELDS.paidOut.name);
          const hasOperationType = selectedColumnCodes.includes(IMPORT_FIELDS.operationType.name);

          const setNotDraggableClass = () => {
            if (hasSum || hasOperationType) {
              const [paidInElement] = this.$refs.availableColumn?.$refs.paidIn || "";
              const [paidOutElement] = this.$refs.availableColumn?.$refs.paidOut || "";

              paidInElement?.classList.add("disabled");
              paidOutElement?.classList.add("disabled");
            } else if (hasPaidIn || hasPaidOut) {
              const [sumElement] = this.$refs.availableColumn?.$refs.sum || "";
              const [operationTypeElement] = this.$refs.availableColumn?.$refs.operationType || "";

              sumElement?.classList.add("disabled");
              operationTypeElement?.classList.add("disabled");
            }
          };

          this.$nextTick(setNotDraggableClass);
        });
      });
    },

    onMoveAvailableColumn() {
      this.isMovingImportField = true;
    },

    onEndAvailableColumn() {
      this.isMovingImportField = false;
    },

    async onClickCancelIntegrationWithBank() {
      await stopIntegrationAccount(this.integratedAccount.id);
    },

    async onClickUpdateAccountIntegration() {
      await updateIntegrationAccount(this.integratedAccount.id);
    },

    onConfirmDeleteAccount() {
      return false;
    },

    onClickDeleteAccount() {
      this.isShownModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.card-margin {
  @apply mb-4;
}

.input-icon {
  @apply text-base font-medium text-base-dark;
  @apply block;
  @apply bg-gray-50;
  @apply rounded-r-lg border border-gray-300;
  @apply h-full w-full;

  &-symbol {
    @apply absolute inset-y-1/3;
    @apply pl-4;
  }
}

.icon {
  @apply mr-3;

  &::v-deep g [fill] {
    @apply fill-current text-gray-500;
  }
}

.bank {
  &-description {
    @apply flex justify-between;
    @apply p-4;
    @apply rounded-lg bg-gray-100;
  }

  &-update-date {
    @apply flex items-center;

    &-wrapper {
      @apply flex flex-col items-center;
      @apply mr-3;
    }

    &-title {
      @apply text-xs font-normal text-gray-500;
    }

    &-icon {
      @apply rounded-lg border border-base-dark;
      @apply py-2 px-2.5;
      @apply cursor-pointer;
    }
  }
}

.datepicker-icon {
  @apply absolute top-0 right-0 p-4;
}

.setting {
  &-import {
    &-file-format {
      &-wrapper {
        @apply flex justify-between;
        @apply space-x-5;
      }

      &-columns {
        @apply rounded-2xl border border-dashed border-gray-300;
        @apply w-full p-5;
        @apply relative overflow-hidden;

        &:last-child {
          @apply bg-gray-50;
        }

        &-title {
          @apply text-lg font-bold text-gray-500;
          @apply mb-6;
        }
      }
    }

    &-selected-column {
      &-wrapper {
        @apply absolute left-0 px-4;
        @apply text-center;
      }

      &-icon {
        @apply mb-4 opacity-30;
      }

      &-description {
        @apply text-xs font-normal text-gray-400;
      }
    }
  }
}

::v-deep .disabled {
  @apply cursor-not-allowed opacity-40;
}

.available-column {
  &::v-deep {
    .item-column-skip {
      @apply my-6;
    }
  }
}
</style>
