<template>
<!--  -->
  <form @submit.prevent="dataMode === 'new' ? $emit('new', data) : $emit('edit', {'newData': data, 'oldData': oldData});">
    <!-- Use v-model="..." @change="..." instead of v-model: massive typing speed improvements -->
    <v-text-field style="width:40%; display:inline-block" class="mr-2" type="text" v-model="data.title" :rules="requiered">
      <template v-slot:label>Firm/resource<span v-if="data.title.length == 0" class="red--text">*</span></template>
    </v-text-field>
    <v-text-field label="Contact person" style="width:55%; display:inline-block" type="text" v-model="data.name"></v-text-field>
    <v-textarea auto-grow rows="3" hint="Resources or services of this business. Will auto translate to EN/DE/FR/IT." type="text" :rules="requiered" v-model="data.resources">
      <template v-slot:label>Resources<span v-if="data.resources.length == 0" class="red--text">*</span></template>
    </v-textarea>
    <v-textarea auto-grow rows="3" label="Opinions" hint="Delivery speed, what to look out for, etc. Will auto translate to EN/DE/FR/IT." type="text" v-model="data.info"></v-textarea>
    <v-text-field label="Address" hint="Can be typed address, google share link or general region." type="text" v-model="data.address"></v-text-field>
    <v-text-field label="Telephone" style="width:40%; display:inline-block" class="mr-2" type="text" v-model="data.tel"></v-text-field>
    <v-text-field label="Email" style="width:55%; display:inline-block" type="text" v-model="data.email"></v-text-field>
    <v-text-field label="Website" type="text" v-model="data.web"></v-text-field>

    <!-- IMAGE MANAGER -->
    <!-- <div class="grey--text text--lighten-1 caption mt-1 mb-1">Images</div>
    <ImageUpload
      btnClasses="white--text grey lighten-1"
      labelClasses="grey--text text--darken-1"
      labelText="Upload an image.."
      :imagesOnly="true"
      :maxFileSizeMb="12"
      :imageSize="400"
      @base64="saveNewImage($event)"
      @error="error = $event.message"
    ></ImageUpload>

    <-- IMAGE PREVIEW --
    <div v-if="data.imgs && data.imgs.length">
      <v-img class="black inline-block mr-3 mb-3" v-for="(img, x) in data.imgs" :key="x" :src="img" contain height="125" width="125" >
        <v-btn
          fab x-small absolute light top right class="black--text mt-7 mr-0 pa-0"
          @click="removeImg(x)"
        ><v-icon x-small>mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-if="x != 0"
          fab x-small absolute light bottom right class="black--text mb-7 mr-0 pa-0"
          :class="x != data['imgs'].length-1 ? 'nudge-x--400' : ''"
          @click="shiftImg(x, x-1)"
        ><v-icon large>mdi-menu-left</v-icon>
        </v-btn>
        <v-btn
          v-if="x != data['imgs'].length-1"
          fab x-small absolute light bottom right class="black--text mb-7 mr-0 pa-0"
          @click="shiftImg(x, x+1)"
        ><v-icon large>mdi-menu-right</v-icon>
        </v-btn>
      </v-img>
    </div>
    <hr class="my-2" style="border:none; border-top: solid 1px rgba(255,255,255,.75);"> -->
    
    <div class="grey--text text--lighten-1 caption mt-0 mb-1">Rating</div>
    <v-icon v-for="x in data.rating" :key="x" medium class="orange--text" @click="data.rating = x">mdi-star</v-icon>
    <v-icon v-for="n in 5-data.rating" :title="data.rating+n" :key="'A'+ n" medium class="grey--text" @click="data.rating = data.rating+n">mdi-star-outline</v-icon>
    {{data.rating ? data.rating+'/5' : '(unrated)' }}
    <hr class="my-2" style="border:none; border-top: solid 1px rgba(255,255,255,.75);">

    <!-- SUBMIT BUTTONS -->
    <!-- ACTIONS WHEN NEW -->
    <v-card-actions v-if="dataMode === 'new'" class="pt-2 pb-1 fixed bottom grey darken-4 fill-width left">
      <v-btn :disabled="disableClose" right @click="$emit('cancel')" class="mr-2 mb-2">Close</v-btn>
      <v-spacer></v-spacer>

      <!-- CSV IMPORT -->
      <CsvImport @csvImporting="$emit('csvImporting', $event), checkDisableClose($event)"></CsvImport>

      <v-spacer></v-spacer>

      <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" top>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn
              @mouseenter="checkShiftKey($event)"
              @mousemove="checkShiftKey($event)"
              @mouseleave="shiftKeyPressed = false"
              @mouseout="shiftKeyPressed = false"
              :color="shiftKeyPressed ? 'green' : 'primary'"
              @click="if(shiftKeyPressed) data.newAndNext = true"
              type="submit" class="mr-2 mb-2"
              :disabled="data.title === '' || data.resources === ''"
            >
              {{shiftKeyPressed ? 'Save & next' : 'Save'}}
            </v-btn>
          </div>
        </template>
        <span>{{data.title === '' || data.resources === '' ? 'Please enter at least Firm & some resources' : 'Shift & Click to save open new'}}</span>
      </v-tooltip>
    </v-card-actions>

    <!-- ACTIONS WHEN EDITING -->
    <v-card-actions v-else class="py-2 fixed bottom grey darken-4 fill-width left">
      <v-btn @click="$emit('cancel')">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="user.role === 'admin'" icon class="red mx-2" :small="$vuetify.breakpoint.mdAndUp" @click="$emit('delete', data); $emit('cancel')">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn type="submit" color="primary" class="mr-0" :disabled="data.title === ''">Save Edit</v-btn>
    </v-card-actions>
  </form>
</template>

<script>
// import ImageUpload from '@/components/ImageUpload'
import CsvImport from '@/components/CsvImport'
  export default {
    props: ['data', 'dataMode', 'user'],
    components: {
      // ImageUpload, 
      CsvImport,
    },
    data() {
      return {
        requiered: [value => !!value || 'Required.'],
        oldData: {},
        newAndNext: false,
        shiftKeyPressed: false,
        disableClose: false,
      }
    },
    created() {
      // Save data for detecting changes for translation
      this.oldData = JSON.parse(JSON.stringify(this.data));
    },
    
    methods: {
      checkDisableClose(data){
        this.disableClose = true;
        if(data[1] === 0) this.disableClose = false;
      },
      checkShiftKey(event) {
        this.shiftKeyPressed = event.shiftKey;
      },
      
      /* IMAGES */
      saveNewImage(img) {
        this.data.imgs.unshift(img);
      },

      removeImg(index) {
        // console.log(index);
        this.data.imgs.splice(index, 1);
      },

      shiftImg(oldIndex, newIndex) {
        // console.log(oldIndex, newIndex);
        this.moveArray(this.data.imgs, oldIndex, newIndex)
      },

      moveArray(array, oldIndex, newIndex) {
        if (newIndex >= array.length) {
            newIndex = array.length - 1;
        }
        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        return array;
      },
    }
  }
</script>

<style scoped>
</style>
