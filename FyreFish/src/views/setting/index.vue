<template>
  <OurPage width="wide">
    <PageTitle />

    <div class="settings-wrapper">
      <OurCard>
        <div class="card-wrapper">
          <OurSelect
            v-model="form.userListType"
            :options="userTypeOptions"
            open-direction="bottom"
            label="Users"
          />
        </div>

        <div class="card-wrapper">
          <div class="card-title">{{ user.userName }}</div>
        </div>

        <div class="card-block">
          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.username") }}:</div>
            <OurInput
              v-if="isEditSettings"
              v-model="form.username"
              class="card-wrapper-input"
              size="md"
            ></OurInput>
            <div v-else class="card-wrapper-description">
              {{ user.userName }}
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.role") }}:</div>
            <div class="card-wrapper-description">
              {{ getPortalRoleFormatted }}
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.email") }}:</div>
            <OurInput
              v-if="isEditSettings"
              v-model="form.email"
              class="card-wrapper-input"
            ></OurInput>
            <div v-else class="card-wrapper-description">{{ user.primaryEmail }}</div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.recoveryEmail") }}:</div>
            <OurInput
              v-if="isEditSettings"
              v-model="form.recoveryEmail"
              class="card-wrapper-input"
            ></OurInput>
            <div v-else class="card-wrapper-description">
              <p v-if="user.secondaryEmail">
                {{ user.secondaryEmail }}
              </p>
              <p v-else>n/a</p>
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.phone") }}:</div>
            <OurInput
              v-if="isEditSettings"
              v-model="form.phone"
              class="card-wrapper-input"
            ></OurInput>
            <div v-else class="card-wrapper-description">
              {{ user.primaryPhone }}
            </div>
          </div>

          <div class="card-wrapper">
            <div class="card-wrapper-title">{{ $t("label.recoveryPhone") }}:</div>
            <OurInput
              v-if="isEditSettings"
              v-model="form.recoveryPhone"
              class="card-wrapper-input"
            ></OurInput>
            <div v-else class="card-wrapper-description">
              <p v-if="user.secondaryPhone">
                {{ user.secondaryPhone }}
              </p>
              <p v-else>n/a</p>
            </div>
          </div>

          <div v-if="isEditSecurity">
            <div class="card-wrapper">
              <div class="card-wrapper-title">{{ $t("label.oldPassword") }}:</div>
              <OurInput class="card-wrapper-input" />
            </div>

            <div class="card-wrapper">
              <div class="card-wrapper-title">{{ $t("label.newPassword") }}:</div>
              <OurInput class="card-wrapper-input" />
            </div>

            <div class="card-wrapper">
              <div class="card-wrapper-title">{{ $t("label.retypePassword") }}:</div>
              <OurInput class="card-wrapper-input" />
            </div>
          </div>

          <div v-else>
            <div class="card-wrapper">
              <div class="card-wrapper-title">{{ $t("label.password") }}:</div>
              <div class="card-wrapper-description">***********</div>
            </div>
          </div>

          <div v-if="isEditSecurity" class="authentification">
            <div class="authentification-title">
              {{ $t("page.settings.twoFactorAuthentication") }}
            </div>
            <OurSwitch v-model="form.twoFactorOn" with-text size="lg" variant="green" />
          </div>

          <div v-else class="authentification">
            <div class="authentification-title">
              {{ $t("page.settings.twoFactorAuthentication") }}
            </div>

            <div v-if="form.twoFactorOn" class="switch on">
              <div class="switch-title">{{ $t("label.on") }}</div>
            </div>

            <div v-else class="switch off">
              <div class="switch-title">{{ $t("label.off") }}</div>
            </div>
          </div>
        </div>

        <OurButton
          class="card-button"
          variant="primary"
          size="md"
          :text="$t('button.manageMyAccount')"
          @click="onClickEditSettings(), onClickEditSecurity()"
        ></OurButton>

        <div v-if="filterUserType(userTypes.owner)">
          <div class="card-wrapper">
            <div class="card-title">{{ $t("page.settings.accountOwner") }}</div>
          </div>

          <div v-for="(user, index) in owner" :key="index">
            <User :user="user" />
          </div>

          <OurButton
            class="card-button"
            variant="primary"
            size="md"
            :text="$t('button.manageAccountOwner')"
            :disabled="!isOwner"
          ></OurButton>
        </div>

        <div v-if="filterUserType(userTypes.administrator)">
          <div class="card-wrapper">
            <div class="card-title">{{ $t("page.settings.accountAdministrators") }}</div>
          </div>

          <div v-for="(user, index) in administrator" :key="index">
            <User :user="user" />
          </div>

          <OurButton
            class="card-button"
            variant="primary"
            size="md"
            :text="$t('button.addAdministrator')"
            :disabled="!isManageUsers"
          ></OurButton>
        </div>

        <div v-if="filterUserType(userTypes.standard)">
          <div class="card-wrapper">
            <div class="card-title">{{ $t("page.settings.standardUsers") }}</div>
          </div>

          <div v-for="(user, index) in standard" :key="index">
            <User :user="user" />
          </div>

          <OurButton
            class="card-button"
            variant="primary"
            size="md"
            :text="$t('button.addStandardUser')"
            :disabled="!isManageUsers"
          ></OurButton>
        </div>
      </OurCard>
    </div>
  </OurPage>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import PageTitle from "@/components/PageTitle";
