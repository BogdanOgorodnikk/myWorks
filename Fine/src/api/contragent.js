import ApiService from "@/services/api.service";
import i18n from "@/plugins/vue-i18n";

export const CONTRAGENT_TYPE = [
  {
    label: i18n.t("label.contact"),
    value: "contact",
  },
  {
    label: i18n.t("label.company"),
    value: "company",
  },
  {
    label: i18n.t("label.employee"),
    value: "employee",
  },
];

export async function getContragent(contragentId) {
  const response = await ApiService.get(`/counterparties/${contragentId}`);

  return response.data.data;
}

export async function getContragents(withLoader) {
  const response = await ApiService.get("/counterparties", { withLoader });

  return response.data.data;
}

export async function addContragent(contragent) {
  const response = await ApiService.post("/counterparties", contragent, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateContragent(contragent) {
  const response = await ApiService.patch(`/counterparties/${contragent.id}`, contragent, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteContragent(contragentId, delaySuccessNotify) {
  await ApiService.delete(`/counterparties/${contragentId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getContragent,
  getContragents,
  addContragent,
  updateContragent,
  deleteContragent,
  CONTRAGENT_TYPE,
};
