import ApiService from "@/services/api.service";

export async function getTag(tagId) {
  const response = await ApiService.get(`/tags/${tagId}`);

  return response.data.data;
}

export async function getTags(withLoader) {
  const response = await ApiService.get("/tags", { withLoader });

  return response.data.data;
}

export async function addTag(tag) {
  const response = await ApiService.post("/tags", tag, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateTag(tag) {
  const response = await ApiService.patch(`/tags/${tag.id}`, tag, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateTagSort(tags) {
  await ApiService.put("/tags/sort", tags, {
    withLoader: false,
  });
}

export async function deleteTag(tagId, delaySuccessNotify) {
  await ApiService.delete(`/tags/${tagId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getTag,
  getTags,
  addTag,
  updateTag,
  updateTagSort,
  deleteTag,
};
