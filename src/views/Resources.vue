<template>
  <div class="pa-2">
    <v-navigation-drawer
      class="pa-4"
      v-if="drawerOpen"
      v-model="drawerOpen"
      right
      fixed
      :hide-overlay="true"
      stateless
      :width="$vuetify.breakpoint.mdAndUp ? 450 : '100%'"
    >
      <!-- CLOSE DRAWER -->
      <div class="text-right fixed top right">
        <v-btn :disabled="loadingCsv[0] != loadingCsv[1]" icon @click="cancelEditResource()" >
          <v-icon class="red--text">mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- VIEW POST -->
      <div v-if="dataMode === 'view'" class="pb-8">
        <ViewResource
          :data="view"
          :user="user"
          @close="cancelEditResource()"
          @editResource="editResource($event)"
        ></ViewResource>
      </div>

      <!-- NEW / EDIT POST -->
      <div v-else class="pb-8">
        <EditResource
          :data="post"
          :dataMode="dataMode"
          :user="user"
          @flag="setFlags($event.shiftKey, $event.data)"
          @edit="post = $event.newData, oldData=$event.oldData, saveEditedResource()"
          @new="getEmittedNewPost($event)"
          @cancel="cancelEditResource()"
          @csvImporting="loadingCsv = $event"
        ></EditResource>
      </div>
    </v-navigation-drawer>


    <v-card tile flat color="#121212" class="d-flex ma-0 pa-0 fixed top left fill-height fill-width">
      <v-card tile flat color="#121212" class="pa-0 flex-shrink-0 flex-grow-0" :width="$vuetify.breakpoint.smAndDown ? '0.5em' : $vuetify.breakpoint.md ? '10em' : $vuetify.breakpoint.xlAndUp ? '25em' : '8em'">
        <!-- SPACER LEFT -->
      </v-card>

      <v-card tile flat color="#121212" class="pa-4 mt-16 pb-16 pt-4 flex-grow-1" style="overflow:auto;">
        <!-- SEARCH FIELD -->
        <v-text-field
          :loading="loading"
          filled
          label="Search.."
          type="text"
          class="mt-4 fill-width"
          v-model.trim="filter"
          persistent-hint
          :hint="filter.length >= 2 ? resources.length == 1 ? '1 Result' : resources.length + ' Results' : 'Type to find resources & services for the art department'"
          :error="!!filter.length && resources.length == 0"
          v-on:keyup.enter="!!filter.length && resources.length == 0 ? createNewFromSearch() : search(filter)"
        >
        <v-icon slot="append" :class="filter.length ? 'hover-red' : ''" @click="filter = '';">{{filter.length ? 'mdi-close' : 'mdi-magnify'}}</v-icon>
        <template v-slot:append-outer>
          <div class="primary ma-0 addNewResource">
            <v-icon color="white" @click="resetSearch(maxSearchResults), dataMode = 'new'; drawerOpen = true">mdi-plus</v-icon> 
          </div>
        </template>
        </v-text-field>


        <!-- DISPLAY IMPORT CSV STATUS -->
        <div class="my-4" v-if="loadingCsv[0] != loadingCsv[1]">
          Loading & auto-translate your CSV Data.. 
          <v-progress-linear style="height:.6em; display:inline-block; width:200px" :value="loadingCsv[0]*100/loadingCsv[1]"></v-progress-linear>
          {{loadingCsv[0]}}/{{loadingCsv[1]}}
        </div>

        <!-- FILTERS -->
        <div v-else>
          Filter resources: 
          <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs" v-on="on"
                class="grey darken-3 mx-2"
                :small="$vuetify.breakpoint.mdAndUp"
                :color="filterSet === 'showFavs' ? 'red' : ''"
                @click="loadFavs()">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-heart</v-icon>
                <!-- :color="user.favorites.includes(view.id) ? 'red' : ''" -->
              </v-btn>
            </template>
            <span>Show your favorit resources</span>
          </v-tooltip>

          <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs" v-on="on"
                class="grey darken-3 mx-2"
                :small="$vuetify.breakpoint.mdAndUp"
                :color="filterSet === 'showOwnResources' ? 'primary' : ''"
                @click="loadOwnResources()">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-account-eye</v-icon>
                <!-- :color="user.favorites.includes(view.id) ? 'red' : ''" -->
              </v-btn>
            </template>
            <span>Show your own resources</span>
          </v-tooltip>

          <v-tooltip v-if="user.role === 'admin'" :disabled="$vuetify.breakpoint.smAndDown" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs" v-on="on"
                class="grey darken-3 mx-2"
                :color="filterSet === 'deleted' ? 'red' : ''"
                :small="$vuetify.breakpoint.mdAndUp"
                @click="loadDeletedResources()">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-delete</v-icon>
                <!-- :color="user.favorites.includes(view.id) ? 'red' : ''" -->
              </v-btn>
            </template>
            <span>Show flagged as deleted</span>
          </v-tooltip>

          <v-tooltip v-if="filterSet.length" :disabled="$vuetify.breakpoint.smAndDown" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                icon
                v-bind="attrs" v-on="on"
                class="mx-2 red--text"
                :small="$vuetify.breakpoint.mdAndUp"
                @click="resetSearch(maxSearchResults), filter = ''">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-close</v-icon>
                <!-- :color="user.favorites.includes(view.id) ? 'red' : ''" -->
              </v-btn>
            </template>
            <span>Reset filter</span>
          </v-tooltip>
        </div>

        <!-- LIST RESOURCES -->
        <v-container v-if="resources.length" class="pa-0 pt-4 ma-0 fill-width" style="max-width:initial">
          <!-- TABLE HEADER -->
          <div class="primary--text italics my-2 grey darken-4" :class="$vuetify.breakpoint.mdAndUp ? 'px-4' : 'px-2'">
              <div style="vertical-align: top; width:20%; display:inline-block;">Firm</div>
              <div v-if="isSmallWithOpenDrawer" :style="$vuetify.breakpoint.mdAndUp ? 'width:60%' : 'width:80%'" class="pl-2" style="display:inline-block">
                  Resources
              </div>
              <div v-if="$vuetify.breakpoint.mdAndUp" :style="isSmallWithOpenDrawer ? '' : 'width:80%'" style="width:20%; text-align:right; display:inline-block">
                  Actions
              </div>
          </div>

          <!-- LIST RESOURCES -->
          <div
            v-for="(resource, i) in resources"
            class="my-2"
            style="height:56px; overflow: hidden;"
            :style="resource.flags.unreliable ? 'text-decoration: line-through !important' : ''"
            :key="i"
            :class="[
              viewIndex === i && drawerOpen ? 'primary darken-4' :
              user.role === 'admin' && resource.flags.deleted
              ? 'pink darken-4'
                : user.role != 'admin' && resource.flags.deleted
                ? 'hideDeleted'
                  : i % 2 == 1 
                  ? 'grey darken-4'
                    : '',
              $vuetify.breakpoint.mdAndUp
                ? 'px-4'
                : 'px-2'
            ]"
            @click="viewResource(i, resource)"
          >
            <div class="pt-1" style="text-decoration: inherit; vertical-align: top; width:20%; display:inline-block;">
              <!-- min-width:150px;  -->
              <div style="text-decoration: inherit; overflow: hidden; text-overflow:ellipsis; white-space: nowrap; text-transform: capitalize;">{{resource.content.title}}
                <v-icon small color="yellow" title="Exact match" v-if="resource.primaryResult">mdi-star</v-icon>
              </div>
              <div style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap" v-if="resource.content.address">
                <a :href="createGoogleMapsLink(resource.content.address)" target="_blank" onclick="event.stopPropagation();" class="no-underline" style="text-transform: capitalize;">
                  {{guessCity(resource.content.address)}}
                </a>
              </div>
            </div>
            <div v-if="isSmallWithOpenDrawer" :style="$vuetify.breakpoint.mdAndUp ? 'width:60%' : 'width:80%'" class="grey--text pl-2 pt-1" style="text-decoration: inherit; display:inline-block">
              <div v-if="user.role === 'admin' && resource.flags.deleted">
                Flagged by
                {{resource.flags.userName}},
                {{resource.flags.userEmail}} (ID: <pre class="inline">{{resource.flags.userId}}</pre>)
                <br>
                "{{resource.flags.reason}}"
              </div>
              <div v-else style="text-decoration: inherit; overflow:hidden; display: -webkit-box; -webkit-box-orient: vertical; box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; ">
                  {{resource.content.resources}}
              </div>
            </div>
            <div class="pt-3" v-if="$vuetify.breakpoint.mdAndUp" :style="isSmallWithOpenDrawer ? '' : 'width:80%'" style="width:20%; text-align:right; vertical-align: top; display:inline-block">
              <a v-if="resource.content.web" :title="resource.content.web" :href="createWebsiteUrl(resource.content.web)" onclick="event.stopPropagation();" target="_blank" class="no-underline">
                <v-btn icon class="primary ml-1" :small="$vuetify.breakpoint.mdAndUp">
                  <v-icon>mdi-link-variant</v-icon>
                </v-btn>
              </a>
              <v-btn title="View" icon v-if="$vuetify.breakpoint.mdAndUp" class="primary ml-1" :small="$vuetify.breakpoint.mdAndUp" @click.stop="viewResource(i, resource)">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-eye</v-icon>
              </v-btn>

              <v-btn title="Edit" icon class="primary ml-1" :small="$vuetify.breakpoint.mdAndUp" @click.stop="editResource(resource)">
                <v-icon :small="$vuetify.breakpoint.mdAndUp">mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                v-if="user.emailVerified"
                icon
                :title="user.role === 'admin' && resource.flags.status ? 'Edit delete/unreliable state' : user.role === 'admin' ? 'Flag for deletion - shift & click: Delete immediately' : 'Flag for deletion'"
                class="red ml-1"
                :small="$vuetify.breakpoint.mdAndUp"
                @click.stop="setFlags($event, resource)"
              >
                <v-icon v-if="resource.flags.deleted || resource.flags.unreliable">
                  mdi-pencil-circle
                </v-icon>
                <v-icon v-else :small="$vuetify.breakpoint.mdAndUp">
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>

        <p v-else class="py-4">
          <span v-if="!filter">
          {{filterSet === 'showFavs' ? 'You have no favorites saved.' : filterSet === 'deleted' ? 'There are currently no resources flagged for deletion.' : 'There are currently no resources.'}}
          </span>
          <span v-else>
            Your search for "{{filter}}" did not return any results.
            <br>
              <v-btn class="primary white--text" small @click="createNewFromSearch()">
                Create entry?
              </v-btn>
          </span>
        </p>
        <div class="grey--text my-12" v-if="listWasShortened && resources.length === 100">
          This list has been shortened to increase performance.
          <v-btn small @click="resetSearch(6666)">Show all entries</v-btn>
        </div>
      </v-card>

      <v-card tile flat class="pa-0 flex-shrink-0 flex-grow-0" color="#121212" v-if="drawerOpen && $vuetify.breakpoint.mdAndUp" width="460px">
        <!-- DRAWER -->
      </v-card>
      <v-card tile flat class="pa-0 flex-shrink-0 flex-grow-0" color="#121212" v-else :width="$vuetify.breakpoint.smAndDown ? '0.5em' : $vuetify.breakpoint.md ? '10%' : $vuetify.breakpoint.xlAndUp ? '25%' : '8%'">
        <!-- SPACER RIGHT -->
      </v-card>
    </v-card>

    <!-- DELETE CONFIRMATION -->
    <v-dialog
      v-model="reasonOfDelete.display"
      :width="$vuetify.breakpoint.smAndDown ? '80%' : '45%'"
      :fullscreen="$vuetify.breakpoint.xs"
    >
      <v-card>
        <v-card-title v-if="reasonOfDelete.status" class="text-h5 grey darken-3">
          Edit "{{reasonOfDelete.title}}" flags
        </v-card-title>
        <v-card-title v-else class="text-h5 error">
          Are you sure to delete "{{reasonOfDelete.title}}"?
        </v-card-title>
        <v-card-text class="my-4 white--text">
          Please specify your reasoning (eg, closed down, completely wrong, owned by murderers, etc).
          Consider editing the resource aswell!
          <p v-if="user.role === 'admin'" class="my-2">
            <span class="primary--text">Admins like you can shift & click the trash can in the list to delete immedietely!</span>
            <br>
            ID: <pre class="inline">{{reasonOfDelete.id}}</pre>
          </p>
          <v-text-field
            filled
            class="mt-4 input"
            label="Reason"
            type="text"
            v-model="reasonOfDelete.reason"
            required
          ></v-text-field>
          <!-- reasonOfDelete: <pre>{{reasonOfDelete}}</pre> -->
        </v-card-text>

        <v-card-actions>
          <v-btn color="black" @click="reasonOfDelete.display = false, reasonOfDelete = {reason:'', deleted:false, unreliable:false}">
            <span>Cancel</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="reasonOfDelete.status" class="mr-2" color="primary" @click="reasonOfDelete.display = false, flagForDeletion(reasonOfDelete, false, false), reasonOfDelete = {reason:'', deleted:false, unreliable:false}">
            <span>Unflag</span>
          </v-btn>
          <v-tooltip top max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" color="white" class="black--text" :disabled="reasonOfDelete.reason.length === 0"
              @click="reasonOfDelete.display = false, flagForDeletion(reasonOfDelete, false, true), reasonOfDelete = {reason:'', deleted:false, unreliable:false}">
                 {{$vuetify.breakpoint.mdAndUp ? 'Flag unreliable' : 'Unreliable'}}
              </v-btn>
            </template>
            <div>
              All users will still be able to see this resource, in conjunction with your reasoning.
              <br>
              Others do not have to find out on their own why this is unreliable or unusable!
            </div>
          </v-tooltip>
          <v-btn color="red" :disabled="reasonOfDelete.reason.length === 0" @click="reasonOfDelete.display = false, flagForDeletion(reasonOfDelete, true, false), reasonOfDelete = {reason:'', deleted:false, unreliable:false}">
            <span v-if="user.role === 'admin'">
              {{$vuetify.breakpoint.mdAndUp ? "Flag deleted" : 'Flag Del.'}}</span>
            <span v-else>
              {{$vuetify.breakpoint.mdAndUp ? "Trust me, I know what I do" : $vuetify.breakpoint.sm ? 'Delete' : 'Del.'}}
            </span>
          </v-btn>
          <v-btn color="orange" title="Admins can delete this now!" v-if="user.role === 'admin'" @click="reasonOfDelete.display = false, deleteResource(reasonOfDelete), reasonOfDelete = {reason:'', deleted:false, unreliable:false}">
            <v-icon>mdi-delete-alert</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '../firebase'
