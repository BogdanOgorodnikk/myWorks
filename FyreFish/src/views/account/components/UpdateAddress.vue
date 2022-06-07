<template>
  <div>
    <OurCard class="card">
      <div v-if="isEditType" class="card-title">{{ $t("title.editAddress") }}</div>
      <div v-else class="card-title">{{ $t("title.addAddress") }}</div>

      <div class="payment-address-block">
        <OurSelect
          v-model="existingAddress"
          :options="existingAddressOptions"
          open-direction="bottom"
          class="input-card-state"
          :label="$t('label.useSavedAddress')"
          @change="onChangeExistingAddress"
        >
        </OurSelect>

        <OurInput
          v-model="form.serviceAddress"
          :error="serviceAddressError"
          :label="$t('label.streetAddress')"
        />

        <OurInput v-model="form.unitAddress" :label="$t('label.unitAddress')" />

        <div class="payment-wrapper">
          <OurInput
            v-model="form.city"
            :error="cityError"
            :label="$t('label.city')"
            :placeholder="$t('placeholder.city')"
          />
          <OurSelect
            v-model="form.stateProv"
            :options="stateOptions"
            open-direction="top"
            class="input-card-state"
            :label="$t('label.state')"
            :error="stateProvError"
          >
          </OurSelect>
          <OurSelect
            v-model="form.country"
            :options="countryOptions"
            open-direction="top"
            class="input-card-country"
            :label="$t('label.country')"
            :error="countryError"
            @change="onChangeCountry"
          >
          </OurSelect>
          <OurInput
            v-model="form.zipCode"
            :error="zipCodeError"
            :label="$t('label.ZIPCode')"
            :placeholder="$t('placeholder.ZIPCode')"
          />
        </div>
      </div>
    </OurCard>
    <div class="register-wrapper">
      <div></div>
      <OurButton
        class="register-wrapper-button"
        :text="$t('button.save')"
        size="lg"
        @click="onClickEditAddress"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import { UsaStates } from "usa-states";
import provinces from "provinces-ca";
const usaStatesArray = new UsaStates().arrayOf("names").map((item) => ({ id: item, label: item }));
const provincesArray = provinces
  .filter((province) => !province.territory)
  .map((item) => ({ id: item.name, label: item.name }));

export default {
  name: "UpdateAddress",

  props: {
    type: {
      type: String,
      default: "edit",
    },
    givenAddress: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      existingAddressOptions: [],
      existingAddress: null,
      countryOptions: [
        { id: "usa", label: "USA" },
        { id: "canada", label: "Canada" },
      ],
      form: {
        serviceAddress: "",
        unitAddress: "",
        stateProv: "Alabama",
        country: "usa",
        city: "",
        zipCode: "",
      },
    };
  },
  validations() {
    return {
      form: {
        serviceAddress: { required },
        zipCode: { required },
        city: { required },
        stateProv: { required },
        country: { required },
      },
    };
  },
  computed: {
    ...mapGetters(["account"]),

    stateOptions() {
      return this.form.country !== "canada" ? usaStatesArray : provincesArray;
    },
    stateProvError() {
      const isDirty = this.$v.form.stateProv.$dirty;
      const isFilled = this.$v.form.stateProv.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    countryError() {
      const isDirty = this.$v.form.country.$dirty;
      const isFilled = this.$v.form.country.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    zipCodeError() {
      const isDirty = this.$v.form.zipCode.$dirty;
      const isFilled = this.$v.form.zipCode.required;

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

    serviceAddressError() {
      const isDirty = this.$v.form.serviceAddress.$dirty;
      const isFilled = this.$v.form.serviceAddress.required;

      let error = "";

      if (isDirty && !isFilled) {
        error = this.$t("validation.required");
      }

      return error;
    },
    isEditType() {
      return this.type === "edit";
    },
  },

  created() {
    this.fillForm();
  },

  methods: {
    ...mapActions(["updateAddress", "addAddress"]),

    onChangeCountry() {
      this.form.stateProv = this.stateOptions[0].id;
    },
    onChangeExistingAddress() {
      const address = this.account.addresses.find(
        (address) => address.uid === this.existingAddress
      );

      this.form.serviceAddress = address?.street;
      this.form.unitAddress = address?.premise;
      this.form.city = address?.city;
      this.form.stateProv = address?.stateProv || "";
      this.form.country = address?.country || "";
      this.form.zipCode = address?.postalCode;
    },
    fillForm() {
      this.form.serviceAddress = this.givenAddress.street;
      this.form.unitAddress = this.givenAddress.premise;
      this.form.city = this.givenAddress.city;
      this.form.stateProv = this.givenAddress.stateProv || "";
      this.form.country = this.givenAddress.country || "";
      this.form.zipCode = this.givenAddress.postalCode;
      this.existingAddressOptions = this.account.addresses.map((address) => ({
        id: address.uid,
        label: `${address.street}, ${address.stateProv},
        ${address.city} ${address.postalCode}`,
      }));
    },

    onClickEditAddress() {
      if (this.$v.$invalid) {
        this.$v.$touch();

        return;
      }

      let address = { ...this.givenAddress };

      address.city = this.form.city;
      address.country = this.form.country;
      address.postalCode = this.form.zipCode;
      address.stateProv = this.form.stateProv;
      address.street = this.form.serviceAddress;
      address.premise = this.form.unitAddress;

      if (this.type === "edit") {
        this.updateAddress({ type: this.givenAddress.addressRoleType, newAddress: address });
      } else {
        address.addressRoleType = "OTHER";
        this.addAddress({ newAddress: address });
      }

      this.$emit("updated");
    },
  },
};
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full !important;
  @apply space-y-8;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }
}

.register {
  @apply w-full max-w-full;

  &-title {
    @apply text-center text-4xl font-bold text-base-dark;
    @apply mb-2 mt-4;
  }

  &-wrapper {
    @apply flex justify-between;
    @apply max-w-2xl;
    @apply mx-auto px-6;

    &-button {
      @apply mt-6 w-auto !important;
    }
  }
}

.payment {
  &-address-block {
    @apply space-y-6;
  }

  &-wrapper {
    @apply flex space-x-6;

    .input-card-country {
      @apply w-96;
    }
    .input-card-state {
      @apply w-[32rem];
    }
  }
}

.separated-border {
  @apply border-b border-dashed border-gray-300;
}
</style>
