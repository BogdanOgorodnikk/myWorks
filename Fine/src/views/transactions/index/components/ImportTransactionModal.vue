<template>
  <OurPageModal
    v-model="isShownModal"
    class="modal-head"
    width="md"
    :title="$t('title.importTransaction')"
  >
    <ImportTransactionForm ref="importTransactionForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.imports')" @click="onSubmitForm" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>
  </OurPageModal>
</template>

<script>
import ImportTransactionForm from "./ImportTransactionForm";
import { importTransactionFile } from "@/api/transaction";
import DataService from "@/services/data.service";

export default {
  components: {
    ImportTransactionForm,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    onClickCloseModal() {
      this.isShownModal = false;
    },

    async onSubmitForm() {
      this.$refs.importTransactionForm.validate();

      if (this.form.isValid) {
        const importData = {
          file: this.form.file,
          bankAccountId: this.form.bankAccountId,
        };

        const formData = DataService.createFormData(importData);

        await importTransactionFile(formData);

        this.isShownModal = false;

        this.$emit("importTransactions");
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.modal-head {
  @apply mt-0 !important;
}
</style>
