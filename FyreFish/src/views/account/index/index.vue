<template>
  <OurPage width="wide">
    <OurPageModal v-model="isModalVisible" width="2xl" @closed="closeModal">
      <UpdateAddress
        v-if="isAddressType"
        :type="modalType"
        :given-address="modalData"
        @updated="closeModal"
      >
      </UpdateAddress>
      <UpdateContact v-else :type="modalType" :given-contact="modalData" @updated="closeModal">
      </UpdateContact>
    </OurPageModal>

    <PageTitle />

    <div class="account-wrapper">
      <div class="account-wrapper-panel">
        <OurCard class="account-wrapper-panel-card">
          <div class="card-title card-title-red">{{ $t("page.account.details") }}</div>
          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.account.account") }}#:</div>
            <div class="card-wrapper-description card-wrapper-description-accountnumber">
              {{ accountNumber }}
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.account.type") }}:</div>
            <div class="card-wrapper-description">{{ accountType }}</div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.account.created") }}:</div>
            <div class="card-wrapper-description">{{ accountCreatedDate }}</div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.account.status") }}:</div>
            <div class="card-wrapper-description card-wrapper-description-current">
              {{ accountStatus }}
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("page.account.alerts") }}:</div>
            <div class="card-wrapper-description">{{ account.alerts }}</div>
          </div>
        </OurCard>
      </div>
      <OurCard class="card-right">
        <div class="card-title">{{ $t("page.account.billing") }}</div>
        <div class="card-right-wrapper">
          <div
            v-for="address in addressBilling"
            :key="'address_' + address.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(address)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.house" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.address") }}:</div>
              <div class="card-wrapper-item-description">{{ address.street }}</div>
              <div class="card-wrapper-item-description">{{ address.premise }}</div>
              <div class="card-wrapper-item-description">
                {{ address.city }}, {{ address.stateProv }}
              </div>
              <div class="card-wrapper-item-description">
                {{ address.country }} {{ address.postalCode }}
              </div>
            </div>
          </div>
          <div
            v-for="contact in contactBilling"
            :key="'contact_' + contact.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(contact)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.contact") }}:</div>
              <div class="card-wrapper-item-description">
                <span v-if="contact.title">{{ contact.title }} </span>{{ contact.firstName }}
                {{ contact.lastName }}
              </div>
              <div class="card-wrapper-item-description">{{ contact.primaryEmail }}</div>
              <div class="card-wrapper-item-description">{{ contact.primaryPhone }}</div>
              <div v-if="contact.secondaryEmail" class="card-wrapper-item-description">
                {{ contact.secondaryEmail }}
              </div>
              <div v-if="contact.secondaryPhone" class="card-wrapper-item-description">
                {{ contact.secondaryPhone }}
              </div>
            </div>
          </div>
        </div>
      </OurCard>

      <div class="account-wrapper-panel"></div>
      <OurCard class="card-right">
        <div class="card-title">{{ $t("page.account.mailing") }}</div>
        <div class="card-right-wrapper">
          <div
            v-for="address in addressMailing"
            :key="'address_' + address.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(address)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.house" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.address") }}:</div>
              <div class="card-wrapper-item-description">{{ address.street }}</div>
              <div class="card-wrapper-item-description">{{ address.premise }}</div>
              <div class="card-wrapper-item-description">
                {{ address.city }}, {{ address.stateProv }}
              </div>
              <div class="card-wrapper-item-description">
                {{ address.country }} {{ address.postalCode }}
              </div>
            </div>
          </div>
          <div
            v-for="contact in contactAdministration"
            :key="'contact_' + contact.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(contact)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.administration") }}:</div>
              <div class="card-wrapper-item-description">
                <span v-if="contact.title">{{ contact.title }} </span>{{ contact.firstName }}
                {{ contact.lastName }}
              </div>
              <div class="card-wrapper-item-description">{{ contact.primaryEmail }}</div>
              <div class="card-wrapper-item-description">{{ contact.primaryPhone }}</div>
              <div v-if="contact.secondaryEmail" class="card-wrapper-item-description">
                {{ contact.secondaryEmail }}
              </div>
              <div v-if="contact.secondaryPhone" class="card-wrapper-item-description">
                {{ contact.secondaryPhone }}
              </div>
            </div>
          </div>
        </div>
      </OurCard>

      <div class="account-wrapper-panel"></div>
      <OurCard class="card-right">
        <div class="card-title">{{ $t("page.account.service") }}</div>
        <div class="card-right-wrapper">
          <div
            v-for="address in addressService"
            :key="'address_' + address.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(address)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.house" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.address") }}:</div>
              <div class="card-wrapper-item-description">{{ address.street }}</div>
              <div class="card-wrapper-item-description">{{ address.premise }}</div>
              <div class="card-wrapper-item-description">
                {{ address.city }}, {{ address.stateProv }}
              </div>
              <div class="card-wrapper-item-description">
                {{ address.country }} {{ address.postalCode }}
              </div>
            </div>
          </div>
          <div
            v-for="contact in contactTechnical"
            :key="'contact_' + contact.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(contact)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.technical") }}:</div>
              <div class="card-wrapper-item-description">
                <span v-if="contact.title">{{ contact.title }} </span>{{ contact.firstName }}
                {{ contact.lastName }}
              </div>
              <div class="card-wrapper-item-description">{{ contact.primaryEmail }}</div>
              <div class="card-wrapper-item-description">{{ contact.primaryPhone }}</div>
              <div v-if="contact.secondaryEmail" class="card-wrapper-item-description">
                {{ contact.secondaryEmail }}
              </div>
              <div v-if="contact.secondaryPhone" class="card-wrapper-item-description">
                {{ contact.secondaryPhone }}
              </div>
            </div>
          </div>
          <div
            v-for="contact in contactOnSiteAccess"
            :key="'contact_' + contact.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(contact)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-title">{{ $t("page.account.onsiteAccess") }}:</div>
              <div class="card-wrapper-item-description">
                <span v-if="contact.title">{{ contact.title }} </span>{{ contact.firstName }}
                {{ contact.lastName }}
              </div>
              <div class="card-wrapper-item-description">{{ contact.primaryEmail }}</div>
              <div class="card-wrapper-item-description">{{ contact.primaryPhone }}</div>
              <div v-if="contact.secondaryEmail" class="card-wrapper-item-description">
                {{ contact.secondaryEmail }}
              </div>
              <div v-if="contact.secondaryPhone" class="card-wrapper-item-description">
                {{ contact.secondaryPhone }}
              </div>
            </div>
          </div>
        </div>
      </OurCard>

      <div class="account-wrapper-panel"></div>
      <OurCard class="card-right">
        <div class="card-title">{{ $t("page.account.otherContacts") }}</div>
        <div class="card-right-wrapper">
          <div
            v-for="contact in contactOther"
            :key="'contact_' + contact.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(contact)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-description">
                <span v-if="contact.title">{{ contact.title }} </span>{{ contact.firstName }}
                {{ contact.lastName }}
              </div>
              <div class="card-wrapper-item-description">{{ contact.primaryEmail }}</div>
              <div class="card-wrapper-item-description">{{ contact.primaryPhone }}</div>
              <div v-if="contact.secondaryEmail" class="card-wrapper-item-description">
                {{ contact.secondaryEmail }}
              </div>
              <div v-if="contact.secondaryPhone" class="card-wrapper-item-description">
                {{ contact.secondaryPhone }}
              </div>
            </div>
          </div>
          <div class="card-right-wrapper-add" @click="addContact">+</div>
        </div>
      </OurCard>

      <div class="account-wrapper-panel"></div>
      <OurCard class="card-right">
        <div class="card-title">{{ $t("page.account.otherAddresses") }}</div>
        <div class="card-right-wrapper">
          <div
            v-for="address in addressOther"
            :key="'address_' + address.uid"
            class="card-wrapper-item"
          >
            <div class="card-wrapper-item-edit" @click="editItem(address)">
              <OurSvgIcon name="Edit" class="info-icon" :size="'md'" />
            </div>
            <div class="card-wrapper-item-icon">
              <img class="icon" :src="icons.addressBook" />
            </div>
            <div class="card-wrapper-item-right">
              <div class="card-wrapper-item-description">{{ address.street }}</div>
              <div class="card-wrapper-item-description">{{ address.premise }}</div>
              <div class="card-wrapper-item-description">
                {{ address.city }}, {{ address.stateProv }}
              </div>
              <div class="card-wrapper-item-description">
                {{ address.country }} {{ address.postalCode }}
              </div>
            </div>
          </div>
          <div class="card-right-wrapper-add" @click="addAddress">+</div>
        </div>
      </OurCard>
    </div>
  </OurPage>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PageTitle from "@/components/PageTitle";
