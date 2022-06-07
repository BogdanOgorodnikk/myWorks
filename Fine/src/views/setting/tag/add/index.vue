<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.tag.add')"
    width="md"
    data-cy="add-tag-page"
  >
    <TagForm ref="companyForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" data-cy="submit-button" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        data-cy="back-button"
        variant="secondary"
        @click="onClickBackToTagList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";

import router from "@/router";
import TagForm from "../_components/TagForm";

export default {
  name: "TagAdd",

  components: {
    TagForm,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.tag.list"),
        name: "TagList",
      };
    },
  },

  methods: {
    ...mapActions("tag", ["addTag"]),

    onClickBackToTagList() {
      router.push({ name: "TagList" });
    },

    async onSubmitForm() {
      this.$refs.companyForm.validate();

      if (this.form.isValid) {
        await this.addTag(this.form);
      }
    },
  },
};
</script>
