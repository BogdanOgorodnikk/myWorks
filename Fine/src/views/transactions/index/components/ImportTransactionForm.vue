<template>
  <OurCard>
    <BankAccountSelect v-model="form.bankAccountId" :error="bankAccountError" />

    <OurFileInput :with-icon="false" :error="fileUploadError" @changeFiles="onChangeFiles">
      <OurTextBlock size="sm" align="center">
        <p>
          {{ $t("page.transactions.importModal.selectFile") }}
        </p>

        <p>
          {{ $t("page.transactions.importModal.importOpportunities") }}
        </p>
      </OurTextBlock>
    </OurFileInput>

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
</template>

<script>
import BankAccountSelect from "@/components/BankAccountSelect";
import { required } from "vuelidate/lib/validators";
import { getTransactionsImportTemplate } from "@/api/transaction";

const SETTINGS_TEMPLATE = "settingsTemplate";
const DOWNLOAD_TEMPLATE = "downloadTemplate";
const INSTRUCTIONS = "instructions";

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
      form: {
        bankAccountId: "",
        file: {},
      },
      buttons: [
        {
          text: this.$t("button.customiseTemplate"),
          iconName: "Settings4",
          name: SETTINGS_TEMPLATE,
          isShown: true,
        },
        {
          text: this.$t("button.downloadTemplate"),
          iconName: "Cloud-download",
          name: DOWNLOAD_TEMPLATE,
          isShown: true,
        },
        {
          text: this.$t("button.viewInstructions"),
          iconName: "Info-circle",
          name: INSTRUCTIONS,
          isShown: true,
        },
      ],
    };
  },

  validations: {
    form: {
      bankAccountId: { required },
      file: { required },
    },
  },

  computed: {
    bankAccountError() {
      const isDirty = this.$v.form.bankAccountId.$dirty;
      const isFilled = this.$v.form.bankAccountId.required;

      return isDirty && !isFilled ? this.$t("validation.required") : "";
    },

    fileUploadError() {
      const isDirty = this.$v.form.file.$dirty;
      const isFilled = this.$v.form.file.required;

      return isDirty && !isFilled ? this.$t("validation.requiredFile") : "";
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  methods: {
    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },

    onChangeFiles(files) {
      const [selectedFile] = files;

      this.form.file = selectedFile;
    },

    async onClickMoreButton(name) {
      if (name === SETTINGS_TEMPLATE) {
        this.$v.form.bankAccountId.$touch();

        if (this.form.bankAccountId) {
          const route = this.$router.resolve({
            name: "AccountEdit",
          });

          const bankAccountId = this.form.bankAccountId;
          const businessName = route.resolved.params.businessName;
          const routeHref = `/${businessName}/settings/accounts/${bankAccountId}?openSettings=true`;

          window.open(routeHref, "_blank");
        }
      }

      if (name === DOWNLOAD_TEMPLATE) {
        this.$v.form.bankAccountId.$touch();

        if (this.form.bankAccountId) {
          const { link } = await getTransactionsImportTemplate(this.form.bankAccountId);

          window.location.href = link;
        }
      }

      if (name === INSTRUCTIONS) {
        return;
      }
    },
  },
};
</script>
