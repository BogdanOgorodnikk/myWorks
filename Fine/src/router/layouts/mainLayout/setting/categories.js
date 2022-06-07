import i18n from "@/plugins/vue-i18n";

const CategoryList = () =>
  import(/* webpackChunkName: "category" */ "@/views/setting/category/index");
const CategoryAdd = () => import(/* webpackChunkName: "category" */ "@/views/setting/category/add");
const CategoryEdit = () =>
  import(/* webpackChunkName: "category" */ "@/views/setting/category/edit");

let category = [
  {
    path: "settings/categories",
    name: "CategoryList",
    component: CategoryList,
    meta: {
      title: i18n.t("title.setting.category.list"),
    },
  },
  {
    path: "settings/categories/0",
    name: "CategoryAdd",
    component: CategoryAdd,
    meta: {
      title: i18n.t("title.setting.category.add"),
    },
  },
  {
    path: "settings/categories/:id",
    name: "CategoryEdit",
    component: CategoryEdit,
    meta: {
      title: i18n.t("title.setting.category.edit"),
    },
  },
];

export default category;