import User from "./components/User";

export default {
  components: {
    PageTitle,
    User,
  },

  data: () => ({
    isEditSettings: false,
    isEditSecurity: false,
    form: {
      username: "",
      email: "",
      recoveryEmail: "",
      phone: "",
      recoveryPhone: "",
      twoFactorOn: null,
      userListType: "ALL",
    },
    userTypeOptions: [
      { id: "ALL", label: "All Users" },
      { id: "OWNER", label: "Owner" },
      { id: "ADMINISTRATOR", label: "Administrator" },
      { id: "STANDARD", label: "Standard" },
    ],
    userTypes: {
      all: "ALL",
      owner: "OWNER",
      administrator: "ADMINISTRATOR",
      standard: "STANDARD",
    },
    owner: [],
    administrator: [],
    standard: [],
  }),

  computed: {
    ...mapState(["auth"]),

    ...mapGetters(["isOwner", "isManageUsers", "portalRoleFormatted", "user", "userListSorted"]),

    getPortalRoleFormatted() {
      return this.portalRoleFormatted;
    },

    getUser() {
      return this.user;
    },

    getUserListSorted() {
      return this.userListSorted;
    },
  },

  watch: {
    getUser() {
      this.fillForm();
      this.fillSecurity();
    },

    getUserListSorted() {
      this.fillUsers();
    },
  },

  created() {
    this.fillForm();
    this.fillSecurity();
  },

  async mounted() {
    await Promise.all([this.getUserProfile(), this.getCustomersInfos()]);

    await this.getCustomerAccountsInfos();

    await Promise.all([this.getAccountInfos(), this.getUsersByAccountId()]);
  },

  methods: {
    ...mapActions([
      "getCustomersInfos",
      "getCustomerAccountsInfos",
      "getAccountInfos",
      "getUserProfile",
      "getUsersByAccountId",
    ]),

    fillForm() {
      this.form.username = this.user.userName;
      this.form.email = this.user.primaryEmail;
      this.form.recoveryEmail = this.user.secondaryEmail;
      this.form.phone = this.user.primaryPhone;
      this.form.recoveryPhone = this.user.secondaryPhone;
    },

    fillSecurity() {
      this.form.twoFactorOn = this.user.totpEnabled;
    },

    fillUsers() {
      this.owner = this.userListSorted.owner;
      this.administrator = this.userListSorted.admin;
      this.standard = this.userListSorted.standard;
    },

    filterUserType(userType) {
      const found = [this.userTypes.all, userType].some((v) => this.form.userListType.includes(v));

      return this[userType.toLowerCase()].length && found;
    },

    onClickSaveChanges() {
      if (this.isEditSettings) {
        this.isEditSettings = false;
      }

      if (this.isEditSecurity) {
        this.isEditSecurity = false;
      }
    },

    onClickEditSettings() {
      if (this.isEditSettings) {
        this.fillForm();
      }

      this.isEditSettings = !this.isEditSettings;
    },

    onClickEditSecurity() {
      if (this.isEditSecurity) {
        this.fillSecurity();
      }

      this.isEditSecurity = !this.isEditSecurity;
    },
  },
};
</script>

<style lang="postcss" scoped>
.settings {
  &-wrapper {
    @apply w-[28rem];
  }
}

.icon {
  @apply cursor-pointer;
}

.card {
  @apply space-y-4;

  &-title {
    @apply text-2lg font-bold text-base-dark;
  }

  &-block {
    @apply w-100 space-y-2 border-l-2 border-gray-300 py-2 pl-4;
  }

  &-button {
    @apply w-100;
  }

  &-wrapper {
    @apply flex justify-between pb-1;

    &-title {
      @apply my-auto w-1/2 text-base font-bold text-base-dark;
    }

    &-description {
      @apply w-1/2 text-base font-normal text-gray-500;
    }

    &-input {
      @apply w-1/2;
    }
  }

  &-link {
    @apply cursor-pointer text-center text-base font-medium text-base-deep-red underline;
  }
}

.authentification {
  @apply flex content-around justify-between;

  &-title {
    @apply my-auto text-base font-normal text-gray-500;
  }
}

.switch {
  @apply relative flex items-center;
  @apply h-10 w-[4.5rem] rounded-3xl;

  &-title {
    @apply m-auto;
    @apply text-base font-medium uppercase text-white;
  }
}

.card-wrapper-input::v-deep .input-block {
  .input {
    @apply py-0;
  }
}

.on {
  @apply bg-green-500;
}

.off {
  @apply bg-gray-300;
}
</style>
