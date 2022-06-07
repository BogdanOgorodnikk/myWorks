import Vue from "vue";
import Vuex from "vuex";

// Common modules
import layout from "@/store/modules/layout.module";
import loader from "@/store/modules/loader.module";
import breakpoint from "@/store/modules/breakpoint.module";
import auth from "@/store/modules/auth.module";
import user from "@/store/modules/user.module";
// Project related modules
import business from "@/store/modules/business.module";
import transaction from "@/store/modules/transaction.module";
import company from "@/store/modules/company.module";
import bankAccount from "@/store/modules/bankAccount.module";
import currency from "@/store/modules/currency.module";
import accountIntegration from "@/store/modules/accountIntegration.module";
import category from "@/store/modules/category.module";
import contragent from "@/store/modules/contragent.module";
import project from "@/store/modules/project.module";
import tag from "@/store/modules/tag.module";
import settings from "@/store/modules/settings.module";
import permission from "@/store/modules/permission.module";
import role from "@/store/modules/role.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
    loader,
    breakpoint,
    auth,
    user,
    business,
    transaction,
    company,
    bankAccount,
    currency,
    accountIntegration,
    category,
    contragent,
    project,
    tag,
    settings,
    permission,
    role,
  },
});
