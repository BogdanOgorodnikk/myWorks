<template>
  <OurCard>
    <OurInput v-model="form.name" :label="$t('label.name')" :placeholder="$t('placeholder.name')" />

    <OurInput
      v-model="form.taxNumber"
      :label="$t('label.taxNumber')"
      :placeholder="$t('placeholder.taxNumber')"
    />

    <OurMultiselect
      v-model="form.type"
      :label="$t('label.type')"
      :placeholder="$t('placeholder.contactCompanyEmployee')"
      :options="contragentTypes"
      value-key="value"
    />
  </OurCard>
</template>

<script>
import { CONTRAGENT_TYPE } from "@/api/contragent";
import { mapState } from "vuex";

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: {
        name: "",
        taxNumber: "",
        type: [],
      },
      contragentTypes: CONTRAGENT_TYPE,
    };
  },

  computed: {
    ...mapState("contragent", ["filters"]),
  },

  watch: {
    form: {
      handler: "onChangeForm",
      deep: true,
    },
  },

  created() {
    this.prefillForm();
  },

  methods: {
    prefillForm() {
      this.form.name = this.filters?.name || "";
      this.form.taxNumber = this.filters?.taxNumber || "";
      this.form.type = [...(this.filters?.type || [])];
    },

    onChangeForm() {
      this.$emit("input", this.form);
    },
  },
};
</script>
