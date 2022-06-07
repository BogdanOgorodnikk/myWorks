<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.category.add')"
    width="md"
    data-cy="add-categories-page"
  >
    <CategoryForm ref="categoryForm" v-model="form" />

    <template #footer-left>
      <OurButton data-cy="submit-button" :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton
        data-cy="back-button"
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToCategoryList"
      />
    </template>
  </OurPage>
</template>

<script>
import { mapActions } from "vuex";
import { ACTIVITY_TYPES } from "@/api/category";

import router from "@/router";
import CategoryForm from "../_components/CategoryForm";

export default {
  name: "CategoryAdd",

  components: {
    CategoryForm,
  },

  data() {
    return {
      form: {
        type: this.$route.query.type,
        activity: ACTIVITY_TYPES.operating,
      },
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.setting.category.list"),
        name: "CategoryList",
      };
    },
  },

  methods: {
    ...mapActions("category", ["addCategory"]),

    onClickBackToCategoryList() {
      router.push({ name: "CategoryList" });
    },

    async onSubmitForm() {
      this.$refs.categoryForm.validate();

      if (this.form.isValid) {
        await this.addCategory(this.form);
      }
    },
  },
};
</script>
