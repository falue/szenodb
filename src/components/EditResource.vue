<template>
<!--  -->
  <form @submit.prevent="dataMode === 'new' ? $emit('new', {...data, 'note': user.notes}) : $emit('edit', {'newData': {...data, 'note': user.notes}, 'oldData': oldData});">
    <!-- Use v-model="..." @change="..." instead of v-model: massive typing speed improvements -->
    <v-text-field filled style="" :style="addDetails ? 'display:inline-block; width:40%;' : ''" class="mr-2" type="text" v-model.trim="data.title" :rules="requiered">
      <template v-slot:label>Company/Title<span v-if="data.title.length == 0" class="red--text">*</span></template>
    </v-text-field>
    <v-text-field filled v-if="addDetails" label="Contact person" style="width:55%; display:inline-block" type="text" v-model.trim="data.name"></v-text-field>
    <v-textarea filled auto-grow rows="3" hint="Resources or services of this business. Will auto translate to EN/DE/FR/IT." type="text" :rules="requiered" v-model.trim="data.resources">
      <template v-slot:label>Resources<span v-if="data.resources.length == 0" class="red--text">*</span></template>
    </v-textarea>
    <v-textarea filled auto-grow rows="3" label="Opinions" hint="Delivery speed, what to look out for, etc. Will auto translate to EN/DE/FR/IT." type="text" v-model.trim="data.info"></v-textarea>
    <v-textarea filled auto-grow rows="1" label="Private note" hint="These notes do not show up to other users." type="text" v-model.trim="user.notes[data.id]"></v-textarea>
    <v-text-field filled v-if="addDetails" label="Address" hint="Can be typed address, google share link or general region." type="text" v-model.trim="data.address"></v-text-field>
    <v-text-field filled v-if="addDetails" label="Telephone" style="width:40%; display:inline-block" class="mr-2" type="text" v-model.trim="data.tel"></v-text-field>
    <v-text-field filled v-if="addDetails" label="Email" style="width:55%; display:inline-block" type="text" v-model.trim="data.email"></v-text-field>
    <v-text-field filled label="Website" type="text" v-model.trim="data.web"></v-text-field>

    <!-- IMAGE MANAGER -->
    <div v-if="addDetails">
      <div class="grey--text text--lighten-1 caption mt-1 mb-1">Images ({{data.imgs.length}})</div>
      <div class="px-2 py-2 mb-6 rounded white--text" style="background-color: #484848; border-bottom-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom: solid .08em #CCC !important">
        <FileUpload
          class="inline mr-2"
          type="image/*"
          :target="`resources/${data.id}`"
          :multiple="true"
          :maxImageSize="1000"
          :orderStart="data.imgs.length"
          icon="image-plus"
          iconClasses=""
          buttonClasses=""
          position="right"
          @uploaded="saveNewImage($event)"
          @error="$toasted.global.error({msg:$event})"
        ></FileUpload>
        {{data.imgs && data.imgs.length ? 'Upload more images..' : 'Upload images..'}}
          <!-- @finished="$emit('edit', {'newData': data, 'oldData': oldData})" -->
          <!-- @uploadStarted="test=[]" -->

        <!-- IMAGE PREVIEW -->
        <div v-if="data.imgs && data.imgs.length" class="mt-4">
          <v-hover
            v-for="(img, x) in data.imgs"
            :key="x"
            v-slot="{ hover }"
          >
            <v-img
              class="inline-block pa-0 pr-3 pl-1 mb-2"
              :class="hover || $vuetify.breakpoint.smAndDown ? 'grey darken-4' : ''"
              elevation-8
              style="vertical-align:middle; transition: background-color .4s ease-in-out;"
              :src="img.url"
              contain
              :height="$vuetify.breakpoint.xs ? '100%' : '50%'"
              :width="$vuetify.breakpoint.xs ? '100%' : '50%'"
            >
              <v-btn
                :style="hover || $vuetify.breakpoint.smAndDown ? 'opacity: 1' : ''"
                small color="red" icon absolute light top right class="red--text ma-0 pa-0"
                style="opacity: 0; transition: opacity .4s ease-in-out; background-color:rgba(255,255,255,.25)"
                @click="removeImg(x)"
              ><v-icon small>mdi-delete</v-icon>
              </v-btn>

              <div
                v-if="data['imgs'].length > 1"
                class="absolute bottom left fill-width"
                :class="x === 0 ? 'text-right pr-4' : x === data['imgs'].length-1 ? 'text-left pl-4' : 'text-center'"
                style="opacity: 0; transition: opacity .4s ease-in-out; background-color:rgba(255,255,255,.25)"
                :style="hover || $vuetify.breakpoint.smAndDown ? 'opacity: 1' : ''"
              >
                <v-btn
                  v-if="x > 1"
                  icon
                  class="mr-0 pa-0"
                  @click="shiftImg(x, 0)"
                ><v-icon dense medium color="primary" class="text-shadow--white">mdi-skip-previous</v-icon>
                </v-btn>
                <span v-else class="px-4"></span>
                <!-- :class="x != data['imgs'].length-1 ? 'nudge-x--400' : ''" -->
                <v-btn
                  v-if="x != 0"
                  icon
                  class="mr-0 pa-0"
                  @click="shiftImg(x, x-1)"
                ><v-icon large color="primary" class="text-shadow--white">mdi-menu-left</v-icon>
                </v-btn>

                <span v-if="x != 0 && x != data['imgs'].length-1" class="px-4"></span>

                <v-btn
                  v-if="x != data['imgs'].length-1"
                  icon
                  class="mr-0 pa-0"
                  @click="shiftImg(x, x+1)"
                ><v-icon large color="primary" class="text-shadow--white">mdi-menu-right</v-icon>
                </v-btn>

                <v-btn
                  v-if="x < data['imgs'].length-2"
                  icon
                  class="mr-0 pa-0"
                  @click="shiftImg(x, data['imgs'].length-1)"
                ><v-icon medium color="primary" class="text-shadow--white">mdi-skip-next</v-icon>
                </v-btn>
                <span v-else class="px-4"></span>
              </div>
            </v-img>
          </v-hover>
        </div>
      </div>
      <!-- <hr class="mt-2 mb-6" style="border:none; border-top: solid 1px rgba(255,255,255,.75);"> -->
    </div>

    <div v-if="addDetails">
      <div class="grey--text text--lighten-1 caption mt-0 mb-1">Rating</div>
      <div class="px-2 py-3 mb-6 rounded white--text" style="background-color: #484848; border-bottom-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom: solid .08em #CCC !important">
        <v-icon v-for="x in data.rating" :key="x" medium class="orange--text" @click="data.rating = x">mdi-star</v-icon>
        <v-icon v-for="n in 5-data.rating" :title="data.rating+n" :key="'A'+ n" medium class="grey--text" @click="data.rating = data.rating+n">mdi-star-outline</v-icon>
        {{data.rating ? data.rating+'/5' : '(unrated)' }}
      </div>
    </div>

    <v-btn @click="addDetails = !addDetails" class="fill-width mt-4">
      {{addDetails ? 'Less details' : 'Add details'}}
      <v-icon :small="$vuetify.breakpoint.mdAndUp" class="ml-2">mdi-{{addDetails ? 'chevron-up' : 'chevron-down-circle'}}</v-icon>
    </v-btn>
    

    <!-- SUBMIT BUTTONS -->
    <!-- ACTIONS WHEN NEW -->
    <v-card-actions v-if="dataMode === 'new'" class="pt-2 pb-1 fixed bottom grey darken-4 fill-width left">
      <v-btn :disabled="disableClose" right @click="$emit('cancel')" class="mr-2 mb-2">Close</v-btn>
      <v-spacer></v-spacer>

      <!-- CSV IMPORT -->
      <CsvImport @csvImporting="$emit('csvImporting', $event), checkDisableClose($event)"></CsvImport>

      <v-spacer></v-spacer>

      <v-tooltip top color="#303030">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn
              @mouseenter="checkShiftKey($event)"
              @mousemove="checkShiftKey($event)"
              @mouseleave="shiftKeyPressed = false"
              @mouseout="shiftKeyPressed = false"
              :color="data.title === '' || data.resources === '' ? 'red' :shiftKeyPressed ? 'green' : 'primary'"
              :style="data.title === '' || data.resources === '' ? 'pointer-events: none' : ''"
              @click="if(shiftKeyPressed) data.newAndNext = true"
              type="submit" class="mr-2 mb-2"
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
      <v-btn icon class="red mx-2" :small="$vuetify.breakpoint.mdAndUp" @click="flag($event, data)">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn type="submit" color="primary" class="mr-0" :disabled="data.title === ''">Save Edit</v-btn>
    </v-card-actions>
    
    <hr class="my-8 py-8" style="border:none !important;">
  </form>
