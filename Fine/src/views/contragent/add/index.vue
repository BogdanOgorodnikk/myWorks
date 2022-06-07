<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.setting.contragent.add')" width="md">
    <ContragentForm ref="contragentForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.add')" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToContragentList"
      />
    </template>
  </OurPage>
</template>

<script>
import ContragentForm from "../_components/ContragentForm";
import { mapActions } from "vuex";
import router from "@/router";

export default {
  components: {
    ContragentForm,
  },

  data: () => ({
    form: {
      type: "",
      name: "",
      taxNumber: "",
      comment: "",
      bx24EntityId: "",
    },
  }),

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.contragent.list"),
        name: "ContragentList",
      };
    },
  },

  methods: {
    ...mapActions("contragent", ["addContragent"]),

    onClickBackToContragentList() {
      router.push({ name: "ContragentList" });
    },

    async onSubmitForm() {
      this.$refs.contragentForm.validate();

      if (this.form.isValid) {
        await this.addContragent(this.form);
      }
    },
  },
};
</script>
