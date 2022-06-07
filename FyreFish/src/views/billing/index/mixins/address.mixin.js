import { mapState } from "vuex";
import { UsaStates } from "usa-states";
import provinces from "provinces-ca";
const usaStatesArray = new UsaStates().arrayOf("names").map((item) => ({ id: item, label: item }));
const provincesArray = provinces
  .filter((province) => !province.territory)
  .map((item) => ({ id: item.name, label: item.name }));

export default {
  data: () => ({
    countryOptions: [
      { id: "usa", label: "USA" },
      { id: "canada", label: "Canada" },
    ],
    preparedCountry: "US",
  }),
  watch: {
    "form.country"() {
      this.form.state = this.stateOptions[0].id;
    },
    "form.sameAsBilling"(newVal) {
      if (newVal) {
        Object.assign(this.form, this.address);
      } else {
        this.form.firstName = "";
        this.form.lastName = "";
        this.form.addressLine1 = "";
        this.form.addressLine2 = "";
        this.form.city = "";
        this.form.state = "Alabama";
        this.form.country = "usa";
        this.form.zipcode = "";
        this.form.phone = "";
      }
    },
  },
  computed: {
    ...mapState("billing", ["address"]),
    stateOptions() {
      return this.form.country === "usa" ? usaStatesArray : provincesArray;
    },
    nameError() {
      const isDirty = this.$v.form.firstName.$dirty;
      const isFilled = this.$v.form.firstName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    lastNameError() {
      const isDirty = this.$v.form.lastName.$dirty;
      const isFilled = this.$v.form.lastName.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    phoneError() {
      const isDirty = this.$v.form.phone.$dirty;
      const isFilled = this.$v.form.phone.required;
      const isMinLength = this.$v.form.phone.phoneMinLength;
      const isMaxLength = this.$v.form.phone.phoneMaxLength;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      } else if (isDirty && !isMinLength) {
        error = this.$t("validation.phoneLength");
      } else if (isDirty && !isMaxLength) {
        error = this.$t("validation.phoneLength");
      }

      return error;
    },
    addressLine1Error() {
      const isDirty = this.$v.form.addressLine1.$dirty;
      const isFilled = this.$v.form.addressLine1.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    cityError() {
      const isDirty = this.$v.form.city.$dirty;
      const isFilled = this.$v.form.city.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    zipCodeError() {
      const isDirty = this.$v.form.zipcode.$dirty;
      const isFilled = this.$v.form.zipcode.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
  },
};
