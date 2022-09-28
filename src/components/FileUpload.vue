<template>
  <div>
    <v-tooltip :disabled="!tooltip || $vuetify.breakpoint.smAndDown" :bottom="!position || position === 'bottom'" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'" color="#212121">
      <template v-slot:activator="{ on, attrs }">
        <v-btn dense icon @click="$refs.fileInput.click()" :class="buttonClasses ? buttonClasses : 'pink darken-3'" v-bind="attrs" v-on="on">
          <v-icon v-if="progress === 0" :class="iconClasses ? iconClasses : 'white--text'" v-bind="attrs" v-on="on">
            mdi-{{icon ? icon : 'upload' }}
          </v-icon>
          <v-progress-circular v-else :value="progress">
            <div style="font-size:.85em; font-family:sans-serif; line-height:1em; letter-spacing:-1px">
              {{progress > 9 ? progress : progress+'%'}}
            </div></v-progress-circular>
        </v-btn>
      </template>
      <span>{{tooltip}}</span>
    </v-tooltip>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      :multiple="multiple"
      @change="startUpload"
      :accept="type ? type : 'image/*'"
    />
  </div>
</template>

<script>
import { storage } from '../firebase'
export default {
  props: ['type', 'target', 'multiple', 'orderStart', 'icon', 'iconClasses', 'buttonClasses', 'tooltip', 'position'],

  data() {
    return {
      downloadUrl: "",
      imageData: null,
      progress: 0,
      totalBytes: 0,
      totalFiles: 0,
      totalFilesUploaded: [],
    };
  },

  methods: {
    async startUpload(event) {
      this.$emit('uploadStarted');
      this.progress = 1;
      this.downloadUrl = null;
      this.totalFiles = event.target.files.length;
      this.totalFilesUploaded = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadData(event.target.files[i], event.target.files.length-i);
      }
    },
    async uploadData(fileData, order) {
      let path = [this.target, `${this.$helpers.createUid()}-${fileData.name}`].join("/");
      // console.log(path)
      // console.log(fileData);
      this.downloadUrl = '';
      let currentStorageRef =  storage.ref(path).put(fileData);
      // const storageRef = uploadBytes(path).put(fileData);
      currentStorageRef.on(`state_changed`, (snapshot) => {
          this.totalBytes = snapshot.totalBytes;
          // Increment progress for one file
          if(this.totalFiles === 1) {
            this.progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          }
        },(error) => {
          console.log(error.message);
          this.$emit('error', error.message)
        },() => {
          if(this.totalFiles === 1) {
            this.progress = 100;
            this.$emit('finished');
          }
          currentStorageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.downloadUrl = url;
            this.$emit('uploaded', {
              name: fileData.name,
              url: this.downloadUrl,
              order: (this.orderStart ? this.orderStart : 0) + order - this.totalFilesUploaded.length - 1,
              lastModified: fileData.lastModified,
              type: fileData.type,
              size: fileData.size,
              comment: '',
              humanSize: this.$helpers.humanSize(fileData.size)
            })
            if(this.totalFiles === 1) {
              // Reset progress for one file
              this.progress = 0;
            } else {
              // Increment progress now for multiple files
              this.totalFilesUploaded.push(this.downloadUrl)
              this.progress = parseInt((this.totalFilesUploaded.length / this.totalFiles) * 100)
              // Reset progress now for multiple files
              if(this.totalFilesUploaded.length == this.totalFiles) {
                this.progress = 0;
                this.$emit('finished');
              }
            }
            this.totalBytes = 0;
            this.$refs.fileInput.value='';  // reset form for later use of the same file
          });
        }
      );
    },
  },
};
</script>
