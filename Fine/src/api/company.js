import ApiService from "@/services/api.service";

export async function getCompany(companyId) {
  const response = await ApiService.get(`/companies/${companyId}`);

  return response.data.data;
}

export async function getCompanies(withLoader) {
  const response = await ApiService.get("/companies", { withLoader });

  return response.data.data;
}

export async function addCompany(company) {
  const response = await ApiService.post("/companies", company, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateCompany(company) {
  const response = await ApiService.put(`/companies/${company.id}`, company, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateCompanySort(companies) {
  await ApiService.put("/companies/sort", companies, {
    withLoader: false,
  });
}

export async function deleteCompany(companyId, delaySuccessNotify) {
  await ApiService.delete(`/companies/${companyId}`, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getCompany,
  getCompanies,
  addCompany,
  updateCompany,
  updateCompanySort,
  deleteCompany,
};
