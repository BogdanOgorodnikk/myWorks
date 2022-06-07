<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.integrations.bitrix24.list')"
    width="md"
  >
    <OurCard v-if="!isIntegrated">
      <OurInput
        :label="$t('label.yourPortalAddress')"
        :placeholder="$t('placeholder.yourPortalAddress')"
      />

      <div class="instruction">
        <h4 class="instruction-title">
          {{ $t("page.setting.bitrix24.integrationInstruction._") }}
        </h4>

        <ul class="instruction-list">
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.integrationInstruction.installFineInBx24") }}
          </li>
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.integrationInstruction.writeLinkOnBx24") }}
          </li>
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.integrationInstruction.clickOnIntegrate") }}
          </li>
        </ul>
      </div>
    </OurCard>

    <OurCard v-if="isIntegrated">
      <div class="integration-wrapper">
        <div class="integration-wrapper">
          <img :src="iconLink" class="icon" alt="bx24" />

          <div>
            <h3 class="integration-user">
              Иван Гриднев <span class="integration-user-id">(ID 94)</span>
            </h3>
            <div class="integration-status">
              <OurSvgIcon name="Double-check" size="xs" class="integration-status-icon" />
              {{ $t("label.integrated") }}
            </div>
          </div>
        </div>

        <div class="integration-wrapper">
          <div>
            <div class="integration-update">
              {{ $t("page.setting.bitrix24.integrationUpdated") }}
            </div>

            <div class="integration-update">23 февраля 2021 в 14:20</div>
          </div>

          <OurButton text="" variant="secondary" class="integration-button">
            <template #icon-left>
              <OurSvgIcon name="Update" class="integration-button-icon" />
            </template>
          </OurButton>
        </div>
      </div>

      <div class="instruction">
        <div class="instruction-description">
          {{ $t("page.setting.bitrix24.integratedUser", { user: "Bogdan" }) }}
        </div>

        <div class="instruction-description">
          {{ $t("page.setting.bitrix24.integratedRecomend") }}
        </div>

        <h4 class="instruction-title">
          {{ $t("page.setting.bitrix24.changeIntegrationUser._") }}
        </h4>

        <ul class="instruction-list">
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.changeIntegrationUser.cancelIntegration") }}
          </li>
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.changeIntegrationUser.signInUserInBx24") }}
          </li>
          <li class="instruction-list-item">
            {{ $t("page.setting.bitrix24.changeIntegrationUser.repeatIntegration") }}
          </li>
        </ul>
      </div>
    </OurCard>

    <template #footer-left>
      <OurButton v-if="!isIntegrated" :text="$t('button.integrated')" />

      <OurButton v-if="isIntegrated" :text="$t('button.cancelIntegration')" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToSettingsList" />
    </template>
  </OurPage>
</template>

<script>
import router from "@/router";

export default {
  data: () => ({
    isIntegrated: false,
  }),

  computed: {
    iconLink() {
      return require("@/assets/images/logos/crm/bitrix24.png");
    },

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  methods: {
    onClickBackToSettingsList() {
      router.push({ name: "SettingsList" });
    },
  },
};
</script>

<style lang="postcss" scoped>
.instruction {
  @apply rounded-lg bg-gray-100;
  @apply space-y-2.5 p-4;

  &-description {
    @apply text-xs font-normal text-gray-500;
  }

  &-title {
    @apply text-xs font-bold text-gray-500;
  }

  &-list {
    @apply list-inside list-disc;
    @apply ml-2;

    &-item {
      @apply text-xs font-normal text-gray-500;
    }
  }
}

.integration {
  &-wrapper {
    @apply flex items-center justify-between;
  }

  &-user {
    @apply text-base font-medium text-base-dark;

    &-id {
      @apply text-xs font-normal text-gray-700;
    }
  }

  &-status {
    @apply rounded-full bg-green-100;
    @apply pt-0.5 pr-2 pb-0.5 pl-1.5;
    @apply mt-1;
    @apply text-xs font-normal text-green-500;
    @apply inline-flex items-center;

    &-icon {
      @apply mr-1;
      &::v-deep g [fill] {
        @apply fill-current text-green-500;
      }
    }
  }

  &-update {
    @apply text-xs font-normal text-gray-500;
  }

  &-button {
    @apply h-10 w-10;
    @apply relative ml-3;

    &-icon {
      @apply absolute top-2 left-2;
    }
  }
}

.icon {
  @apply h-10 w-10;
  @apply mr-4;
}
</style>