</template>

<script>
import FileUpload from '@/components/FileUpload'
import CsvImport from '@/components/CsvImport'
  export default {
    props: ['data', 'dataMode', 'user'],
    components: {
      FileUpload,
      CsvImport,
    },
    data() {
      return {
        requiered: [value => !!value || 'Required.'],
        oldData: {},
        newAndNext: false,
        shiftKeyPressed: false,
        disableClose: false,
        addDetails: false,
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
      flag(event, data) {
        this.$emit('flag', {
          shiftKey: event, data: {
            id: data.id,
            content: data,
            flags: {
              // FIXME: ignores what is currently set
              // FIXME: forgets reason
              deleted:false,
              unreliable:false,
              reason:'',
            }
          }
        });
        this.$emit('cancel');
      },

      saveNewImage(event) {
        this.data.imgs.push(JSON.parse(JSON.stringify(event)));
        this.data.imgs.sort((a, b) => b.order - a.order);
      },
      
      /* IMAGES */
      removeImg(index) {
        // console.log(index);
        this.data.imgs.splice(index, 1);
        this.setNewImageOrder();
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
        // write to imgs[{.order: newIndex}]
        this.setNewImageOrder();
        return array;
      },
      setNewImageOrder() {
        // Save new order key to resource data
        for (let i = 0; i < this.data.imgs.length; i++) {
          // console.log(this.data.imgs.length-i-1, this.data.imgs[i].name, this.data.imgs[i].order)
          this.data.imgs[i].order = this.data.imgs.length-i-1;
        }
      }
    }
  }
</script>

<style scoped>
</style>
