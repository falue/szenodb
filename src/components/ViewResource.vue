<template>
  <div>
    <v-card-title class="pt-2">
      <span v-html="data.content.title"></span>
      <Copy :data="data.content.title" dataName="title" position="right"></Copy>
      <Copy v-if="user.role === 'admin'" :data="data.id" dataName="Document ID" position="right"></Copy>
    </v-card-title>

    <v-card-text v-if="data.content.name" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">Contact person</div>
      <span v-html="data.content.name"></span>
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
          <v-icon small color="primary" class="mr-1">mdi-translate</v-icon> {{$vuetify.breakpoint.smAndUp ? currentLanguage : ''}}
        </v-btn>

        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.resources}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'][0]}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'][0]}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'][0]}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'][0]}}</span>
      </v-card-text>

      <v-card-text v-if="data.content.info" class="pb-0">
        <div style="line-height:1em" class="grey--text overline">Opinions</div>
        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.info}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'][1]}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'][1]}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'][1]}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'][1]}}</span>
      </v-card-text>

      <v-card-text v-if="data.content.address" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">{{data.content.address.startsWith('http') ? 'Map' : 'Address'}}</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="data.content.address.startsWith('http') ? data.content.address :  this.$parent.$parent.createGoogleMapsLink(data.content.address)" target="_blank">
        {{data.content.address.startsWith('http') ? "Google Maps" : data.content.address }}
        </a>
      <Copy :data="data.content.address" dataName="address or link" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.tel" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">tel</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="'tel:'+ data.content.tel.replace(/ /g, '')">{{ data.content.tel }}</a>
      <Copy :data="data.content.tel" dataName="number" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.email" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">email</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="'mailto:'+ data.content.email">{{ data.content.email }}</a>
      <Copy :data="data.content.email" dataName="email" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.web" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">web</div>
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="this.$parent.$parent.createWebsiteUrl(data.content.web)" target="_blank">
        {{ data.content.web }}</a>
      <Copy :data="data.content.web" dataName="website" position="right"></Copy>
      </v-card-text>

      <v-card-text v-if="data.content.imgs.length" class="pb-0">
      <div style="line-height:1em" class="grey--text overline pb-2">{{ data.content.imgs.length == 1 ? '1 image' : data.content.imgs.length + " images" }}</div>
        <v-img class="inline-block elevation-8 mr-3 mb-3" v-for="(img, x) in data.content.imgs" :key="x" :src="img" max-height="350" max-width="350" lazy>
        </v-img>
      </v-card-text>

      <v-card-text class="pb-0 grey--text">
      <div style="line-height:1em" class="grey--text overline">rating</div>
      <v-icon v-for="x in data.content.rating" :key="x" small class="orange--text">mdi-star</v-icon>
      <v-icon v-for="n in 5-data.content.rating" :title="data.content.rating+n" :key="'A'+ n" small class="white--text">mdi-star-outline</v-icon>
      {{data.content.rating ? data.content.rating+'/5' : '(unrated)'}}
      </v-card-text>

      <v-card-text v-if="data.content.tel || data.content.email || data.content.adress" class="pb-0">
      <div style="line-height:1em" class="grey--text overline">Get contact</div>
      Download resource as VCard: <VCardExport :data="data.content"></VCardExport>
      </v-card-text>

      <v-card-text class="pb-4 grey--text" style="font-size:.75em">
        Created by <span :title="'User ID: '+data.userId">{{data.userName}}</span><!-- 
         --><Copy v-if="user.role === 'admin'" :data="data.userId" dataName="user ID"></Copy>,
        {{ $helpers.timeRelativeToNow(data.createdOn.toDate()) }},
        {{ $helpers.fbTimeToString(data.createdOn, "DD.MM.YY - HH:mm") }}
        <div v-if="data.editedOn && JSON.stringify(data.createdOn) != JSON.stringify(data.editedOn)">
          Edited
          {{ $helpers.timeRelativeToNow(data.editedOn.toDate()) }},
          {{ $helpers.fbTimeToString(data.editedOn, "DD.MM.YY - HH:mm") }}
        </div>
      </v-card-text>
    <v-card-actions class="pa-0 pt-2 fixed bottom grey darken-4 fill-width left" >
      <v-btn icon class="grey darken-3 mx-2" :small="$vuetify.breakpoint.mdAndUp" @click="$emit('editResource', data)">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-pencil</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="grey darken-3 mx-2"
        :small="$vuetify.breakpoint.mdAndUp"
        :color="user.favorites.includes(data.id) ? 'red' : ''"
        @click="favResource(data.id)">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-heart</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn right @click="$emit('close')" class="primary mr-2 mb-2">Close</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import Copy from '@/components/Copy'
import VCardExport from '@/components/VCardExport'

  export default {
    props: ['data', 'user'],
    components: {
      Copy, VCardExport
    },
    data() {
      return {
        currentLanguage: this.data.content.originalLang,
        languageIndex: 0,
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
      favResource(id) {
        const index = this.user.favorites.indexOf(id);
        if (index > -1) {
          this.user.favorites.splice(index, 1);
        } else {
          this.user.favorites = [...this.user.favorites, id];
        }
        this.$store.dispatch('updateField', {'collection':'users', 'document':this.user.uid,'field':'favorites', 'data': this.user.favorites})
      },

      switchLanguage() {
        this.languageIndex++;
        if(this.languageIndex >= this.languages.length) this.languageIndex = 0;
        this.$helpers.hideClass('lang');
        this.$helpers.showClass('lang-'+this.languages[this.languageIndex]);
        this.currentLanguage = this.languages[this.languageIndex];
      }
    }
  }
</script>

<style scoped>
</style>
