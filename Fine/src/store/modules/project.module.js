import idb from "@/plugins/vue-idb-keyval";
import router from "@/router";
import {
  getProject,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  updateProjectSort,
} from "@/api/project";
import DataService from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    project: null,
    projects: [],
  },

  getters: {
    projectsForSelect(state) {
      const projects = state.projects;

      return projects.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_PROJECT(state, project = null) {
      state.project = project;
    },

    SET_PROJECTS(state, projects) {
      if (projects.length) {
        state.projects = projects.sort(DataService.compareValues("sort"));
      } else if (!Array.isArray(projects)) {
        state.projects.push(projects);
      }
    },

    UPDATE_PROJECT(state, project) {
      state.projects = DataService.updateArray(state.projects, [project]);
    },

    DELETE_PROJECT(state, projectId) {
      state.projects = state.projects.filter((project) => project.id !== projectId);
    },
  },

  actions: {
    async getProject(context, projectId) {
      if (!projectId) return;

      const response = await getProject(projectId);

      context.commit("SET_PROJECT", response);
    },

    async getProjects(context) {
      if (context.state.projects.length) return;

      const idbProjects = await idb.get("projects");
      const isPresentIdbData = !!idbProjects?.length;

      if (isPresentIdbData) {
        context.commit("SET_PROJECTS", idbProjects);
      }

      const response = await getProjects(!isPresentIdbData);

      context.commit("SET_PROJECTS", response);

      await idb.set("projects", response);
    },

    async addProject(context, project) {
      const response = await addProject(project);

      context.commit("SET_PROJECTS", response);

      await idb.set("projects", context.state.projects);

      await router.push({ name: "ProjectList" });
    },

    async updateProject(context, project) {
      const response = await updateProject(project);

      context.commit("UPDATE_PROJECT", response);

      await idb.set("projects", context.state.projects);

      await router.push({ name: "ProjectList" });
    },

    async updateProjectSort(context, projectIds) {
      await updateProjectSort(projectIds);
    },

    async deleteProject(context, { projectId, currentRoute, delaySuccessNotify = false }) {
      await deleteProject(projectId, delaySuccessNotify);

      context.commit("DELETE_PROJECT", projectId);

      await idb.set("projects", context.state.projects);

      if (currentRoute !== "ProjectList") {
        await router.push({ name: "ProjectList" });
      }
    },
  },
};
