<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.setting.contragent.edit')" width="md">
    <ContragentForm ref="contragentForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToContragentList"
      />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary" data-cy="edit-contragent-dropdown">
        <div data-cy="dropdown-delete-button" @click="onClickDeleteContragent">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>

    <DeleteModal v-model="isShownModal" :item="form" />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";

import ContragentForm from "../_components/ContragentForm";
import DeleteModal from "../delete/Modal";

export default {
  components: {
    ContragentForm,
    DeleteModal,
  },

  data: () => ({
    form: {
      id: "",
      type: "",
      bx24EntityId: "",
      name: "",
      taxNumber: "",
      comment: "",
    },
    isShownModal: false,
  }),

  computed: {
    ...mapState("contragent", ["contragent"]),

    backRouteParams() {
      return {
        title: this.$t("title.setting.contragent.list"),
        name: "ContragentList",
      };
    },
  },

  watch: {
    contragent(contragent) {
      this.form.id = contragent.id;
      this.form.type = contragent.type;
      this.form.bx24EntityId = contragent.bx24EntityId;
      this.form.name = contragent.name;
      this.form.taxNumber = contragent.taxNumber;
      this.form.comment = contragent.comment;
    },
  },

  async created() {
    const contragentId = this.$route.params.id;

    await this.getContragent(contragentId);
  },

  methods: {
    ...mapActions("contragent", ["updateContragent", "getContragent"]),

    onClickBackToContragentList() {
      router.push({ name: "ContragentList" });
    },

    async onSubmitForm() {
      this.$refs.contragentForm.validate();

      const contragent = { id: this.contragent.id, ...this.form };

      if (this.form.isValid) {
        await this.updateContragent(contragent);
      }
    },

    onClickDeleteContragent() {
      this.isShownModal = true;
    },
  },
};
</script>
