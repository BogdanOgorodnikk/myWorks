<template>
  <OurPage>
    <template #header-left>
      <div class="user">
        <div class="user-wrapper">
          <div class="user-name">{{ profileInfo.name }}</div>

          <OurTag
            class="user-status"
            :text="profileInfo.status"
            color="green"
            variant="secondary"
          />
        </div>

        <div class="user-wrapper">
          <div class="user-info">{{ profileInfo.phone }}</div>
          <div class="user-info">{{ profileInfo.email }}</div>
        </div>
      </div>
    </template>

    <template #header-right>
      <OurButton :text="$t('button.edit')" size="sm" />
    </template>

    <OurCard v-for="account in profile.accounts" :key="account.id" class="account">
      <div class="account-wrapper">
        <div>
          <div class="account-title">{{ account.name }}</div>

          <div class="account-status-wrapper">
            <div class="account-id">{{ account.number }}</div>

            <OurTag class="account-type" :text="account.type" />
          </div>
        </div>

        <div>
          <OurButton :text="$t('button.edit')" size="sm" variant="transparent" />
        </div>
      </div>

      <div class="account-user-wrapper">
        <div class="account-user-block">
          <div class="account-user-block-title">{{ $t("page.profile.contacts") }}</div>

          <div v-for="item in account.accountContacts" :key="item.id" class="account-user-list">
            <div class="account-user-title">
              <div class="account-user-title-name">
                {{ item.contact.firstName }} {{ item.contact.lastName }}
              </div>

              <div class="account-user-edit">{{ $t("button.edit") }}</div>
            </div>

            <div class="account-user-info">
              <div class="account-user-info-description">{{ item.contact.phone }}</div>
              <div class="account-user-info-description">{{ item.contact.email }}</div>
            </div>
          </div>
        </div>

        <div class="account-user-block">
          <div class="account-user-block-title">{{ $t("page.profile.addresses") }}</div>

          <div v-for="item in account.accountAddresses" :key="item.id" class="account-user-list">
            <div class="account-user-title">
              <div class="account-user-title-name">{{ item.address.street }}</div>

              <div class="account-user-edit">{{ $t("button.edit") }}</div>
            </div>

            <div class="account-user-info">
              <div class="account-user-info-description">
                {{ item.address.city }}, {{ item.address.provstate }},
                {{ item.address.country }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OurCard>
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("profile", ["profile"]),

    profileInfo() {
      return {
        name: this.profile?.name,
        status: this.profile?.status,
        phone: this.profile?.phone,
        email: this.profile?.email,
      };
    },
  },

  async created() {
    await this.getUserProfile(1); //TODO: Remove when will be real user id
  },

  methods: {
    ...mapActions("profile", ["getUserProfile"]),
  },
};
</script>

<style lang="postcss" scoped>
.user {
  &-wrapper {
    @apply flex items-center;
    @apply space-x-3;
  }

  &-name {
    @apply text-4xl font-bold text-base-dark;
  }

  &-info {
    @apply text-base font-normal text-gray-500;
    @apply mt-1;
  }

  &-status {
    @apply lowercase;

    &:first-letter {
      @apply capitalize;
    }
  }
}

.account {
  @apply mb-4;

  &:last-child {
    @apply mb-0;
  }

  &-type {
    @apply lowercase;

    &:first-letter {
      @apply capitalize;
    }
  }

  &-wrapper {
    @apply flex justify-between;
  }

  &-title {
    @apply text-2xl font-medium text-base-dark;
  }

  &-status-wrapper {
    @apply flex items-center;
    @apply mt-1 space-x-2;
  }

  &-id {
    @apply text-base font-normal text-gray-500;

    &:before {
      content: "#";
    }
  }

  &-user {
    &-wrapper {
      @apply flex;
    }

    &-block {
      @apply space-y-4;
      @apply w-full;

      &-title {
        @apply text-base font-medium text-gray-400;
        @apply mb-4;
      }
    }

    &-title {
      @apply flex;
      @apply mb-1 space-x-2;

      &-name {
        @apply text-base font-medium text-base-dark;
      }
    }

    &-list {
      @apply w-max;

      &:hover {
        .account-user-edit {
          @apply opacity-100;
        }
      }
    }

    &-edit {
      @apply text-sm font-normal text-gray-400;
      @apply border-b border-dashed border-gray-400;
      @apply opacity-0;
      @apply transition duration-100 ease-in-out;
      @apply cursor-pointer lowercase;
    }

    &-info {
      @apply flex;
      @apply space-x-3;

      &-description {
        @apply text-sm font-normal text-gray-500;
      }
    }
  }
}
</style>
