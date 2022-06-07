import {
  getUserProfile,
  getUserType,
  getUsersByAccountId,
  getAccountById,
  getCustomers,
  getAccountsByClientId,
  updateUserProfile,
  getContactRoles,
  postContact,
  ROLES,
} from "@/api/user";
import HelperService from "@/services/helper.service";
import { getRandomId } from "@ilevel/our.service.ui";

export default {
  state: {
    customers: {
      customerInfo: [],
    },
    customerAccounts: [],
    account: {
      accountType: "",
      addresses: [],
      alerts: 0,
      contacts: [],
      createdDate: null,
      status: "ACTIVE",
    },
    user: {},
    languages: {
      en: "English",
    },
    userType: "",
    userList: [],
    contactRoles: [],
  },

  getters: {
    accountAddressType: (state) => (type) => {
      return (
        state.account.addresses
          .filter((address) => address.addressRoleType === type)
          .map((address) => Object.assign(address, { uid: getRandomId() })) || []
      );
    },

    accountContactType: (state) => (type) => {
      return (
        state.account.contacts
          .filter((contact) => contact.contactRoleType === type)
          .map((contact) => Object.assign(contact, { uid: getRandomId() })) || []
      );
    },

    addressBilling(state, getters) {
      return getters.accountAddressType("BILLING");
    },

    addressMailing(state, getters) {
      return getters.accountAddressType("MAILING");
    },

    addressService(state, getters) {
      return getters.accountAddressType("SERVICE");
    },

    addressOther(state, getters) {
      return getters.accountAddressType("OTHER");
    },

    contactBilling(state, getters) {
      return getters.accountContactType("BILLING");
    },

    contactAdministration(state, getters) {
      return getters.accountContactType("ADMINSTRATOR");
    },

    contactTechnical(state, getters) {
      return getters.accountContactType("TECHNICAL");
    },

    contactOnSiteAccess(state, getters) {
      return getters.accountContactType("ONSITE ACCESS");
    },

    contactOther(state, getters) {
      return getters.accountContactType("OTHER");
    },

    accountStatus(state) {
      return state.account.status === "ACTIVE" ? "Current" : "Inactive";
    },

    accountType(state) {
      let type = state.account.accountType;

      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    },

    accountCreatedDate(state) {
      return state.account.createdDate ? HelperService.formatDate(state.account.createdDate) : "";
    },

    account(state) {
      return state.account;
    },

    accountNumber(state) {
      return state.customerAccounts.length ? state.customerAccounts[0].accountId : null;
    },

    portalRole(state) {
      return state.userType;
    },

    portalRoleFormatted(state) {
      const [firstWord, secondWord] = state.userType.split("_");

      const firstWordCapital = firstWord[0].toUpperCase() + firstWord.slice(1);

      const secondWordCapital = secondWord[0].toUpperCase() + secondWord.slice(1);

      return `${firstWordCapital} ${secondWordCapital}`;
    },

    userLogin(state) {
      return state.userLogin;
    },

    userList(state) {
      return state.userList;
    },

    userListSorted(state) {
      let userListSorted = {
        owner: [],
        admin: [],
        standard: [],
      };

      state.userList.forEach((user) => {
        switch (user.portalRole) {
          case "account_owner":
            userListSorted.owner.push(user);
            break;
          case "account_admin":
            userListSorted.admin.push(user);
            break;
          case "account_user":
            userListSorted.standard.push(user);
            break;
        }
      });

      return userListSorted;
    },

    user(state) {
      return state.user;
    },

    userName(state) {
      const name = state.user?.firstName || "Name";
      const surname = state.user?.lastName || "Surname";

      return `${name} ${surname}`;
    },

    userEmail(state) {
      return state.user?.email || "test@gmail.com";
    },

    userAvatar(state) {
      return state.user?.avatar;
    },

    userNameFirstLetters(state) {
      const firstLetterInName = state.user?.firstName ? state.user.firstName[0].toUpperCase() : "N";
      const firstLetterInSurname = state.user?.lastName
        ? state.user.lastName[0].toUpperCase()
        : "S";

      return `${firstLetterInName}${firstLetterInSurname}`;
    },

    languages(state) {
      return state.languages;
    },

    bgImagePath(state) {
      const imageName = state.user?.imageName || "default.jpg";

      return require(`@/assets/images/backgrounds/${imageName}`);
    },

    isPropertyManager(state) {
      return state.userType === ROLES.manager;
    },

    isOwner(state) {
      return state.userType === "account_owner";
    },

    isManageUsers(state) {
      return state.userType === "account_owner" || state.userType === "account_admin";
    },

    customerName(state) {
      return state.customers?.customerInfo.length
        ? state.customers.customerInfo[0].customer.name
        : null;
    },

    contactRoles(state) {
      return state.contactRoles.length
        ? state.contactRoles.map((contactRole) => ({ id: contactRole.id, label: contactRole.name }))
        : null;
    },

    currentAccountId(state) {
      return state.customerAccounts.length ? state.customerAccounts[0].accountId : null;
    },

    currentClientId(state) {
      return state.customers.customerInfo.length
        ? state.customers.customerInfo[0].customer.clientId
        : null;
    },

    currentClientIdFromAccount(state) {
      return state.customerAccounts.length ? state.customerAccounts[0].clientId : null;
    },
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    SET_ACCOUNT(state, account) {
      state.account = account;
    },

    SET_CUSTOMER(state, customers) {
      state.customers = customers;
    },

    SET_CUSTOMER_ACCOUNTS(state, accounts) {
      state.customerAccounts = accounts;
    },

    SET_USER_TYPE(state, userType) {
      state.userType = userType;
    },

    SET_USER_LIST(state, userList) {
      state.userList = userList;
    },

    SET_CONTACTS_ROLES(state, contactRoles) {
      state.contactRoles = contactRoles;
    },

    SET_ADDRESS(state, { type, newAddress }) {
      const index = state.account.addresses.findIndex((address) => address.addressRoleType == type);

      state.account.addresses.splice(index, 1, newAddress);
    },
    ADD_ADDRESS(state, { newAddress }) {
      state.account.addresses.push(newAddress);
    },
    SET_CONTACT(state, { type, newContact }) {
      const index = state.account.contacts.findIndex((contact) => contact.contactRoleType == type);

      state.account.contacts.splice(index, 1, newContact);
    },
  },

  actions: {
    updateAddress(context, { type, newAddress }) {
      context.commit("SET_ADDRESS", { type, newAddress });
    },
    addAddress(context, { newAddress }) {
      context.commit("ADD_ADDRESS", { newAddress });
    },
    updateContact(context, { type, newContact }) {
      context.commit("SET_CONTACT", { type, newContact });
    },
    async getAccountInfos(context) {
      if (context.state.customerAccounts.length) {
        const response = await getAccountById(context.getters.currentAccountId);

        context.commit("SET_ACCOUNT", response);
      }
    },
    async getCustomersInfos(context) {
      const response = await getCustomers();

      context.commit("SET_CUSTOMER", response);
    },
    async getCustomerAccountsInfos(context) {
      if (context.getters.currentClientId) {
        const response = await getAccountsByClientId(context.getters.currentClientId);

        context.commit("SET_CUSTOMER_ACCOUNTS", response);
      }
    },

    async getUserProfile(context) {
      const response = await getUserProfile();

      context.commit("SET_USER", response);
    },

    async getUsersByAccountId(context) {
      if (context.state.customerAccounts.length) {
        const response = await getUsersByAccountId(context.getters.currentAccountId);

        context.commit("SET_USER_LIST", response);
      }
    },

    async getUserType(context) {
      if (context.state.userType) return;

      const response = await getUserType();

      context.commit("SET_USER_TYPE", response);
    },
    async updateUserProfile(context, userData) {
      const response = await updateUserProfile(userData);

      context.commit("SET_USER", response);
    },
    async getContactRoles(context, userData) {
      const response = await getContactRoles(userData);

      context.commit("SET_CONTACTS_ROLES", response);
    },
    async postContact(context, contactData) {
      contactData.clientId = context.getters.currentClientIdFromAccount;
      await postContact(contactData);
      await context.dispatch("getAccountInfos");
    },
  },
};
