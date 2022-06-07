<template>
  <div class="file-upload" :class="theme">
    <div v-if="imageLink">
      <img class="file-upload-image" :src="imageLink" />
    </div>

    <OurSvgIcon v-else class="file-icon" name="Uploaded-file" size="xl" color="violet" />

    <div v-if="!files.length && !imageLink" class="label">
      {{ label }}
    </div>

    <template v-else-if="!isImageUpload">
      <div v-for="file in files" :key="file.id" class="label file-upload-name">
        <span>
          {{ file.name }}
        </span>

        <OurSvgIcon
          class="delete-icon"
          name="Close"
          size="xs"
          color="red"
          @click="onClickDeleteFile(file.id)"
        />
      </div>
    </template>

    <OurButton
      v-if="isShownDeleteImageButton"
      class="file-upload-button"
      :text="$t('button.removeImage')"
      :size="buttonSize"
      :variant="buttonVariant"
      @click="onClickDeleteFile"
    />

    <OurButton
      v-else
      class="file-upload-button"
      :text="buttonText"
      :size="buttonSize"
      :variant="buttonVariant"
      @click="onClickUploadFile"
    />

    <DragDrop :uppy="uppy" class="uppy-upload" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/vue";
import { getTheme } from "@ilevel/our.service.ui";
import OurSvgIcon from "../IconSvg";
import OurButton from "../Button";

export default {
  name: "OurFileInput",

  components: {
    OurButton,
    DragDrop,
    OurSvgIcon,
  },

  props: {
    isImageUpload: {
      type: Boolean,
      default: false,
    },

    imageLink: {
      type: String,
      default: "",
    },

    maxFileSizeInBytes: {
      type: Number,
      default: 10240000,
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    maxFiles: {
      type: Number,
      default: 3,
    },

    allowedFileTypes: {
      type: Array,
      default: () => [".png", ".jpg", ".jpeg", ".pdf", ".txt", ".doc", ".docx", "xls", ".xlsx"],
    },

    buttonSize: {
      type: String,
      default: "md",
    },

    buttonVariant: {
      type: String,
      default: "transparent",
    },
  },

  data: () => ({
    files: [],
  }),

  computed: {
    ...mapGetters("breakpoint", ["isPortableDevice"]),

    theme() {
      return getTheme();
    },

    label() {
      let label = "";

      if (this.isImageUpload) {
        label = this.isPortableDevice
          ? this.$t("component.ourFileUpload.selectImage")
          : this.$t("component.ourFileUpload.selectOrDragImage");
      } else {
        label = this.isPortableDevice
          ? this.$t("component.ourFileUpload.selectFile")
          : this.$t("component.ourFileUpload.selectOrDragFile");
      }

      return label;
    },

    buttonText() {
      return this.isImageUpload ? this.$t("button.selectImage") : this.$t("button.selectFile");
    },

    isShownDeleteImageButton() {
      const isExistImage = this.files.length || this.imageLink;

      return this.isImageUpload && isExistImage;
    },

    uppy() {
      return new Uppy({
        restrictions: {
          maxFileSize: this.maxFileSizeInBytes,
          maxNumberOfFiles: this.maxFilesNumber,
          allowedFileTypes: this.allowedFileTypes,
        },
      });
    },

    maxFilesNumber() {
      return this.multiple ? this.maxFiles : 1;
    },
  },

  watch: {
    files: {
      handler: "onChangeFiles",
      deep: true,
    },
  },

  created() {
    this.uppy.on("file-added", () => {
      this.uploadFiles();
    });
  },

  methods: {
    onClickUploadFile() {
      document.querySelector(".uppy-Root").click();
    },

    uploadFiles() {
      const { files } = this.uppy.getState();

      this.files = Object.values(files);
    },

    onChangeFiles() {
      const filesData = this.files.map((file) => file.data);

      this.$emit("changeFiles", filesData);
    },

    onClickDeleteFile(id) {
      if (this.isImageUpload) {
        this.files = [];

        this.uppy.cancelAll();
      } else {
        const index = this.files.findIndex((file) => file.id === id);

        if (~index) {
          this.files.splice(index, 1);

          this.uppy.removeFile(id);
        }
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.file-upload {
  @apply relative;
  @apply flex flex-col items-center justify-center;
  @apply rounded-lg border border-dashed border-gray-300;
  @apply p-8;

  &:hover {
    @apply border-gray-400 bg-gray-50;
  }

  &-image {
    @apply h-16 w-16 rounded-lg;
  }

  .label {
    @apply text-sm;
    @apply mt-2;
  }

  &-name {
    @apply flex items-center font-medium;

    .delete-icon {
      @apply z-30 ml-4 cursor-pointer;
    }
  }

  &-button {
    @apply z-30 mt-4;
  }
}

.uppy-upload {
  @apply absolute top-0 left-0;
  @apply h-full w-full;
  @apply opacity-0;
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.file-upload {
    @apply border-2;

    &:hover {
      @apply border-violet-300 bg-violet-50;
    }

    .file-icon::v-deep {
      g [fill] {
        @apply fill-current text-violet-700;
      }
    }
  }
}
</style>
