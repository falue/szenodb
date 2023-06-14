<template>
  <div @click="showBewareDialog">
    <v-card-title class="pt-2" style="max-width:85%">
      <v-tooltip bottom color="#303030">
        <template v-slot:activator="{ on, attrs }">
            <a
              :href="data.content.web ? $helpers.createWebsiteUrl(data.content.web) : `https://www.google.com/search?q=${data.content.title.replaceAll(' ', '+')}`"
              v-bind="attrs" v-on="on"
              class="no-underline"
              target="_blank"
            >
              <span class="white--text" :style="data.flags.unreliable ? 'text-decoration: line-through': ''">
                {{data.content.title}}
              </span>
            </a>
        </template>
        <span>{{data.content.web ? `Go to ${$helpers.retrieveDomain(data.content.web)}` : `Do a google for "${data.content.title}"`}}</span>
      </v-tooltip>
      <div class="nudge-y--25">
        <Copy :data="data.content.title" dataName="title" position="bottom"></Copy>
        <Copy v-if="user.role === 'admin'" :data="data.id" dataName="Document ID" position="bottom"></Copy>
        <a
          v-if="user.role === 'admin'"
          target="_blank"
          class="no-underline"
          :title="`Open Firebase document of ${data.content.title}`"
          :href="`https://console.firebase.google.com/project/szenodb/firestore/data/~2Fresources~2F${data.id}`"
        >
          <v-icon small class="orange--text ml-2">mdi-firebase</v-icon>
        </a>
      </div>
    </v-card-title>

    <v-card-text v-if="data.flags.deleted || data.flags.unreliable" :class="data.flags.deleted ? 'pink darken-2' : 'error darken-2'" class="pa-4 rounded relative">
      <div style="line-height:1em" class="white--text overline">
        <v-icon small color="yellow" class="mr-1">mdi-alert</v-icon>
        Flagged as {{data.flags.deleted ? 'deleted' : 'unreliable'}} by {{data.flags.userName}}<!-- 
        --><Copy v-if="user.role === 'admin'" :data="data.flags.userId" dataName="Flagger ID" position="top" opacity="1.0"></Copy>:
      </div>
      <p>
        {{data.flags.reason}}
      </p>
      {{ $helpers.fbTimeToString(data.flags.date, "DD.MM.YY - HH:mm") }}
      <v-btn small v-if="user.role === 'admin'" @click="removeUnreliableLabel(data.id)" class="right bottom absolute ma-2">Remove flag</v-btn>
    </v-card-text>

    <v-card-text v-if="data.content.name" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">Contact person</div>
      {{data.content.name}}
      <Copy :data="data.content.name" dataName="name" position="right"></Copy>
    </v-card-text>

      <v-card-text class="pb-0">
        <div style="line-height:1em" class="grey--text overline">Resources</div>
        <v-btn
          small
          class="right top ma-7 fixed"
          :title="`${{'DE':'Autotranslate to German','FR':'Autotranslate to French','EN-GB':'Autotranslate to English','IT':'Autotranslate to Italian','original':'See original'}[languages[languageIndex+1 > languages.length-1 ? 0 : languageIndex+1]]}`"
          @click="switchLanguage()"
        >
          <v-icon small color="primary" class="mr-1">mdi-translate</v-icon> {{$vuetify.breakpoint.smAndUp ? currentLanguage === 'original' ? data.content.originalLang : currentLanguage : ''}}
        </v-btn>

        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.resources}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'].resources}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'].resources}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'].resources}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'].resources}}</span>
      </v-card-text>

      <v-card-text v-if="data.content.info" class="pt-8 pb-0">
        <div style="line-height:1em" class="grey--text overline">Opinions</div>
        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.info}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'].info}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'].info}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'].info}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'].info}}</span>
      </v-card-text>

      <v-card-text v-if="data.content.address" class="pt-8 pb-0">
      <div style="line-height:1em" class="grey--text overline">{{data.content.address.startsWith('http') ? 'Map' : 'Address'}}</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="getAddressLink(data)" target="_blank">
        {{data.content.address.startsWith('http') ? "Google Maps" : data.content.address }}
        </a>
      <Copy :data="data.content.address" dataName="address or link" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.tel" class="pt-8 pb-0">
      <div style="line-height:1em" class="grey--text overline">tel</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="'tel:'+ data.content.tel.replace(/ /g, '')">{{ data.content.tel }}</a>
      <Copy :data="data.content.tel" dataName="number" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.email" class="pt-8 pb-0">
      <div style="line-height:1em" class="grey--text overline">email</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="'mailto:'+ data.content.email">{{ data.content.email }}</a>
      <Copy :data="data.content.email" dataName="email" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.web" class="pt-8 pb-0">
      <div style="line-height:1em" class="grey--text overline">web</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="$helpers.createWebsiteUrl(data.content.web)" target="_blank">
        {{ data.content.web }}</a>
      <Copy :data="data.content.web" dataName="website" position="right"></Copy>
      </v-card-text>

      <v-card-text class="pt-8 pb-0 grey--text">
      <div style="line-height:1em" class="grey--text overline">rating</div>
      <v-icon v-for="x in data.content.rating" :key="x" small class="orange--text">mdi-star</v-icon>
      <v-icon v-for="n in 5-data.content.rating" :title="data.content.rating+n" :key="'A'+ n" small class="white--text">mdi-star-outline</v-icon>
      {{data.content.rating ? data.content.rating+'/5' : '(unrated)'}}
      </v-card-text>

      <v-card-text class="pt-8 pb-0 grey--text">
        <div style="line-height:1em" class="grey--text overline">Private notes</div>
          <v-textarea filled small dense class="mt-2" hide-details single-line auto-grow rows="1" placeholder="Type away.." type="text"
            @input="saveNote()"
            v-model="user.notes[data.id]"
          >
            <v-icon slot="append" :color="savedNote ? 'primary' : ''">
              {{savedNote ? 'mdi-content-save-check' : 'mdi-pencil'}}
            </v-icon>
          </v-textarea>
        <v-icon :small="$vuetify.breakpoint.mdAndUp" color="primary">mdi-information</v-icon> These notes do not show up to other users. Use it to remind yourself where you needed this resource.
      </v-card-text>

      <v-card-text v-if="data.content.imgs.length" class="pt-8 pb-0">
        <div style="line-height:1em" class="grey--text overline pb-2">
          {{ data.content.imgs.length == 1 ? 'image (1)' : "images ("+ data.content.imgs.length + ")" }}
        </div>
        <div
          class="inline-block relative pr-3"
          v-for="(img, x) in data.content.imgs"
          :key="x"
          :style="$vuetify.breakpoint.sm ? 'width: 50%' : 'width: 100%'"
        >
          <v-img
            class="elevation-8 grey darken-3"
            @click="magnify(img, x)"
            :src="img.url"
            lazy
          >
          </v-img>
        </div>
      </v-card-text>

      <v-card-text v-if="data.content.tel || data.content.email || data.content.adress" class="pt-8 pb-0">
      <div style="line-height:1em" class="grey--text overline">Get contact</div>
      Download resource as VCard: <VCardExport :data="data.content"></VCardExport>
      </v-card-text>

      <v-card-text class="pb-4 grey--text" style="font-size:.75em">
        Created by <span :title="'User ID: '+data.userId">{{data.userName}}</span><!-- 
         --><Copy v-if="user.role === 'admin'" :data="data.userId" dataName="user ID"></Copy>
         <br v-if="$vuetify.breakpoint.xs">
         <span v-else>,</span>
        {{ $helpers.timeRelativeToNow(data.createdOn.toDate()) }},
        {{ $helpers.fbTimeToString(data.createdOn, "DD.MM.YY - HH:mm") }}
        <div v-if="data.editedOn && JSON.stringify(data.createdOn) != JSON.stringify(data.editedOn)">
          Edited by <span :title="'Editor ID: '+data.userIdEdited">{{data.userNameEdited}}</span><!-- 
         --><Copy v-if="user.role === 'admin'" :data="data.userIdEdited" dataName="Editor ID"></Copy>
         <br v-if="$vuetify.breakpoint.xs">
         <span v-else>,</span>
          {{ $helpers.timeRelativeToNow(data.editedOn.toDate()) }},
          {{ $helpers.fbTimeToString(data.editedOn, "DD.MM.YY - HH:mm") }}
        </div>
      </v-card-text>
    <v-card-actions class="pa-0 pt-2 fixed bottom grey darken-4 fill-width left" >
      <v-btn icon class="grey darken-3 mx-2" :small="$vuetify.breakpoint.mdAndUp" @click="$emit('editResource', data)">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-pencil</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <Share
        position="top"
        buttonClasses="mt-0"
        :text="makeShareText(data)"
        tooltip="Share this resource"
      ></Share>
      
      <v-btn
        icon
        class="grey darken-3 mx-2"
        :small="$vuetify.breakpoint.mdAndUp"
        :color="user.favorites && user.favorites.includes(data.id) ? 'red' : ''"
        @click="favResource(data.id)"
      >
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-heart</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn right @click="$emit('close')" class="primary mr-2 mb-2">Close</v-btn>
    </v-card-actions>

    <!-- MAGNIFY -->
    <v-dialog
      v-model="magnifyDialog"
      :max-width="$vuetify.breakpoint.sm
        ? '85%'
        : magnifyDialogImg.image && magnifyDialogImg.image.width > magnifyDialogImg.image.height ? '85%': '45%'
      "
      :fullscreen="$vuetify.breakpoint.xs"
      :ripple="false"
      scrollable
    >
      <v-card :ripple="false">
        <div v-if="$vuetify.breakpoint.smAndUp" class="text-right fixed top right">
          <v-btn icon @click="magnifyDialog = false" >
            <v-icon class="red--text">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-text class="pa-0" :class="$vuetify.breakpoint.xs ? 'relative' : ''">
            <v-img
              class="grey darken-3"
              :class="$vuetify.breakpoint.xs ? 'absolute fill-height fill-width' : 'relative'"
              :src="magnifyDialogImg.url"
              @click="magnifyDialog = false"
              :contain="$vuetify.breakpoint.xs"
            >
              
              <div v-if="data.content.imgs.length > 1"
                v-touch="{
                  left: () => magnifyPrev(),
                  right: () => magnifyNext(),
                }"
                @click.stop="magnifyPrev()"
                class="absolute left fill-height"
                :style="$vuetify.breakpoint.xs ? 'width:50%' : 'width:33%'"
              >
              </div>
              <div v-if="data.content.imgs.length > 1"
                v-touch="{
                  left: () => magnifyPrev(),
                  right: () => magnifyNext(),
                }"
                @click.stop="magnifyNext()"
                class="absolute right fill-height"
                :style="$vuetify.breakpoint.xs ? 'width:50%' : 'width:33%'"
              >
                <div v-if="$vuetify.breakpoint.xs" class="text-right fixed top right">
                  <v-btn icon @click.stop="magnifyDialog = false" >
                    <v-icon class="red--text">mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-img>
        </v-card-text>
      <v-card-actions class="px-2 py-1 caption grey--text">
        {{$helpers.truncate(magnifyDialogImg.name, 25)}}
        <v-spacer></v-spacer>
        {{ $moment(magnifyDialogImg.lastModified).format("DD.MM.YYYY") }}
        <v-spacer></v-spacer>
        <Share
          position="bottom"
          :text="magnifyDialogImg.url"
          tooltip="Share this image"
        ></Share>
      </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- WELCOME DIALOG -->
    <v-dialog
      v-model="bewareDialog"
      :width="$vuetify.breakpoint.smAndDown ? '85%' : '45%'"
      :fullscreen="$vuetify.breakpoint.xs"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 primary" style="word-break: initial;">
          BEWARE: The rules of szenodb
        </v-card-title>
        <v-card-text class="mt-4 white--text pt-4">
          <ol class="niceList mt-4 pl-0">
            <li>
              You do not talk about
              <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">people on the resources list</span>
              (they do not know they're on it)
            </li>
            <li class="italics">
              You do <span class="bolder">not</span> talk about
              <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">people on the resources list</span>
              (they do not know they're on it)
            </li>
            <li>
              You do talk a <span class="bolder"><span class="grey--text">*</span>lot<span class="grey--text">*</span></span>
              about <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">colleagues in the industry</span>
            </li>
            <li>
              Be nice and don't demand services like you're in a marketplace.
            </li>
            <li>
              This is a starting point for your own research.
            </li>
            <li>
              Double check. Some things might be outdated. 
            </li>
            <li>
              Be professional.
            </li>
            <li>
              Edit, create new, improve; become a colleague. <span class="italics pink--text">Or not, and just use it!</span>
            </li>
          </ol>

        </v-card-text>
        <v-card-actions class="grey darken-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeBewareDialog()" :disabled="!blockBewareDialog">
            {{blockBewareDialog ? 'Onwards!' : 'Please read the rules'}}
            <v-progress-circular
              :size="16"
              :width="2"
              v-if="!blockBewareDialog"
              indeterminate
              color="primary"
              class="ml-1"
            ></v-progress-circular>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Copy from '@/components/Copy'
import VCardExport from '@/components/VCardExport'
import Share from '@/components/Share'

  export default {
    name: 'ViewResourceComponent',
    props: ['data', 'user'],
    components: {
      Copy, VCardExport, Share
    },
    data() {
      return {
        currentLanguage: this.data.content.originalLang,
        languageIndex: 0,
        magnifyIndex: 0,
        magnifyDialog: false,
        noteTimeout: 0,
        savedNote: false,
        magnifyDialogImg: {},
        bewareDialog: false,
        blockBewareDialog: false,
        languages: ['original', 'DE', 'EN-GB', 'FR', 'IT']
      }
    },
    created() {
      // Remove original language from list
      const index = this.languages.indexOf(this.data.content.originalLang);
      if (index > -1) {
        this.languages.splice(index, 1);
      }
    },
    methods: {
      makeShareText(data) {
        let shareText = [
          // data.content.web ? `${this.$helpers.createWebsiteUrl(data.content.web)}\n` : '',
          data.content.web ? this.$helpers.createWebsiteUrl(data.content.web) : this.$helpers.getCurrentUrl(),
          "\n\n",
          data.content.title,
          "\n",
          this.$helpers.ellipsis(data.content.resources, 160, " (...)"),
          "\n",
          data.content.email || data.content.tel || data.content.address ? '\n' : '',
          [
            data.content.email ? data.content.email : '',
            data.content.tel ? data.content.tel.replace(/\s+/g, '') : '',
            data.content.address ? this.getAddressLink(data) : '',
          ].filter(n => n).join("\n"),
          data.content.email || data.content.tel || data.content.address ? '\n' : '',
          "\n",
          // ALT: `🛠️ Found on szenodb.ch 💜${this.$route.query.q && !data.content.web ? `\nFind more ${this.$route.query.q}: ${this.$helpers.getCurrentUrl()}` : ''}${data.content.web ? this.$helpers.getCurrentUrl() : ''}`,
          `🛠️ Found on szenodb.ch 💜\n${this.$route.query.q && data.content.web ? `Find more ${this.$route.query.q}: ` : ''}${data.content.web ? this.$helpers.getCurrentUrl() : ''}`,

        ]
        return  shareText.filter(n => n).join("");
      },

      getAddressLink(data) {
        return data.content.address.startsWith('http') ? data.content.address :  this.$parent.$parent.createGoogleMapsLink(data.content.address)
      },

      favResource(id) {
        const index = this.user.favorites.indexOf(id);
        if (index > -1) {
          this.user.favorites.splice(index, 1);
        } else {
          this.user.favorites = [...this.user.favorites, id];
        }
        this.$store.dispatch('updateField', {'collection':'users', 'document':this.user.uid,'field':'favorites', 'data': this.user.favorites})
      },

      removeUnreliableLabel(id) {
        this.$store.dispatch('updateField', {'collection':'resources', 'document':id,'field':'flags', 'data': {'status': false}});
        this.$emit('close');
      },

      switchLanguage() {
        this.languageIndex++;
        if(this.languageIndex >= this.languages.length) this.languageIndex = 0;
        this.$helpers.hideClass('lang');
        this.$helpers.showClass('lang-'+this.languages[this.languageIndex]);
        this.currentLanguage = this.languages[this.languageIndex];
      },

      magnify(imgData, index) {
        this.magnifyDialog = true;
        this.magnifyIndex = index;
        this.magnifyDialogImg = imgData;
      },

      magnifyPrev() {
        this.magnifyIndex = this.magnifyIndex-1;
        this.magnifyIndex = this.magnifyIndex < 0
          ? this.data.content.imgs.length-1
          : this.magnifyIndex;
        this.magnifyDialogImg = this.data.content.imgs[this.magnifyIndex];
      },

      magnifyNext() {
        this.magnifyIndex = this.magnifyIndex+1;
        this.magnifyIndex = this.magnifyIndex > this.data.content.imgs.length-1
          ? 0
          : this.magnifyIndex;
        this.magnifyDialogImg = this.data.content.imgs[this.magnifyIndex];
      },
      saveNote() {
        if(this.noteTimeout) {
          clearTimeout(this.noteTimeout);  // do not overlapp last search
        }
        this.noteTimeout = setTimeout(() => {
          this.$store.dispatch('updateField', {'collection':'users', 'document':this.user.uid,'field':'notes', 'data': this.user.notes});
          this.savedNote=true;
          setTimeout(() => {
            this.savedNote=false;
          }, 1250);
        }, 750);
      },

      showBewareDialog(event) {
        if(!this.user.seenBewareDialog) {
          this.bewareDialog = true;
          setTimeout(() => {
            this.blockBewareDialog = true;
          }, 6500);
          event.preventDefault();
        }
      },

      closeBewareDialog() {
        this.bewareDialog = false;
        // & write true to this.user.seenBewareDialog
        this.$store.dispatch('updateField', {
          "collection": "users", "document": this.user.uid, "field": "seenBewareDialog", "data": true
        }).then(async () => {
          console.log('Successful confirm.')
          // update local user
          this.user.seenBewareDialog = true;
          this.$store.commit('setUserProfile', this.user)
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      },
    }
  }
</script>

<style scoped>
.lang {
  white-space: pre-wrap;
}
</style>
