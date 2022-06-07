<template>
  <div>
    <OurCard class="our-card-wrapper">
      <OurInput
        v-model="form.name"
        :label="$t('label.name')"
        :placeholder="$t('placeholder.categoryName')"
        :error="categoryNameError"
        data-cy="category-name-input"
      />

      <OurTextarea
        v-model="form.description"
        :label="$t('label.description')"
        :placeholder="$t('placeholder.comment')"
        data-cy="category-description-input"
        rows="2"
      />
    </OurCard>

    <OurCard class="our-card-wrapper">
      <OurRadioGroup
        v-model="form.type"
        name="categoryType"
        :label="$t('label.typeCategory')"
        :options="categoryTypeItems"
        data-cy="category-type-radio-buttons"
      />

      <OurExpandButton :buttons="buttons" class="more-buttons">
        <template slot-scope="{ button }">
          <OurExpandButtonItem
            v-if="button.isShown"
            :text="moreCategoryTypeItem"
            :icon-name="button.iconName"
            @click="onClickMoreButton(button.name)"
          />
        </template>
      </OurExpandButton>
    </OurCard>

    <OurCard>
      <OurRadioGroup
        v-model="form.activity"
        name="categoryActivity"
        :label="$t('label.activityCategory')"
        :options="categoryActivityItems"
        data-cy="category-activity-radio-buttons"
      />
    </OurCard>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";

const START_SHOW_CATEGORY_TYPES = 2;
const MORE_CATEGORY = "moreCategory";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      isShownCategoryType: false,
      form: {},
      buttons: [
        {
          iconName: "Other2",
          name: MORE_CATEGORY,
          isShown: true,
        },
      ],
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    ...mapState("category", ["categoryTypes", "categoryActivities"]),

    categoryNameError() {
      const isDirty = this.$v.form.name.$dirty;
      const isFilled = this.$v.form.name.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },

    moreCategoryTypeItem() {
      return `${this.$t("label.cashFlowTypes.transfer")},
      ${this.$t("label.cashFlowTypes.deposit")},
      ${this.$t("label.cashFlowTypes.withdrawal")}`;
    },

    categoryTypeItems() {
      let categoryTypeItems = [];

      categoryTypeItems = this.categoryTypes.map((item, index) => {
        let isShowItem = index >= START_SHOW_CATEGORY_TYPES ? !this.isShownCategoryType : false;

        return {
          value: item.code,
          title: item.label,
          description: item.info,
          hidden: isShowItem,
        };
      });

      return categoryTypeItems;
    },

    categoryActivityItems() {
      let categoryActivityItems = [];

      categoryActivityItems = this.categoryActivities.map((item) => ({
        value: item.code,
        title: item.label,
        description: item.info,
      }));

      return categoryActivityItems;
    },
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  async created() {
    await Promise.all([this.getCategoryTypes(), this.getCategoryActivities()]);

    this.form = this.value;
  },

  methods: {
    ...mapActions("category", ["getCategoryTypes", "getCategoryActivities"]),

    onClickMoreButton(name) {
      this.isShownCategoryType = true;

      this.buttons.forEach((item) => {
        if (item.name === name) {
          item.isShown = false;
        }
      });
    },

    onChangeForm(form) {
      form.isValid = !this.$v.$invalid;

      this.$emit("input", form);
    },

    validate() {
      this.$v.$touch();
    },
  },
};
</script>

<style lang="postcss" scoped>
.our-card-wrapper {
  @apply mb-4;
}

.more-buttons::v-deep {
  @apply mt-0 !important;

  .wrapper .button {
    @apply py-0;
  }
}
</style>
