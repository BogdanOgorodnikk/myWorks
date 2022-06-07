import i18n from "@/plugins/vue-i18n";

const ProjectList = () => import(/* webpackChunkName: "project" */ "@/views/setting/project/index");
const ProjectAdd = () => import(/* webpackChunkName: "project" */ "@/views/setting/project/add");
const ProjectEdit = () => import(/* webpackChunkName: "project" */ "@/views/setting/project/edit");

const projects = [
  {
    path: "settings/projects",
    name: "ProjectList",
    component: ProjectList,
    meta: {
      title: i18n.t("title.setting.project.list"),
    },
  },
  {
    path: "settings/projects/0",
    name: "ProjectAdd",
    component: ProjectAdd,
    meta: {
      title: i18n.t("title.setting.project.add"),
    },
  },
  {
    path: "settings/projects/:id",
    name: "ProjectEdit",
    component: ProjectEdit,
    meta: {
      title: i18n.t("title.setting.project.edit"),
    },
  },
];

export default projects;
