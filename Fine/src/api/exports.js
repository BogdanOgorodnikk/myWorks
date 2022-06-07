import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";
import notify from "@/services/notify.service";

export const EXPORT_STATUS = {
  done: "done",
  error: "error",
};

export const TIME_TO_REFRESH_GET_EXPORT_STATUS = 3000;

export async function getExportStatus(id) {
  const response = await ApiService.get(`/exports/${id}`, { withLoader: false });

  return response.data.data;
}

export async function downloadExport(id) {
  const token = JwtService.getAuthToken();

  const exportingTransactionInterval = setInterval(async () => {
    const exportStatus = await getExportStatus(id);

    if (exportStatus.status === EXPORT_STATUS.done) {
      notify.success("successExport");

      const response = await ApiService.get(`/exports/${id}/download?token=${token}`, {
        withLoader: false,
      });

      window.location.href = response.request.responseURL;

      return clearInterval(exportingTransactionInterval);
    } else if (exportStatus.status === EXPORT_STATUS.error) {
      notify.error("failedExport");

      return clearInterval(exportingTransactionInterval);
    }
  }, TIME_TO_REFRESH_GET_EXPORT_STATUS);
}

export default {
  EXPORT_STATUS,
  TIME_TO_REFRESH_GET_EXPORT_STATUS,
  getExportStatus,
  downloadExport,
};
