<template>
  <OurPage
    :back-route="backRouteParams"
    :title="$t('title.setting.user.list')"
    width="xl"
    data-cy="users-page"
  >
    <template #header-right>
      <OurButton v-if="isMobileDevice" data-cy="add-user-button" size="sm" @click="onClickAddUser">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton
        v-else
        data-cy="add-user-button"
        size="sm"
        :text="$t('button.add')"
        @click="onClickAddUser"
      />
    </template>

    <OurTable :headers="tableHeaders" :items.sync="tableItems" @clickRow="onClickRow">
      <template #cell-status="{ value }">
        <OurTag :text="value.text" :variant="value.variant" />
      </template>
    </OurTable>
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import I18nServiceDefault from "@ilevel/our.service.i18n";
import { format as TimeagoFormat, register as TimeagoRegister } from "timeago.js";
import { uk as locale_UA, ru as locale_RU } from "timeago.js/lib/lang";

export default {
  data() {
    return {
      tableHeaders: [
        {
          value: "name",
          text: this.$t("label.name"),
        },
        {
          value: "mail",
          text: this.$t("label.email"),
        },
        {
          value: "came",
          text: this.$t("label.came"),
        },
        {
          value: "status",
          text: this.$t("label.status"),
        },
      ],
      tableItems: [],
    };
  },

  computed: {
    ...mapState("user", ["users"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.settings"),
        name: "SettingsList",
      };
    },
  },

  watch: {
    users: {
      immediate: true,
      deep: true,
      handler: "onChangeUsers",
    },
  },

  async created() {
    TimeagoRegister("ua", locale_UA);
    TimeagoRegister("ru", locale_RU);

    await this.getUsers();
  },

  methods: {
    ...mapActions("user", ["getUsers"]),

    setUserStatus(isActive, lastActivity) {
      let statusInfo = {};

      if (lastActivity === null && isActive) {
        statusInfo = {
          variant: "blue",
          text: this.$t("label.invited"),
        };
      } else if (isActive) {
        statusInfo = {
          variant: "green",
          text: this.$t("label.acitve"),
        };
      } else {
        statusInfo = {
          variant: "red",
          text: this.$t("label.fired"),
        };
      }

      return statusInfo;
    },

    onChangeUsers() {
      const activeLanguage = I18nServiceDefault.getActiveLanguage();

      this.tableItems = this.users.map((item) => {
        const [userRole] = item.roles;
        const timestampInMilliseconds = item.lastActivityAt * 1000;
        const hasLastActivity = timestampInMilliseconds !== 0;

        return {
          id: item.id,
          name: {
            primaryRow: item.firstName ? `${item.firstName} ${item.lastName}` : "",
            secondaryRow: userRole?.name || "",
          },
          mail: item.email || "",
          came: hasLastActivity
            ? TimeagoFormat(timestampInMilliseconds, activeLanguage)
            : this.$t("label.haventVisited"),
          status: this.setUserStatus(item.isActive, item.lastActivityAt) || "",
        };
      });
    },

    onClickAddUser() {
      this.$router.push({ name: "UserAdd" });
    },

    onClickRow(row) {
      this.$router.push({ name: "UserEdit", params: { id: row.id } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.add-button-icon {
  &::v-deep g [fill] {
    @apply opacity-100;
  }
}
</style>
