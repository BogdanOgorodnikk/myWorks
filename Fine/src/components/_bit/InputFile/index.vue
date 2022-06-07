<template>
  <div>
    <div class="file-upload" :class="[theme, fileUploadClasses]">
      <div v-if="imageURL && withIcon">
        <img class="file-upload-image" :src="imageURL" />
      </div>

      <OurSvgIcon v-else-if="withIcon" class="file-icon" name="Uploaded-file" size="xl" />

      <slot v-if="!files.length">
        <div class="label">
          {{ label }}
        </div>
      </slot>

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
        :text="i18n.removeImageButton"
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

    <p v-if="error" class="error-message" data-cy="input-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/vue";
import { getTheme } from "@ilevel/our.service.ui";
import I18nServiceDefault from "@ilevel/our.service.i18n";
import OurSvgIcon from "@ilevel/our.ui.icon-svg";
import OurButton from "@ilevel/our.ui.button";

export default {
  name: "OurFileInput",

  components: {
    OurButton,
    DragDrop,
    OurSvgIcon,
  },

  props: {
    /**
     * Allows to upload only images.
     */
    isImageUpload: {
      type: Boolean,
      default: false,
    },

    /**
     * Show / hide upload icon.
     */
    withIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * Set URL for already uploaded image (for example for avatar).
     */
    imageURL: {
      type: String,
      default: "",
    },

    /**
     * Set max file size in megabytes.
     */
    maxFileSizeInMegabytes: {
      type: Number,
      default: 1,
    },

    /**
     * Allow to select multiple files.
     */
    multiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Set max number files for upload
     */
    maxFiles: {
      type: Number,
      default: 3,
    },

    /**
     * Set allowed file types.
     */
    allowedFileTypes: {
      type: Array,
      default: () => [".png", ".jpg", ".jpeg", ".pdf", ".txt", ".doc", ".docx", "xls", ".xlsx"],
    },

    /**
     * The size of the button.
     * @values sm, md, lg, xl
     */
    buttonSize: {
      type: String,
      default: "md",
    },

    /**
     * The variant of the button.
     * @values primary, secondary, thirdary, transparent
     */
    buttonVariant: {
      type: String,
      default: "transparent",
    },

    /**
     * Set error text for component.
     */
    error: {
      type: String,
      default: function () {
        this.$t("validation.required");
      },
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

    getTranslation() {
      const translate = (path) => this.$t(path);
      const options = { componentName: this.$options.name };

      return new I18nServiceDefault(translate, options).getTranslation;
    },

    i18n() {
      return {
        selectOrDragFile: this.getTranslation("selectOrDragFile"),
        selectOrDragImage: this.getTranslation("selectOrDragImage"),
        selectFile: this.getTranslation("selectFile"),
        selectImage: this.getTranslation("selectImage"),
        selectImageButton: this.getTranslation("selectImageButton"),
        selectFileButton: this.getTranslation("selectFileButton"),
        removeImageButton: this.getTranslation("removeImageButton"),
      };
    },

    fileUploadClasses() {
      return {
        "error-file-upload": this.error,
      };
    },

    label() {
      let label = "";

      if (this.isImageUpload) {
        label = this.isPortableDevice ? this.i18n.selectImage : this.i18n.selectOrDragImage;
      } else {
        label = this.isPortableDevice ? this.i18n.selectFile : this.i18n.selectOrDragFile;
      }

      return label;
    },

    buttonText() {
      return this.isImageUpload ? this.i18n.selectImageButton : this.i18n.selectFileButton;
    },

    isShownDeleteImageButton() {
      const isExistImage = this.files.length || this.imageURL;

      return this.isImageUpload && isExistImage;
    },

    maxFileSizeInBytes() {
      return this.maxFileSizeInMegabytes * Math.pow(2, 20);
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
      document.querySelector(".uppy-Root button").click();
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

<i18n>
en:
  selectOrDragFile: Select or drag file
  selectOrDragImage: Select or drag image in window
  selectFile: Select file
  selectImage: Select image
  selectImageButton: "Select image"
  selectFileButton: "Select file"
  removeImageButton: "Remove image"
ru:
  selectOrDragFile: Выберите или перетащите файл в это окно
  selectOrDragImage: Выберите или перетащите изображение в это окно
  selectFile: Выберите файл
  selectImage: Выберите изображение
  selectImageButton: "Выбрать картинку"
  selectFileButton: "Выбрать файл"
  removeImageButton: "Удалить картинку"
ua:
  selectOrDragFile: Оберіть або перетягніть файл в це вікно
  selectOrDragImage: Оберіть або перетягніть зображення в це вікно
  selectFile: Оберіть файл
  selectImage: Оберіть зображення
  selectImageButton: "Вибрати картинку"
  selectFileButton: "Вибрати файл"
  removeImageButton: "Видалити картинку"
</i18n>

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
    @apply text-center text-sm;
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

.file-icon::v-deep {
  g [fill] {
    @apply fill-current text-gray-400;
  }
}

.uppy-upload {
  @apply absolute top-0 left-0;
  @apply h-full w-full;
  @apply opacity-0;

  &::v-deep {
    .uppy-Root {
      @apply h-full w-full;
    }
  }
}

.error {
  &-message {
    @apply text-xs font-normal text-red-500;
    @apply mt-2 pl-4;
  }

  &-file-upload {
    @apply border-red-300;

    &:hover {
      @apply border-red-400 bg-red-50;
    }
  }
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
