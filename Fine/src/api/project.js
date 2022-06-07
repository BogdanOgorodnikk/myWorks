import ApiService from "@/services/api.service";

export async function getProject(projectId) {
  const response = await ApiService.get(`/projects/${projectId}`);

  return response.data.data;
}

export async function getProjects(withLoader) {
  const response = await ApiService.get("/projects", { withLoader });

  return response.data.data;
}

export async function addProject(project) {
  const response = await ApiService.post("/projects", project, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateProject(project) {
  const response = await ApiService.patch(`/projects/${project.id}`, project, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateProjectSort(projectIds) {
  await ApiService.put("/projects/sort", projectIds, {
    withLoader: false,
  });
}

export async function deleteProject(projectId, delaySuccessNotify) {
  await ApiService.delete(`/projects/${projectId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getProject,
  getProjects,
  addProject,
  updateProject,
  updateProjectSort,
  deleteProject,
};
