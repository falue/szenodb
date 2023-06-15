<!-- eslint-disable -->
<template>
  <div>
    <v-tooltip :disabled="!tooltip" :bottom="!position || position === 'bottom'" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'" color="#303030">
      <template v-slot:activator="{ on, attrs }">
        <v-btn dense icon @click="$refs.fileInput.click()" :class="buttonClasses ? buttonClasses : 'pink darken-3'" v-bind="attrs" v-on="on">
          <v-icon v-if="progress === 0 && !resizing" :class="iconClasses ? iconClasses : 'white--text'" v-bind="attrs" v-on="on">
            mdi-{{icon ? icon : 'upload' }}
          </v-icon>
          <v-progress-circular v-else :value="progress" :indeterminate="resizing">
            <div style="font-size:.85em; font-family:sans-serif; line-height:1em; letter-spacing:-1px">
              <v-icon v-if="resizing" class="heartBeat">mdi-fullscreen-exit</v-icon>
              <span v-else>{{progress > 9 ? progress : progress+'%'}}</span>
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
/* eslint-disable */
import { storage } from '../firebase'
export default {
  name: 'FileUploadComponent',
  props: ['type', 'target', 'multiple', 'maxImageSize', 'orderStart', 'icon', 'iconClasses', 'buttonClasses', 'tooltip', 'position'],

  data() {
    return {
      imageData: null,
      progress: 0,
      totalBytes: 0,
      totalFiles: 0,
      totalFilesUploaded: [],
      resizing: false,
    };
  },

  methods: {
    async startUpload(event) {
      this.$emit('uploadStarted');
      this.progress = 1;
      this.maxImageSize = this.maxImageSize ? this.maxImageSize : 0;
      this.totalFiles = event.target.files.length;
      this.totalFilesUploaded = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadData(event.target.files[i], event.target.files.length-i);
      }
    },
    
    async uploadData(fileData, order) {
      if(this.maxImageSize > 0) {
        this.resizing = true;  // display icon in GUI
        // Get image sizes and resize if necessary
        fileData = await this.processImage(fileData);
        this.resizing = false;  // display icon in GUI
      }

      // Create path with filename but with additional random ID to allow dulicate names of files
      let path = [this.target, `${this.$helpers.createUid()}-${fileData.name}`].join("/");
      
      // Save file to db, either original or from resized blob
      let currentStorageRef =  storage.ref(path).put(fileData.blob ? fileData.blob : fileData);
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
            this.finalizeUploadOfFile(fileData, order, path, url);
          });
        }
      );
    },

    // eslint-disable-next-line no-unused-vars
    async processImage(fileData) {
      // Check if is type image with absolute sizes (not vector)
      let isPixelImage = fileData.type.startsWith('image/') && !fileData.type.startsWith('image/svg');
      if(isPixelImage) {
        fileData.imageType = "image";
        // render image behind the scenes and get new sizes if necessary
        let resizedImage = await this.resizeImage(fileData, this.maxImageSize)
        .then(function (resizedImage) {
          return resizedImage
        }).catch(function (err) {
          console.error(err);
        });
        fileData.width = resizedImage.width;
        fileData.height = resizedImage.height;
        if(resizedImage.blob) fileData.blob = resizedImage.blob;
        return fileData;

      } else if(fileData.type.startsWith('image/')) {
        // Was vector/svg/other img type?..
        fileData.imageType = fileData.type;
        return fileData;

      } else {
        // Was data
        return fileData;
      }
    },

    // Siiiiide effects
    finalizeUploadOfFile(fileData, order, path, url) {
      this.$emit('uploaded', {
        name: fileData.name,
        path: path,
        url: url,
        lastModified: fileData.lastModified,
        fileSize: fileData.blob ? fileData.blob.size : fileData.size,
        humanSize: this.$helpers.humanSize(fileData.blob ? fileData.blob.size : fileData.size),
        type: fileData.type,
        ...(fileData.imageType && {
            image: {
              imageType: fileData.imageType,
              width: fileData.width,
              height: fileData.height,
              aspect: fileData.width / fileData.height,
            }
          }),
        order: (this.orderStart ? this.orderStart : 0) + order - this.totalFilesUploaded.length - 1,
        comment: '',
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

    /* COPY PASTA */
    /* https://stackoverflow.com/a/39235724 */
    resizeImage(file, maxSize) {
      var reader = new FileReader();
      var image = new Image();
      var canvas = document.createElement('canvas');
      var dataURItoBlob = function (dataURI) {
          var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
              atob(dataURI.split(',')[1]) :
              unescape(dataURI.split(',')[1]);
          var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var max = bytes.length;
          var ia = new Uint8Array(max);
          for (var i = 0; i < max; i++)
              ia[i] = bytes.charCodeAt(i);
          return new Blob([ia], { type: mime });
      };

      var resize = function() {
          var width = image.width;
          var height = image.height;
          if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
          } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
          }

          // Don't do canvas rendering if image was small enough
          if(width != image.width) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');
            canvas.remove();

            return {
              blob: dataURItoBlob(dataUrl),
              width: parseInt(width),
              height: parseInt(height),
            };
          } else {
            return {
              width: image.width,
              height: image.height,
            }
          }
      };

      return new Promise(function (ok, no) {
          if (!file.type.match(/image.*/)) {
              no(new Error("Not an image"));
              return;
          }
          reader.onload = function (readerEvent) {
              image.onload = function () { 
                return ok(resize());
              };
              image.src = readerEvent.target.result;
          };
          reader.readAsDataURL(file);
      });
    },
  },
};
</script>