import UpdateAddress from "../components/UpdateAddress";
import UpdateContact from "../components/UpdateContact";
const MODAL_TYPE = {
  edit: "edit",
  add: "add",
};

export default {
  components: {
    UpdateAddress,
    UpdateContact,
    PageTitle,
  },

  data() {
    return {
      isModalVisible: false,
      modalType: MODAL_TYPE.edit,
      modalData: {},
      isAddressType: true,
    };
  },
  computed: {
    ...mapGetters([
      "userLogin",
      "account",
      "accountNumber",
      "accountStatus",
      "accountType",
      "accountCreatedDate",
      "addressBilling",
      "addressMailing",
      "addressService",
      "contactBilling",
      "contactAdministration",
      "contactTechnical",
      "contactOnSiteAccess",
      "contactOther",
      "addressOther",
    ]),

    icons() {
      return {
        house: require("@/assets/images/icons/house.png"),
        addressBook: require("@/assets/images/icons/address-book.png"),
      };
    },
  },

  async mounted() {
    await this.getCustomersInfos();
    await this.getCustomerAccountsInfos();
    await this.getAccountInfos();
    await this.getContactRoles();
  },

  methods: {
    ...mapActions([
      "getCustomersInfos",
      "getCustomerAccountsInfos",
      "getAccountInfos",
      "getContactRoles",
    ]),
    closeModal() {
      this.isModalVisible = false;
      this.$forceUpdate();
    },
    editItem(item) {
      this.isAddressType = !!item.addressId;
      this.modalType = MODAL_TYPE.edit;
      this.modalData = item;
      this.isModalVisible = true;
    },
    addAddress() {
      this.isAddressType = true;
      this.modalType = MODAL_TYPE.add;
      this.modalData = {};
      this.isModalVisible = true;
    },
    addContact() {
      this.isAddressType = false;
      this.modalType = MODAL_TYPE.add;
      this.modalData = {};
      this.isModalVisible = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.account {
  &-wrapper {
    @apply grid gap-8 py-6 sm:grid-cols-1 md:grid-cols-3;

    &-panel {
      @apply col-span-1 w-auto;

      &-card {
        @apply h-64 overflow-auto;
      }
    }
  }
}

.card {
  @apply space-y-2;

  &-right {
    @apply h-64 overflow-x-auto md:col-span-2;

    &-wrapper {
      @apply flex justify-start;

      &-add {
        @apply ml-auto mr-4 cursor-pointer text-8xl font-thin leading-[0.5] text-gray-500;
      }
    }
  }
  &-account-title {
    @apply font-bold text-base-dark;
  }
  &-title {
    @apply pb-4 text-2lg font-bold text-base-dark;
  }

  &-title-red {
    @apply text-base-bright-red;
  }

  &-wrapper {
    @apply flex justify-between;

    &-item {
      @apply relative flex;

      &-icon {
        @apply w-12;
      }
      &-edit {
        @apply absolute right-2 z-10 cursor-pointer;
      }
      &-right {
        @apply relative mr-8;
      }
      &-title {
        @apply text-base font-bold text-base-dark;
        @apply mb-4 mr-4;
      }
      &-description {
        @apply w-max text-base font-normal text-gray-500;
      }
    }

    &-title {
      @apply w-4/12 min-w-[4rem] text-base font-bold text-base-dark;
    }

    &-description {
      @apply ml-4 w-8/12 text-base font-normal text-gray-500;
    }

    &-description-accountnumber {
      @apply w-8/12 text-base font-bold text-base-dark;
    }

    &-description-current {
      @apply font-bold text-green-600;
    }
  }
}
</style>
