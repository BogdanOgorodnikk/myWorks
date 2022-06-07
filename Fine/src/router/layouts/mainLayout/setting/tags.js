import i18n from "@/plugins/vue-i18n";

const TagList = () => import(/* webpackChunkName: "tag" */ "@/views/setting/tag/index");
const TagAdd = () => import(/* webpackChunkName: "tag" */ "@/views/setting/tag/add");
const TagEdit = () => import(/* webpackChunkName: "tag" */ "@/views/setting/tag/edit");

const companies = [
  {
    path: "settings/tags",
    name: "TagList",
    component: TagList,
    meta: {
      title: i18n.t("title.setting.tag.list"),
    },
  },
  {
    path: "settings/tags/0",
    name: "TagAdd",
    component: TagAdd,
    meta: {
      title: i18n.t("title.setting.tag.add"),
    },
  },
  {
    path: "settings/tags/:id",
    name: "TagEdit",
    component: TagEdit,
    meta: {
      title: i18n.t("title.setting.tag.edit"),
    },
  },
];

export default companies;
