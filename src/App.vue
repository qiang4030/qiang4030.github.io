<template>
  <div class="app">
    <!-- <header class="header">
      <span class="title">Photo Editor</span>
    </header> -->
    <main class="main">
      <cropper
        ref="cropper"
        class="cropper"
        :src="image.src"
        :stencil-props="{
          minAspectRatio: 1,
        }"
        minWidth="120"
        minHeight="120"
        @change="change"
        v-if="image.src"
      ></cropper>

      <div class="size-info" v-if="size.width && size.height">
        <div>Width: {{ size.width }}px</div>
        <div>Height: {{ size.height }}px</div>
      </div>

      <div class="action-btn">
        <el-upload
          ref="file"
          action=""
          accept="image/*"
          :file-list="fileList"
          :http-request="customHttpRequest"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
          v-show="!image.src"
        >
          <el-button>Upload Image</el-button></el-upload
        >
        <template v-if="image.src">
          <el-button
            class="el-icon-delete"
            size="mini"
            @click="remove"
          ></el-button>
          <el-button @click="rotate(-90)" size="mini"
            ><i class="bx bx-rotate-left"></i
          ></el-button>
          <el-button @click="rotate(90)" size="mini"
            ><i class="bx bx-rotate-right"></i
          ></el-button>
          <el-button size="mini" @click="reset"
            ><i class="bx bx-reset"></i
          ></el-button>
          <el-button
            class="el-icon-download"
            size="mini"
            @click="download"
          ></el-button>
          <el-button
            class="el-icon-upload2"
            size="mini"
            @click="upload"
          ></el-button>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
// This function is used to detect the actual image type,
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = "";
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}
// eslint-disable-next-line no-unused-vars
import { saveAs } from "file-saver";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
export default {
  components: {
    Cropper,
  },
  data() {
    return {
      image: {
        src: null,
        type: null,
      },
      size: {
        width: null,
        height: null,
      },
      fileList: [], // 上传文件列表
      uploadFile: null,
    };
  },

  methods: {
    customHttpRequest(data) {
      console.log(data.file);
      console.log("eee");
    },

    // eslint-disable-next-line no-unused-vars
    handleChange(file, fileList) {
      this.uploadFile = file.raw;
      const blob = URL.createObjectURL(file.raw);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, file.raw.type),
        };
      };
      reader.readAsArrayBuffer(file.raw);
    },

    download() {
      // const { canvas } = this.$refs.cropper.getResult();
      // canvas.toBlob((blob) => {
      //   saveAs(blob);  // 下载到本地
      // }, this.image.type);
      const result = this.$refs.cropper.getResult().canvas.toDataURL();
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${result}"></img>`;
    },

    async upload() {
      try {
        console.log(this.uploadFile);
        // 上传文件到服务器
        // ...
      } catch (error) {
        alert(error.message);
      }
    },

    remove() {
      this.image = {
        src: null,
        type: null,
      };
      this.size = {
        width: null,
        height: null,
      };
      this.$refs.file.clearFiles();
    },

    reset() {
      this.$refs.cropper.reset();
    },

    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },

    change(args) {
      const { coordinates } = args;
      this.size.width = Math.round(coordinates.width);
      this.size.height = Math.round(coordinates.height);
    },
  },

  destroyed() {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (this.image.src) {
      URL.revokeObjectURL(this.image.src);
    }
  },
};
</script>

<style lang="scss" scoped>
.app {
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
}

.header {
  background-color: #666;
  height: 56px;
  overflow: hidden;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.title {
  color: #fff;
  display: block;
  float: left;
  font-size: 1.125rem;
  line-height: 56px;
}

.main {
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .cropper {
    width: 100%;
    height: calc(100% - 112px);
  }

  .size-info {
    width: 100%;
    height: 56px;
    color: #fff;
    text-align: right;
    font-size: 12px;
    opacity: 0.6;
  }

  .action-btn {
    width: 100%;
    height: 56px;
    text-align: center;
  }
}
</style>