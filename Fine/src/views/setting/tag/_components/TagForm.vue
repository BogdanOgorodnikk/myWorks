<template>
  <OurCard class="our-card-wrapper">
    <OurInput
      v-model="form.name"
      :label="$t('label.name')"
      :placeholder="$t('placeholder.tagName')"
      :error="tagNameError"
      data-cy="tag-name-input"
    />

    <OurTextarea
      v-model="form.comment"
      :label="$t('label.comment')"
      :placeholder="$t('placeholder.comment')"
      data-cy="tag-comment-textarea"
    />
  </OurCard>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {},
    };
  },

  validations: {
    form: {
      name: { required },
    },
  },

  computed: {
    tagNameError() {
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
  },

  created() {
    this.form = this.value;
  },

  methods: {
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
