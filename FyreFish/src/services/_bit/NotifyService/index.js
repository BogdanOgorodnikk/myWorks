import Vue from "vue";
import { notify as notifyConfig } from "@ilevel/our.service.ui";

export default class NotifyServiceDefault {
  notify(settings) {
    const { type, title, text, code, duration, ignoreDuplicates, closeOnClick, data } = settings;

    Vue.notify({
      group: "notify",
      type,
      title: title || "",
      text: text || "",
      duration: duration || notifyConfig.duration.short,
      ignoreDuplicates: ignoreDuplicates || false,
      closeOnClick: closeOnClick || false,
      data: { ...data, code },
    });
  }

  success(code, duration = notifyConfig.duration.short) {
    this.notify({
      type: "success",
      code: code,
      duration: duration,
    });
  }

  warning(code, duration = notifyConfig.duration.medium) {
    this.notify({
      type: "warning",
      code: code,
      duration: duration,
    });
  }

  error(code, duration = notifyConfig.duration.long) {
    this.notify({
      type: "error",
      code: code,
      duration: duration,
      ignoreDuplicates: true,
    });
  }

  clearAll() {
    Vue.notify({
      group: "notify",
      clean: true,
    });
  }
}
