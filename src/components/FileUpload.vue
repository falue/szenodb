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
      //downloadUrl: "",
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
      // this.downloadUrl = null;
      this.totalFiles = event.target.files.length;
      this.totalFilesUploaded = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadData(event.target.files[i], event.target.files.length-i);
      }
    },
    async uploadData(fileData, order) {
      console.log("Start upload file ", fileData.name)

      // Check if is type image with absolute sizes (not vector)
      let isImage = fileData.type.startsWith('image/') && !fileData.type.startsWith('image/svg');

      // Get img sizes
      if(isImage) {
        let img = new Image()
        img.src = window.URL.createObjectURL(fileData)
        img.onload = () => {
          console.log(img.width + " " + img.height);
          fileData.imageType = "pixel";
          fileData.width = img.width;
          fileData.height = img.height;
        }
        img.remove()
      } else if(fileData.type.startsWith('image/')) {
        fileData.imageType = "vector";
      }

      let path = [this.target, `${this.$helpers.createUid()}-${fileData.name}`].join("/");
      // console.log(path)
      // console.log(fileData);
      // this.downloadUrl = '';
      let currentStorageRef =  storage.ref(path).put(fileData);
      // const storageRef = uploadBytes(path).put(fileData);
      currentStorageRef.on(`state_changed`, async (snapshot) => {
          this.totalBytes = snapshot.totalBytes;
          // Increment progress for one file
          if(this.totalFiles === 1) {
            this.progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          }
        },(error) => {
          console.log(error.message);
          this.$emit('error', error.message)
        },async () => {
          if(this.totalFiles === 1) {
            this.progress = 100;
            this.$emit('finished');
          }
          // If file is of type image (not type svg) and
          // file is bigger than 1000
          if(isImage && (fileData.width > 1000 || fileData.height > 1000)) {
            // to make second version named let pathResized = path.replace('.jpg', '_1000x1000.jpg')
            console.log("This image is bigger than 1000 width or height!");
            
            // Build image resizer name
            let pathResized = path.split('.')
            pathResized[pathResized.length-2] = pathResized[pathResized.length-2] + "_1000x1000"
            pathResized = pathResized.join('.')

            //   Wait for firebase extension "Resize Images" until file exists
            console.log("Wait for image resizer to finish image: ", pathResized);
            let sec = 0.0;
            let maxWaiting = 10.0;
            let exists = false
            let url = '';
            
            while(sec <= maxWaiting && !exists) {
              await this.$helpers.sleep(500);
              url = await this.checkIfFileExists(pathResized);
              exists = url ? true : false
              console.log("check if file exists: ", exists, ", ", sec)
              sec += .5;
            }

            if(url) {
              this.finylizeUploadOfFile(fileData, order, path, url)
            } else {
              console.log("did wait for 10s for image resizing. did not happen.");
              this.progress = 0;
              this.$emit('error', 'Could not get resized image on time.');
            }
    // !!! >>>>  then, change fb extension online to delete original file.<<<<
    // !!! >>>>  EVTL DO MARK NEW IMG AS PUBLIC ????.<<<<

          } else {
            // If not image, commence like we used to
            currentStorageRef.snapshot.ref.getDownloadURL().then((url) => 
              this.finylizeUploadOfFile(fileData, order, path, url)
            );
          }
        }
      );
    },

    async checkIfFileExists(pathResized) {
      return storage.ref().child(pathResized).getDownloadURL().then((url) => {
        return url
      }).catch(async () => {
        return false;
      });
    },

    // Siiiiide effects
    finylizeUploadOfFile(fileData, order, path, url) {
      // this.downloadUrl = url;
      this.$emit('uploaded', {
        name: fileData.name,
        path: path,
        url: url,
        order: (this.orderStart ? this.orderStart : 0) + order - this.totalFilesUploaded.length - 1,
        lastModified: fileData.lastModified,
        type: fileData.type,
        size: fileData.size,
        width: fileData.width ? fileData.width : 0,  // FIXME: If images was resized, this is not correct anymore
        height: fileData.height ? fileData.height : 0,  // FIXME: If images was resized, this is not correct anymore
        imageType: fileData.imageType ? fileData.imageType : 'data',
        comment: '',
        humanSize: this.$helpers.humanSize(fileData.size)
      })
      if(this.totalFiles === 1) {
        // Reset progress for one file
        this.progress = 0;
      } else {
        // Increment progress now for multiple files
        this.totalFilesUploaded.push(url)
        this.progress = parseInt((this.totalFilesUploaded.length / this.totalFiles) * 100)
        // Reset progress now for multiple files
        if(this.totalFilesUploaded.length == this.totalFiles) {
          this.progress = 0;
          this.$emit('finished');
        }
      }
      this.totalBytes = 0;
      this.$refs.fileInput.value='';  // reset form for later use of the same file
    },
  },
};
</script>
