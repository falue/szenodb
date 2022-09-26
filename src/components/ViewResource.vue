<template>
  <div>
    <v-card-title class="pt-2" style="max-width:85%">
      <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" bottom color="#212121">
        <template v-slot:activator="{ on, attrs }">
            <a
              :href="data.content.web ? $helpers.createWebsiteUrl(data.content.web) : `https://www.google.com/search?q=${data.content.title.replaceAll(' ', '+')}`"
              v-bind="attrs" v-on="on"
              class="no-underline"
              target="_blank"
            >
              <span v-html="data.content.title" class="white--text" :style="data.flags.unreliable ? 'text-decoration: line-through': ''"></span>
            </a>
        </template>
        <span>{{data.content.web ? `Go to ${$helpers.retrieveDomain(data.content.web)}` : `Do a google for "${data.content.title}"`}}</span>
      </v-tooltip>
      <Copy :data="data.content.title" dataName="title" position="bottom"></Copy>
      <Copy v-if="user.role === 'admin'" :data="data.id" dataName="Document ID" position="bottom"></Copy>
    </v-card-title>

    <v-card-text v-if="data.flags.deleted || data.flags.unreliable" :class="data.flags.deleted ? 'pink darken-2' : 'error darken-2'" class="pa-4 rounded relative">
      <div style="line-height:1em" class="white--text overline">
        Flagged as {{data.flags.deleted ? 'deleted' : 'unreliable'}} by {{data.flags.userName}}<!-- 
        --><Copy v-if="user.role === 'admin'" :data="data.flags.userId" dataName="Flagger ID" position="top" opacity="1.0"></Copy>:
        <v-icon small color="yellow" >mdi-alert</v-icon>
      </div>
      <p>
        {{data.flags.reason}}
      </p>
      {{ $helpers.fbTimeToString(data.flags.date, "DD.MM.YY - HH:mm") }}
      <v-btn small v-if="user.role === 'admin'" @click="removeUnreliableLabel(data.id)" class="right bottom absolute ma-2">Remove flag</v-btn>
    </v-card-text>

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
          <v-icon small color="primary" class="mr-1">mdi-translate</v-icon> {{$vuetify.breakpoint.smAndUp ? currentLanguage === 'original' ? data.content.originalLang : currentLanguage : ''}}
        </v-btn>

        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.resources}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'].resources}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'].resources}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'].resources}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'].resources}}</span>
      </v-card-text>

      <v-card-text v-if="data.content.info" class="pb-0">
        <div style="line-height:1em" class="grey--text overline">Opinions</div>
        <span class="lang lang-original" :lang="data.content.originalLang">{{data.content.info}}</span>
        <span class="lang hide lang-DE" lang="DE">{{data.content.translations['DE'].info}}</span>
        <span class="lang hide lang-EN-GB" lang="en-GB">{{data.content.translations['EN-GB'].info}}</span>
        <span class="lang hide lang-FR" lang="FR">{{data.content.translations['FR'].info}}</span>
        <span class="lang hide lang-IT" lang="IT">{{data.content.translations['IT'].info}}</span>
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
      <a class="no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="$helpers.createWebsiteUrl(data.content.web)" target="_blank">
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
          Edited by <span :title="'Editor ID: '+data.userIdEdited">{{data.userNameEdited}}</span><!-- 
         --><Copy v-if="user.role === 'admin'" :data="data.userIdEdited" dataName="Editor ID"></Copy>,
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
        color="primary"
        @click="$helpers.copyClipBoard(getCurrentUrl(), 'URL')">
        <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-share-variant</v-icon>
      </v-btn>
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
      getCurrentUrl() {
        let path = window.location.origin + "/#" + this.$route.fullPath
        console.log(path)
        return path;
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
      }
    }
  }
</script>

<style scoped>
.lang {
  white-space: pre-wrap;
}
</style>
