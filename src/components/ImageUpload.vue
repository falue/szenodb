<template>
<div>
    <div class="relative inline-block">
      <v-btn
        icon
        class="mb-2 mr-2"
        :class="btnClasses"
      >
        <v-icon v-if="!loading">mdi-image</v-icon>
        <v-progress-circular
            v-else
            :size="26"
            :width="3"
            indeterminate
            color="primary lighten-1"
        ></v-progress-circular>
      </v-btn>
      <input
        type="file"
        :accept="imagesOnly ? 'image/*' : ''"
        @change="onChange($event)"
        title=""
        class="pointer"
      />
    </div>
    <label
      v-if="labelText"
      :class="labelClasses">
      {{labelText}}
    </label>
    </div>
</template>

<script>
  // based on https://github.com/wenzhixin/vue-base64-upload/
  export default {
    props: ['btnClasses', 'imagesOnly', 'maxFileSizeMb', 'imageSize', 'labelText', 'labelClasses'],
    data() {
      return {
          loading: false,
      }
    },
    methods: {
      onChange(event) {
        if (event.target.files && event.target.files[0]) {
          this.loading = true;
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.addEventListener('load', e => {
            this.src = e.target.result;
            let [, base64] = this.src.split(',');
            this.checkFile({
              data: file,
              size: file.size,
              type: file.type,
              name: file.name,
              base64: base64
            })
          });
          reader.readAsDataURL(file);
          event.target.value='';
        }
        this.$emit('close');
      },

      async checkFile(file) {
        if(this.imagesOnly && file.type.indexOf('image/') < 0) {
          this.$emit('error', {'message': 'This is not an image.'});
            this.loading = false;
          return false;

        } else if (file.size > this.maxFileSizeMb * 1000000) {
          this.$emit('error', {'message': `Image can not be bigger than ${this.maxFileSizeMb}mb`});
            this.loading = false;
          return false;

        } else {
          // Check img Orientation & image size 0.3mb: resize img
          if (this.imagesOnly) {
            // Check if file size is about proportional to image dimensions. if not, resize.
            let ballparkFilesize = this.imageSize * this.imageSize *16 /8 /1024 /1024 + 0.1;  // plus 0.1 headroom
            if(file.size /1000 /1000 > ballparkFilesize) {
              file.base64 = await this.$helpers.resizeBase64Img(file.base64, file.type, this.imageSize, this.imageSize).catch(() => {});
            }

            // Check EXIF orientation
            let orientation = await this.$helpers.getImageOrientation(file.data).catch(() => {});

            // Reset orientation if turned by EXIF data
            if(orientation === 8) {
              file.base64 = await this.$helpers.rotateBase64Image(file.base64, file.type, 270).catch(() => {});
            } else if(orientation === 6) {
              file.base64 = await this.$helpers.rotateBase64Image(file.base64, file.type, 90).catch(() => {});
            } else if(orientation === 3) {
              file.base64 = await this.$helpers.rotateBase64Image(file.base64, file.type, 180).catch(() => {});
            }
          }
          this.$emit('base64', `data:${file.type};base64,${file.base64}`);
            this.loading = false;
        }
      },
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
    height: 100%;
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
</style>