import ViewResource from '@/components/ViewResource'
import EditResource from '@/components/EditResource'

  export default {
    name: 'Resource',

    props: {
      user: Object,
    },

    components: {
      ViewResource, EditResource
    },
    
    data () {
      return {
        drawerOpen: false,
        loading: false,
        filterSet: '',
        loadingCsv: [0,0],
        viewIndex: 0,
        unsubscribeUrlView: function() {},
        maxSearchResults: 100,
        listWasShortened: false,
        reasonOfDelete: {reason:''},
        dataMode: 'new',
        test: null,
        filter: '',
        searchTimeout: 0,
        view: {},
        oldData: {},
        post: this.resetResource()
      }
    },

    computed: {
      resources () {
        // triggers again after search, because array has changed!
        // console.log("computed resources");
        return this.$store.getters.resources;
      },
      isSmallWithOpenDrawer() {
        return !this.drawerOpen || ((this.$vuetify.breakpoint.smAndDown || this.$vuetify.breakpoint.lgAndUp) && this.drawerOpen);
      }
    },

    watch: {
      filter: function(){
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout);  // do not overlapp last search
        }
        this.searchTimeout = setTimeout(() => {
          this.search(this.filter);
        }, "750");
      },
    },

    mounted() {
      document.addEventListener('keyup', this.keystrokes, false)
      document.that = this;  // safe for use in keystrokes(), somehow
    },

    created() {
      this.viewResourceFromUrl();

      if(!this.resources.length) {
        // After login, sometimes resources are loaded before the fetchUserProfile is done, or something
        console.log("Resources were missing. Reload from scratch.");
        this.$store.dispatch('getResources', this.maxSearchResults);
      }
    },

    beforeDestroy() {
      this.unsubscribeUrlView();
      document.removeEventListener('keyup', this.keystrokes)
    },

    methods: {
      keystrokes(event) {
        let that = event.currentTarget.that;  // get "this" from "document.that" somehow.. MAGIC
        // Close drawer with ESC even if in textarea/input
        if (event.key === "Escape") {
          if(that.dataMode === 'edit') {
            that.dataMode = 'view';
          } else {
            that.drawerOpen = false;
          }
        }

        if(!['INPUT','TEXTAREA'].includes(event.srcElement.tagName)) {
          /* console.log(event.key) */
          switch(event.key) {
            case 'e':
              if(that.drawerOpen) {
                if(that.dataMode === 'view') {
                  // Go to edit mode
                  that.editResource(that.resources[that.viewIndex]);
                } else {
                  // Change back to view if edit was open
                  that.dataMode = 'view';
                }
              }
              break;
            case 'd':
              if(that.drawerOpen) {
                that.setFlags({}, that.resources[that.viewIndex]);
              }
              break;
            /* case 'D':
              // Its dangerous to delete immedietly
              if(that.drawerOpen) {
                that.deleteResource(that.resources[that.viewIndex]);
              }
              break; */
            case 'ArrowUp':
              if(that.drawerOpen && that.viewIndex > 0) {
                that.viewIndex--
                that.viewResource(that.viewIndex, that.resources[that.viewIndex]);
              }
              break;
            case 'ArrowLeft':
              if(that.drawerOpen && that.viewIndex > 0) {
                that.viewIndex--
                that.viewResource(that.viewIndex, that.resources[that.viewIndex]);
              }
              break;
            case 'ArrowDown':
              if(that.drawerOpen && that.viewIndex < that.resources.length-1) {
                that.viewIndex++
                that.viewResource(that.viewIndex, that.resources[that.viewIndex]);
              }
              break;
            case 'ArrowRight':
              if(that.drawerOpen && that.viewIndex < that.resources.length-1) {
                that.viewIndex++
                that.viewResource(that.viewIndex, that.resources[that.viewIndex]);
              }
              break;
          }
        }
      },

      resetResource() {
        return {
          'title': '',
          'originalLang': '',
          'translations': {
            'DE': ['',''],
            'EN-GB': ['',''],
            'FR': ['',''],
            'IT': ['','']
          },
          'address': '',
          'info': '',
          'searchfield': '',
          'rating': 0,
          'imgs': [],
          'name': '',
          'web': '',
          'resources': '',
          'tel': '',
          'email': ''
        }
      },

      search(payload) {
        if(!payload) {
          this.resetSearch(this.maxSearchResults);
          return;
        }
        if(payload.length < 2) {
          console.log("not searching, less than 3 characters")
          return // ignore searches for less than two inputs
        }
        console.log("searching!")
        this.listWasShortened = false;

        // kinda "fast" search
        this.loading = true
         this.$store.dispatch('searchResources', payload).then(() => {
           // console.log("fetched!", this.$route.params.selectedProduction)
           this.loading = false
          });
          // TODO
          // do a fine search with similar characters and typos in each field..
          // use $hepers.difference ?
          /* this.$store.dispatch('fineSearchResources', payload).then(function() {
            console.log(this.resources);
          }) */
      },

      resetSearch(limit) {
        // console.log("Resources.vue: reset search");
        this.filterSet = '';
        // get initial array back
        if(limit == 100) {
          this.listWasShortened = true;
        } else {
          this.listWasShortened = false;
        }
        this.$store.dispatch('getResources', limit);
      },

      loadFavs() {
        this.listWasShortened = false;    
        if(this.filterSet === 'showFavs') {
          this.filterSet = '';
          this.resetSearch(this.maxSearchResults);
        } else {
          this.filterSet = 'showFavs';
          this.$store.dispatch('showFavs');
        }
      },

      loadOwnResources() {
        this.listWasShortened = false;
        if(this.filterSet === 'showOwnResources') {
          this.filterSet = '';
          this.resetSearch(this.maxSearchResults);
        } else {
          this.filterSet = 'showOwnResources';
          this.$store.dispatch('showOwnResources');
        }
      },

      loadDeletedResources() {
        this.listWasShortened = false;
        if(this.filterSet === 'deleted') {
          this.filterSet = '';
          this.resetSearch(this.maxSearchResults);
        } else {
          this.filterSet = 'deleted';
          this.$store.dispatch('showDeletedFlags');
        }
      },

      viewResourceFromUrl() {
        // get ID from PARAMS
        let view = this.$route.query.view;
        if(view) {
          // URL had "view", load document and display
          this.unsubscribeUrlView = db.collection("resources")
          .doc(view)
          .onSnapshot(doc => {
            let data = doc.data();
            if(data) {
              data.id = doc.id
              // TODO: Resource might not be in current list of resources. what should be the index?
              this.viewResource(0, data);
            } else {
              console.log(`Could not find resource with ID ${view}`)
              this.$toasted.global.error({msg:`Could not find resource with ID ${view}`});
            }
          });
        }
      },
      
      viewResource(index, data) {
        this.viewIndex = index;
        // Set URL to .../#/resources?view=xxx
        this.$router.replace({query: { view: data.id }})
        this.view = data;
        this.drawerOpen = true;
        this.dataMode = 'view'
      },

      async getEmittedNewPost(data) {
        this.post = data;
        let openNewOneAfterwards = false;
        if (data.newAndNext) {
          delete data.newAndNext;
          openNewOneAfterwards = true;
        }
        await this.addResource();

        if(openNewOneAfterwards) {
          this.dataMode = 'new';
          this.drawerOpen = true
        }
      },

      addResource() {
        this.$store.dispatch('addResource', {"collection": "resources", "post": this.post}).then(() => {
          console.log("Success!")
          this.post = this.resetResource();
          this.$toasted.global.success({msg:"Saved new data to firestore database!"});
        }).catch(error => {
          console.log(error)
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
        this.drawerOpen = false;
      },

      createNewFromSearch() {
        this.post.title=this.filter; 
        this.filter=''; 
        this.resetSearch(this.maxSearchResults);  // rebuild list
        this.dataMode = 'new'; 
        this.drawerOpen = true;
        this.$vuetify.goTo(0);
      },

      editResource(data) {
        //console.log(data.id, data)  // data.id,
        let localData = JSON.parse(JSON.stringify(data));
        this.dataMode = "edit";
        this.post = {
            id: localData.id,
            title: localData.content.title,
            name: localData.content.name,
            resources: localData.content.resources,
            info: localData.content.info,
            address: localData.content.address,
            tel: localData.content.tel,
            email: localData.content.email,
            web: localData.content.web,
            //imgs: JSON.parse(JSON.stringify(localData.imgs)),
            //imgs: localData.imgs,
            imgs: localData.content.imgs,
            //imgs: [],
            rating: localData.content.rating,
            translations: localData.content.translations,
            originalLang: localData.content.originalLang,
            // userCreated: localData.userCreated,
            // createdOn: localData.createdOn,
            // editedOn: localData.editedOn
          };
          // TODO: this.post = localData;
        // this.$vuetify.goTo(0);
        this.drawerOpen = true;
      },

      async saveEditedResource() {
        // to remove id from post
        let newData = {
            title: this.post.title,
            name: this.post.name,
            resources: this.post.resources,
            info: this.post.info,
            address: this.post.address,
            tel: this.post.tel,
            email: this.post.email,
            web: this.post.web,
            imgs: this.post.imgs,
            rating: this.post.rating,
            translations: this.post.translations,
            originalLang: this.post.originalLang
        }
        // TODO: let newData = this.post;
        await this.$store.dispatch('editResource', {'collection': 'resources', 'document': this.post.id, 'post': newData, 'oldData': this.oldData}).then(() => {
          console.log('Success edit!')
          this.post = this.resetResource();
          this.dataMode = 'new';
          this.$toasted.global.success({msg:'Sucessfully edited post.'});
        }).catch(error => {
          console.log(error)
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
        this.drawerOpen = false;
      },

      setFlags(event, resource) {
        if(event.shiftKey && this.user.role === 'admin') {
          this.deleteResource(resource);
          return;
        }
        this.reasonOfDelete = {
          display: true,
          id: resource.id,
          title: resource.content.title,  
          status: resource.flags.deleted || resource.flags.unreliable,
          reason: resource.flags.reason ? resource.flags.reason : ''
        };
      },

      deleteResource(data) {
        // console.log(data.id, data)  // data.id,
        this.$store.dispatch('deleteResource', {'collection': 'resources', 'document': data.id}).then(() => {
          console.log('Sucessful removed resource.')
          this.dataMode = 'new';
          this.$toasted.global.success({msg:'Sucessful removed resource'});
        }).catch(error => {
          console.log(error)
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      },

      async flagForDeletion(data, deleted, unreliable) {
        await db.collection("resources").doc(data.id).set({
          'flags': {
            'date':new Date(),
            'status': deleted || unreliable,
            'userId': this.user.uid,
            'userName': this.user.name,
            'userEmail': this.user.email,
            'reason': data.reason,
            'unreliable': unreliable,
            'deleted': deleted,
          }
        }, { merge: true }).then(() => {
          this.$toasted.global.success({msg:'This post has been flagged for deletion'});
        }).catch(error => {
          console.log(error)
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      },

      async unflagForDeletion(data) {
        await db.collection("resources").doc(data.id).set({
          'flags': {
            'date':new Date(),
            'status':false,
            'userId': this.user.uid,
            'userName': this.user.name,
            'userEmail': this.user.email
          }
        }, { merge: true }).then(() => {
          this.$toasted.global.success({msg:'This post has been unflagged for deletion'});
        }).catch(error => {
          console.log(error)
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      },

      cancelEditResource() {
        // Reset URL to .../#/resources
        this.$router.replace({query: {}})
        this.unsubscribeUrlView();
        this.dataMode = 'new';
        this.success = '';
        this.error = '';
        this.post = this.resetResource();
        this.drawerOpen = false;
      },

      createGoogleMapsLink(address) {
        // console.log(address);
        if(address.startsWith("http")) return address
        return "https://google.com/maps/search/"+address.replace(/ /g,'+');
        // let city = address.split(/d/g).at(-1);
        // return `<a href="https://google.com/maps/search/`+address.replace(/ /g,'+')+`" target="_blank">`+city+`</span>`
      },
      
      guessCity(address) {
        if(address.startsWith("http")) return "Google Maps"
        // City is last string after last integer..? maybe?
        let city = /[^\d]*$/.exec(address)[0];
        if(!city) return "Somehwere"
        // return this.$helpers.capitalize(city.trim());
        return city;
      },

      createWebsiteUrl(url) {
        if(url.startsWith("http")) return url;
        return "http://"+url
      },
    },
  }
</script>

<style scoped>
  .addNewResource {
    transform: translate(0, -1.05em); 
    border-top-right-radius:50% !important; 
    border-bottom-right-radius:50% !important;
  }
  .addNewResource button {
    padding:.69em .69em .69em .69em; 
    overflow: hidden;
  }
  .addNewResource:hover {
    background-color: white !important;
  }
  .addNewResource:hover button:before {
    color:rgb(109, 170, 255);
  }
  .hover-red:hover {
    color:rgb(244,67,54);
  }
  .hideDeleted {
    display: none;
  }
</style>