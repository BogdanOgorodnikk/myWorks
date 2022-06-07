<template>
  <div class="role-form">
    <OurCard>
      <OurInput
        v-model="form.name"
        :label="$t('label.roleName')"
        :placeholder="$t('placeholder.roleName')"
        :error="roleNameError"
        data-cy="role-name-input"
      />

      <div class="switch-block">
        <div class="switch-wrapper">
          <div class="switch-title" :class="setSwitchTitleClasses(form.permission.money)">
            {{ $t("label.money") }}
          </div>

          <OurSwitch v-model="form.permission.money" data-cy="role-money-swich" />
        </div>

        <div class="switch-wrapper">
          <div class="switch-title" :class="setSwitchTitleClasses(form.permission.reports)">
            {{ $t("label.reports") }}
          </div>

          <OurSwitch v-model="form.permission.reports" data-cy="role-reports-swich" />
        </div>

        <div class="switch-wrapper">
          <div class="switch-title" :class="setSwitchTitleClasses(form.permission.settings)">
            {{ $t("label.settings") }}
          </div>

          <OurSwitch v-model="form.permission.settings" data-cy="role-settings-swich" />
        </div>
      </div>
    </OurCard>

    <OurCard v-if="form.permission.money">
      <div class="role-money-title">
        {{ $t("label.money") }}
      </div>

      <div class="role-money-permissions" data-cy="money-permissions-card">
        <OurCheckbox
          v-model="form.permission.transactionsView"
          :label="$t('label.view')"
          disabled
        />

        <OurCheckbox
          v-model="form.permission.transactionsEdit"
          :label="$t('label.edit')"
          data-cy="permission-transactions-edit-checkbox"
        />
        <OurCheckbox
          v-model="form.permission.transactionsDelete"
          :label="$t('label.delete')"
          data-cy="permission-transactions-delete-checkbox"
        />
        <OurCheckbox
          v-model="form.permission.transactionsExport"
          :label="$t('label.export')"
          data-cy="permission-transactions-export-checkbox"
        />
        <OurCheckbox
          v-model="form.permission.transactionsImport"
          :label="$t('label.import')"
          data-cy="permission-transactions-import-checkbox"
        />
      </div>

      <OurHint>
        {{ $t("description.roleSettings") }}
      </OurHint>

      <BankAccountSelect
        v-model="form.accounts"
        :label="$t('label.accounts')"
        :placeholder="$t('placeholder.allAccounts')"
        multiple
        data-cy="bank-account-select"
      />

      <OurMultiselect
        v-model="form.projects"
        :label="$t('label.projects')"
        :placeholder="$t('placeholder.allProjects')"
        :options="projectsForSelect"
        data-cy="projects-select"
      />

      <OurMultiselect
        v-model="form.categories"
        :label="$t('label.categories')"
        :placeholder="$t('placeholder.allCategories')"
        :options="categories"
        data-cy="categories-select"
      />

      <OurMultiselect
        v-model="form.tags"
        :label="$t('label.tags')"
        :placeholder="$t('placeholder.allTags')"
        :options="tagsForSelect"
        data-cy="tags-select"
      />
    </OurCard>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import BankAccountSelect from "@/components/BankAccountSelect";
import { mapActions, mapGetters } from "vuex";
import { PERMISSIONS } from "@/api/role";

export default {
  components: {
    BankAccountSelect,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isPrefilledForm: false,
      form: {
        name: "",
        permission: {
          money: false,
          reports: false,
          settings: false,
          transactionsView: true,
          transactionsEdit: false,
          transactionsDelete: false,
          transactionsExport: false,
          transactionsImport: false,
        },
        accounts: [],
        projects: [],
        categories: [],
        tags: [],
      },
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    ...mapGetters("project", ["projectsForSelect"]),
    ...mapGetters("category", ["categories"]),
    ...mapGetters("tag", ["tagsForSelect"]),
    ...mapGetters("bankAccount", ["bankAccountsForSelect"]),

    roleNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
    value: {
      handler: "onChangeValue",
      deep: true,
    },
  },

  async created() {
    await Promise.all([this.getProjects(), this.getCategories(), this.getTags(), this.getAccounts]);
  },

  methods: {
    ...mapActions("project", ["getProjects"]),
    ...mapActions("category", ["getCategories"]),
    ...mapActions("tag", ["getTags"]),
    ...mapActions("bankAccount", ["getAccounts"]),

    setSwitchTitleClasses(switchName) {
      return switchName ? "switch-title-active" : "";
    },

    onChangeValue() {
      if (!this.isPrefilledForm) {
        this.prefillForm();
      }
    },

    prefillForm() {
      this.form.name = this.value.name;
      this.form.accounts = this.value?.allowedAccounts || [];
      this.form.projects = this.value?.allowedProjects || [];
      this.form.categories = this.value?.allowedCategories || [];
      this.form.tags = this.value?.allowedTags || [];

      this.form.permission.reports = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.reports
      );
      this.form.permission.settings = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.settings
      );

      const isTransactionsView = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.transactions.view
      );

      this.form.permission.transactionsEdit = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.transactions.edit
      );
      this.form.permission.transactionsDelete = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.transactions.delete
      );
      this.form.permission.transactionsExport = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.transactions.export
      );
      this.form.permission.transactionsImport = !!this.value.permissions?.find(
        (item) => item === PERMISSIONS.transactions.import
      );

      this.form.permission.money =
        isTransactionsView ||
        this.form.permission.transactionsEdit ||
        this.form.permission.transactionsDelete ||
        this.form.permission.transactionsExport ||
        this.form.permission.transactionsImport;

      this.isPrefilledForm = true;
    },

    onChangeForm() {
      let permissions = [];

      if (this.form.permission.money) {
        permissions.push(PERMISSIONS.transactions.view);

        if (this.form.permission.transactionsEdit) {
          permissions.push(PERMISSIONS.transactions.edit);
        }

        if (this.form.permission.transactionsDelete) {
          permissions.push(PERMISSIONS.transactions.delete);
        }

        if (this.form.permission.transactionsExport) {
          permissions.push(PERMISSIONS.transactions.export);
        }

        if (this.form.permission.transactionsImport) {
          permissions.push(PERMISSIONS.transactions.import);
        }
      }

      if (this.form.permission.reports) {
        permissions.push(PERMISSIONS.reports);
      }

      if (this.form.permission.settings) {
        permissions.push(PERMISSIONS.settings);
      }

      let dataForSend = {
        name: this.form.name,
        permissions: permissions,
        isValid: !this.$v.$invalid,
      };

      if (this.form.permission.money) {
        dataForSend.allowedAccounts = this.form.accounts;
        dataForSend.allowedProjects = this.form.projects;
        dataForSend.allowedCategories = this.form.categories;
        dataForSend.allowedTags = this.form.tags;
      }

      this.$emit("input", dataForSend);
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>

<style lang="postcss" scoped>
.role {
  &-form {
    @apply space-y-4;
  }

  &-money {
    &-title {
      @apply text-2xl font-medium text-base-dark;
      @apply mb-8;
    }

    &-permissions {
      @apply grid grid-cols-3 grid-rows-1 gap-y-6 gap-x-8;
    }
  }
}

.switch {
  &-block {
    @apply space-y-4;
  }

  &-wrapper {
    @apply flex items-center justify-between;
  }

  &-title {
    @apply text-base font-medium text-gray-500;

    &-active {
      @apply text-base-dark;
    }
  }
}
</style>
