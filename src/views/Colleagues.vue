<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : $vuetify.breakpoint.mdAndUp ? 'mx-auto my-4 mt-12 pa-8' : 'mx-auto my-4 mt-0 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 888 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <!-- USERS -->
      <v-card-title class="justify-center">Colleagues</v-card-title>
      {{users.length}} public users in total, combined effort: <span class="orange--text">{{totalContribution.toLocaleString()}}</span> contribution points
      <v-btn class="absolute right mr-8" v-if="!user.public" small color="orange" to="/profile">Become a colleague</v-btn>
      <br>

      <!-- SEARCH FIELD -->
      <v-text-field
        filled
        ref="filter"
        label="Find colleagues by name, skill, job.."
        :hint="!showSearchParams ? 'Press the button on the right for a detailed search' : ''"
        :hide-details="showSearchParams"
        type="text"
        class="mt-4 fill-width"
        v-model.trim="filter"
        :error="!!filter.length && usersFound == 0"
      >
        <!-- SEARCH ICON -->
        <v-icon slot="append" :class="filter.length ? 'hover-red' : ''" @click="filter = ''; $refs['filter'].blur()">{{filter.length ? 'mdi-close' : 'mdi-magnify'}}</v-icon>
        
        <!-- More FILTERS -->
        <v-tooltip v-if="Object.keys(searchParams).length === 0 && filter.length === 0" slot="append-outer" top color="#303030">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="nudge-y--50"
              icon
              v-bind="attrs" v-on="on"
              :small="$vuetify.breakpoint.mdAndUp"
              @click="showSearchParams = !showSearchParams"
            >
              <v-icon :color="showSearchParams ? 'green' : 'primary'">mdi-filter-variant</v-icon>
            </v-btn>
          </template>
          <span>Detailed search..</span>
        </v-tooltip>

        <!-- CLEAR FILTERS -->
        <v-tooltip slot="append-outer" v-if="Object.keys(searchParams).length > 0 || filter.length" top color="#303030">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="nudge-y--50"
              icon
              v-bind="attrs" v-on="on"
              :small="$vuetify.breakpoint.mdAndUp"
              @click="resetAll()"
            >
              <v-icon color="red">mdi-filter-variant-remove</v-icon>
            </v-btn>
          </template>
          <span>Clear all filters</span>
        </v-tooltip>
      </v-text-field>

      <v-container class="px-1 pt-4 pb-0 mb-2" v-if="showSearchParams">
        <v-row>
          <!-- INDUSTRIES -->
          <v-col class="py-0 pa-2 mb-4" cols="12" sm="3">
            <v-select
              label="Industry.."
              :items="industries"
              v-model="searchParams.industries"
              @change="setParamAndSearch('industries', searchParams.industries)"
              multiple
              clearable
              @click:clear="searchParams.industries = false, setParamAndSearch('industries')"
              hide-details
              filled
              dense
              single-line
              :menu-props="{ offsetY: true }"
            >
              <template v-slot:selection="{ item, index }">
                <span class="white--text capitalize">
                  {{ item }} 
                </span>
                <span v-if="searchParams.industries.length - 1 != index" class="orange--text text-caption mx-1">
                  or
                </span>
                <!-- <span v-if="index === 0">
                  <span>{{ item }}</span>
                </span>
                <span
                  v-if="index === 1"
                  class="grey--text text-caption"
                >
                  (+{{ searchParams.industries.length - 1 }} others)
                </span> -->
              </template>
            </v-select>
          </v-col>

          <!-- JOBS -->
          <v-col class="py-0 pa-2 mb-4" cols="12" sm="6">
            <v-select
              label="Job.."
              :items="[
                ...JSON.parse(JSON.stringify(this.jobs)).filter(x => {
                  x.job = x.job + ` (${x.industry})`; return x
                })
              ]"
              item-value="jobId"
              item-text="job"
              v-model="searchParams.jobIds"
              @change="setParamAndSearch('jobIds', searchParams.jobIds)"
              clearable
              @click:clear="searchParams.jobIds = false, setParamAndSearch('jobIds')"
              filled
              hide-details
              dense
              single-line
              :menu-props="{ offsetY: true }"
            ></v-select>
          </v-col>
          <!-- LICENSES -->
          <v-col class="py-0 pa-2 mb-4" cols="12" sm="3">
            <v-select
              label="Licenses.."
              :items="licenses"
              v-model="searchParams.licenses"
              @change="setParamAndSearch('licenses', searchParams.licenses)"
              multiple
              clearable
              @click:clear="searchParams.licenses = false, setParamAndSearch('licenses')"
              filled
              hide-details
              dense
              single-line
              :menu-props="{ offsetY: true }"
            >
              <template v-slot:selection="{ item, index }">
                <span class="white--text capitalize">
                  {{ item.value }} 
                </span>
                <span v-if="searchParams.licenses.length - 1 != index" class="orange--text text-caption mx-1">
                  and
                </span>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <!-- EXPERIENCE -->
          <v-col class="py-0 pa-2" :class="$vuetify.breakpoint.xs ? 'mb-8' : ''" cols="12" sm="6" md="6">
            <div class="px-2 py-0 rounded white--text" :style="$vuetify.breakpoint.smAndUp ? 'height:2.6em;' : ''" style="background-color: #333333; border-bottom-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom: solid .08em #CCC !important">
              <v-slider
                :class="$vuetify.breakpoint.smAndUp ? 'nudge-y-25' : 'nudge-y-50'"
                v-model="searchParams.experience"
                @input="searchParams.experience > 0 ? setParamAndSearch() : delete searchParams.experience, setParamAndSearch()"
                dense
                hide-details
                min="0"
                max="20"
                thumb-label
              >
                <Info slot="append" iconClasses="primary--text nudge-y-12" opacity="1" title="Experience" text="is defined as 'Years since first paid professional job in the colleagues busiest industry'"></Info>
              </v-slider>
              <div class="grey--text text--lighten-1 caption ml-1 my-0" :class="$vuetify.breakpoint.xs ? 'nudge-y-200' : 'nudge-y-100'">
                <!-- {{experience >= 20 ? `${experience}+` : experience > 0 ? experience : ''}} years of experience -->
                {{`${!searchParams.experience || searchParams.experience === 0 ? 'Any experience level' : `At least ${searchParams.experience >=20 ? `${searchParams.experience}+` : searchParams.experience} ${searchParams.experience === 1 ? 'year' : 'years'} of experience`} `}}
              </div>
            </div>
          </v-col>

          <!-- Languages -->
          <v-col class="py-0 pa-2" cols="6" sm="3">
            <v-select
              label="Languages.."
              :items="languages"
              v-model="searchParams.languages"
              @change="setParamAndSearch('languages', searchParams.languages)"
              multiple
              clearable
              @click:clear="searchParams.languages = false, setParamAndSearch('languages')"
              filled
              hide-details
              dense
              single-line
              :menu-props="{ offsetY: true }"
            >
              <template v-slot:selection="{ item, index }">
                <span class="white--text capitalize">
                  {{ item }} 
                </span>
                <span v-if="searchParams.languages.length - 1 != index" class="orange--text text-caption mx-1">
                  or
                </span>
                
                <!-- <span v-if="index === 0">
                  <span>{{ item }}</span>
                </span>
                <span
                  v-if="index === 1"
                  class="grey--text text-caption"
                >
                  (+{{ searchParams.industries.length - 1 }} others)
                </span> -->
              </template></v-select>
          </v-col>

          <!-- RESIDENCY -->
          <v-col class="py-0 pa-2 mb-0" cols="6" sm="3">
            <v-select
              label="Residency.."
              :items="residency"
              v-model="searchParams.residency"
              @change="setParamAndSearch('residency', searchParams.residency)"
              clearable
              @click:clear="searchParams.residency = '', setParamAndSearch('residency')"
              filled
              hide-details
              dense
              single-line
              :menu-props="{ offsetY: true }"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <!-- RESULT SORT -->
      <v-container class="grey--text pt-0 text--lighten-1 caption">
        <v-row class="pa-0">
          <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
          
          <!-- SORT BY -->
          <v-col class="pa-0" cols="12">
            <v-row>
              <v-col class="py-0">
              </v-col>

              <v-col class="py-0" cols="12" sm="auto">
                <v-radio-group label="Sort by:" mandatory :row="$vuetify.breakpoint.smAndUp" hide-details dense small @change="search()" class="inline-block mt-0">
                  <v-radio filled class="ma-0" :class="$vuetify.breakpoint.smAndUp ? 'ml-2' : ''"
                    label="Created"
                    @click="getUsers('createdOn', 'desc')"
                  ></v-radio>
                  <v-radio filled class="ma-0" :class="$vuetify.breakpoint.smAndUp ? 'ml-4' : ''"
                    label="Name"
                    @click="getUsers('name', 'asc')"
                  ></v-radio>
                  <v-radio filled class="ma-0" :class="$vuetify.breakpoint.smAndUp ? 'ml-4' : ''"
                    label="Experience"
                    @click="getUsers('colleague.experience', 'asc')"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <!-- <pre>{{searchParams}}</pre> -->

      <!-- <hr class="my-4" style="border:none; border-top: solid 1px rgba(255,255,255,.25);"> -->

      <!-- RESULTS COUNTER -->
      <div v-if="filter.length > 0 || Object.keys(searchParams).length > 0">
        <div v-if="usersFound > 0" class="pa-0 text-center" cols="auto">
          {{usersFound == 1 ? '1 Colleague found' : usersFound + ' Colleagues found'}}:
        </div>

        <!-- FILTER RESULET IN NO USERS -->        
        <div v-else class="pa-0 py-4 text-center">
          <v-icon small color="yellow" >mdi-alert</v-icon>
          No colleagues found for your search {{filter.length ? 'query' : 'filters'}}.
          <v-btn dense small @click="resetAll()">reset all filters</v-btn>
        </div>
      </div>
      <div v-else class="op-0">
        initial
      </div>

      <!-- LIST found users -->
      <v-container class="pa-0">
        <v-row justify="center">
          <v-col class="pa-2"  :class="$vuetify.breakpoint.xs ? '' : 'pt-16'" cols="12" xs="12" sm="4" md="3"
            v-for="(singleUser, i) in users.filter(x => { if(x.display) return x})"
            :key="i"
            @click="displayUser(singleUser);"
            :style="singleUser.fake ? `opacity:${1-i/16}` : ''"
          >
            <v-hover
              v-slot="{ hover }"
            >
              <v-card
                class="pa-2 grey rounded white--text pointer"
                :class="
                  [($vuetify.breakpoint.xs
                    ? 'darken-3'
                    : (hover ? 'pt-16 darken-2' : 'pt-16 darken-3')),
                  (singleUser.fake && singleUser.name === 'YOU?' && !hover ? 'op-25' : '')]"
                  :style="singleUser.fake && singleUser.name !== 'YOU?' ? 'opacity:.25; filter:blur(.25em) grayscale(1);':''"
              >
                <!-- :class="i % 2 == 0 ? 'grey darken-2' : ''" -->
                <!--  style="pointer-evets:none" -->
                <!-- <div align="center" class="absolute fill-width left top"> -->
                <div align="center" :class="$vuetify.breakpoint.xs ? 'float-left mr-4' : 'absolute fill-width left top'">
                  <v-avatar :size="$vuetify.breakpoint.smAndUp ? 120 : 100" class="elevation-8 smoothMoves-125" :class="$vuetify.breakpoint.smAndUp ? (hover ? 'nudge-y--350' : 'nudge-y--300') : ''">
                    <v-img
                      v-if="singleUser.avatar && singleUser.avatar.url && singleUser.avatar.url.length > 0"
                      :src="singleUser.avatar.url"
                      :alt="singleUser.name"
                      class="grey darken-3 smoothMoves-250"
                      :class="hover ? 'rot--3' : ''"
                    />
                    <v-img
                      v-else
                      :src="`https://avatars.dicebear.com/api/adventurer-neutral/${singleUser.avatar && singleUser.avatar.random ? singleUser.avatar.random : $helpers.md5(singleUser.uid)}.svg`"
                      class="grey darken-3 smoothMoves-250"
                      :alt="singleUser.name"
                      :class="hover ? 'rot--3' : ''"
                    />
                  </v-avatar>
                </div>
                <v-card-title class="px-0" :class="$vuetify.breakpoint.smAndUp ? 'pt-4' : 'pt-0'">
                {{singleUser.name}}
                <Info
                  v-if="singleUser.jobObject.length > 0 && getMainJob(singleUser).industry != 'empty'"
                  :text="`${$helpers.getFirstName(singleUser.name)} works mainly in the ${getMainJob(singleUser).industry} industry`"
                  :icon="getMainJob(singleUser).icon"
                  iconClasses="pink--text ml-1"
                  opacity="1"
                ></Info>
                </v-card-title>
                <v-card-subtitle v-if="singleUser.jobObject.length > 0" class="pa-0 ellipsis">
                  {{singleUser.jobObject ? singleUser.jobObject[0].job ? singleUser.jobObject[0].job : singleUser.jobObject[0] : ''}}
                </v-card-subtitle>
                <v-card-subtitle class="pa-0 ellipsis" v-if="singleUser.colleague && singleUser.colleague.experience">
                  {{getExperience(singleUser.colleague.experience)}}
                </v-card-subtitle>
                <v-btn dense v-if="singleUser.name === 'YOU?'" small color="orange">Become a colleague</v-btn>
                <a :href="`mailto:${singleUser.email}`" onclick="event.stopPropagation();" class="ellipsis block">{{singleUser.email}}</a>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- DIALOG -->
    <v-dialog
      v-model="magnifyDialog"
       v-if="magnifyDialog"
      :max-width="$vuetify.breakpoint.sm
        ? '85%'
        : '45%'
      "
      :fullscreen="$vuetify.breakpoint.xs"
      :ripple="false"
      scrollable
    >
      <v-card v-if="magnifyUser" :ripple="false" class="pa-0 grey darken-3">
        <v-card-text class="white--text pa-0 pb-6" :class="$vuetify.breakpoint.xs ? 'relative' : ''">
          <v-container class="pa-0">
              <v-row>
                <v-col
                  v-if="magnifyUser.avatar && magnifyUser.avatar.url && magnifyUser.avatar.url.length > 0"
                  class="pa-0" cols="12" sm="5" md="5"
                >
                  <v-img
                    :src="magnifyUser.avatar.url"
                    :alt="magnifyUser.name"
                    class="grey darken-3 fill-height rounded"
                    :aspect-ratio="$vuetify.breakpoint.smAndUp ? 1 : 2.335"
                  >
                    <v-btn small dense v-if="user.uid === magnifyUser.uid" class="mt-2 ml-5" color="primary" to="/profile">
                      Edit {{$vuetify.breakpoint.smAndUp ? ' your ' : ''}} profile
                    </v-btn>
                  </v-img>
                </v-col>

                <v-col :class="[$vuetify.breakpoint.smAndUp ? 'px-4 py-2' : 'px-8 py-4', magnifyUser.avatar && !!magnifyUser.avatar.url ? '' : 'ml-4' ]" cols="12" sm="7">
                  <!-- <pre>{{magnifyUser.searchfieldOriginal}}</pre> -->
                  <v-card-title class="pa-0 pb-4">
                    {{magnifyUser.name}}
                    <span v-if="magnifyUser.colleague.residency" class="ml-2 grey--text">
                      <v-icon small color="grey">mdi-map-marker</v-icon>
                      {{magnifyUser.colleague.residency}}
                    </span>
                  </v-card-title>
                  <v-card-subtitle
                    v-if="magnifyUser.jobObject && magnifyUser.jobObject.length > 0"
                    class="pa-0 whitCCCe--text"
                  >
                    <!-- <v-icon small color="pink" class="mr-1" v-if="magnifyUser.jobObject">mdi-{{
                      {'film': 'video-vintage', 'tv': 'video-vintage', 'commercials': 'video-vintage', 'theater': 'drama-masks', 'circus': 'stadium', 'fashion': 'tshirt-crew'}[magnifyUser.jobObject.industry]
                    }}</v-icon> -->
                    <span v-for="(job, i) in magnifyUser.jobObject" :key="'job-'+i">
                      {{job.job ? job.job : job }}{{i !== magnifyUser.jobObject.length-1 ? ', ' : ''}}
                    </span>
                    <!-- <pre v>{{getJobs(magnifyUser.jobObject)}}</pre> -->

                  </v-card-subtitle>
                  <v-card-subtitle class="pa-0 py-2 ellipsis white--text">
                    {{getExperience(magnifyUser.colleague.experience)}}
                  </v-card-subtitle>
                  <v-card-subtitle class="pa-0 pb-2" v-if="magnifyUser.colleague.web || magnifyUser.colleague.webProfile">
                    <a class="externalLink mr-2 no-underline" v-if="magnifyUser.colleague.web" :href="$helpers.createWebsiteUrl(magnifyUser.colleague.web)" target="_blank">
                      {{$helpers.retrieveDomain($helpers.createWebsiteUrl(magnifyUser.colleague.web))}}
                    </a>
                    <div v-if="magnifyUser.colleague.webProfile">
                      <a v-for="(website, i) in magnifyUser.colleague.webProfile.replaceAll(', ', ',').split(',').filter(empty => empty)" :key="'website-'+i"
                        class="block externalLink mr-2 no-underline"
                        :href="$helpers.createWebsiteUrl(website)" target="_blank"
                      >
                        {{$helpers.retrieveDomain($helpers.createWebsiteUrl(website))}}
                      </a>
                    </div>
                  </v-card-subtitle>

                  <a class="externalLink no-underline" :href="`mailto:${magnifyUser.email}`">{{magnifyUser.email}}</a>
                  <Copy :data="magnifyUser.email" dataName="Email"></Copy><!-- 
                  --><span v-if="magnifyUser.colleague.tel">
                  </span>
                  <div v-if="magnifyUser.colleague.tel">
                    <a class="externalLink no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}" :href="'tel:'+ magnifyUser.colleague.tel.replace(/ /g, '')">{{ magnifyUser.colleague.tel }}</a>
                    <Copy :data="magnifyUser.colleague.tel" dataName="number"></Copy>
                  </div>
                </v-col>
              </v-row>
          </v-container>

          <div v-if="magnifyUser.colleague.about" class="px-5">
            <div style="line-height:1em" class="grey--text overline mt-4">About me</div>
            <div class="linebreaks">{{magnifyUser.colleague.about}}</div>
          </div>

          <v-container class="px-8">
            <v-row>
              <v-col v-if="magnifyUser.colleague.skillset.length || getLicenses(magnifyUser.colleague).length" class="pl-0 py-0" cols="12" sm="6" md="12" lg="6">
                <div v-if="magnifyUser.colleague.skillset.length">
                  <div style="line-height:1em" class="grey--text overline mt-4">Skillset</div>
                  {{magnifyUser.colleague.skillset.join(', ')}}
                </div>

                <div v-if="getLicenses(magnifyUser.colleague).length">
                  <div style="line-height:1em" class="grey--text overline mt-4">Licenses</div>
                  <div
                    v-for="(license, i) in getLicenses(magnifyUser.colleague)" :key="'licenses-'+i"
                  >
                    <v-icon
                      class="white--text pr-2 py-1"
                      color="primary"
                      small
                    >mdi-{{license.icon}}</v-icon>
                    {{license.name}}
                  </div>
                </div>
              </v-col>

              <v-col class="pa-0" cols="12" sm="6" md="12" lg="6">
                <div v-if="magnifyUser.colleague.industries.length" class="capitalize">
                  <div style="line-height:1em" class="grey--text overline mt-4">
                    {{magnifyUser.colleague.industries.length > 1 ? 'Industries' : 'Industry'}}
                  </div>
                  {{magnifyUser.colleague.industries.join(', ')}}
                </div>

                <div v-if="magnifyUser.colleague.languages.length" class="capitalize">
                  <div style="line-height:1em" class="grey--text overline mt-4">
                    {{magnifyUser.colleague.languages.length > 1 ? 'languages' : 'language'}}
                  </div>
                  {{magnifyUser.colleague.languages.join(', ')}}
                </div>
                
                <div v-if="magnifyUser.colleague.ssfv && magnifyUser.colleague.ssfv.level > 0">
                  <div style="line-height:1em" class="grey--text overline mt-4">SSFV</div>
                  Level {{magnifyUser.colleague.ssfv.level}}
                </div>

                <div v-if="magnifyUser.colleague.salary > 0">
                  <div style="line-height:1em" class="grey--text overline mt-4">Salary</div>
                  CHF {{magnifyUser.colleague.salary.toFixed(2)}} per day (à 10h, netto)
                </div>
                <v-card class="grey darken-4 pa-2 mt-2">
                  <v-icon small color="pink">mdi-note-text</v-icon> Note: 
                  <div v-if="magnifyUser.colleague.theater.phase || magnifyUser.colleague.ssfv.rate">
                    This salary was calculated using the
                    {{magnifyUser.colleague.theater.phase ? 'T.Punkt' : ''}}
                    {{magnifyUser.colleague.ssfv.rate ? 'SSFV' : ''}}
                    calculator with the
                    {{magnifyUser.colleague.theater.phase || magnifyUser.colleague.ssfv.rate}}
                    rate.
                  </div>
                  {{magnifyUser.name}} <span class="orange--text">{{magnifyUser.colleague.selfEmployed ? 'is self-employed and can write own invoices' : 'needs to be employed'}}</span>.
                </v-card>

                <div style="line-height:1em" class="grey--text overline mt-4">
                  Contribution to szenodb.ch
                  <Info title="Contribution Points" text="are calculated from activity: Creating or editing resources, and being a regular user of szenodb.ch."></Info>
                </div>
                {{magnifyUser.name}} has <span class="orange--text">{{magnifyUser.contribution ? magnifyUser.contribution.toLocaleString() : 0}}</span> contribution points.
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="grey darken-4">
          <!-- {{$helpers.truncate(magnifyDialogImg.name, 25)}} -->
          <VCardExport position="top" :data="makeVcardData(magnifyUser)"></VCardExport>
          <v-spacer></v-spacer>
          
          <!-- FIXME: DOES NOT WORK, because this dialog is async and security prevents clipboard-copying from triggering -->
          <Share
            position="top"
            buttonClasses="mt-0"
            :text="makeShareLink(magnifyUser)"
            :tooltip="`Share ${magnifyUser.name}`"
          ></Share>

          <a
            v-if="user.role === 'admin'"
            target="_blank"
            class="no-underline"
            :title="`Open Firebase document of ${magnifyUser.name}`"
            :href="`https://console.firebase.google.com/project/szenodb/firestore/data/~2Fusers~2F${magnifyUser.uid}`"
          >
            <v-icon small class="orange--text ml-2">mdi-firebase</v-icon>
          </a>
          
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="magnifyDialog = false">
            <span>Close</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '../firebase'
import Copy from '@/components/Copy'
import VCardExport from '@/components/VCardExport'
import Share from '@/components/Share'
import Info from '@/components/Info'

  export default {
    name: 'Admin',
    props: {
      user: Object,
      settings: Object,
    },
    components: {
      Copy, VCardExport, Share, Info
    },

    data () {
      return {
        loading: false,
        showSearchParams: false,
        magnifyDialog: false,
        magnifyUser: {},
        filter: '',
        // triggerRerender: '',
        searchParams: {},
        users: [],
        unsubscribeUsers: [],
        searchTimeout: 0,
        industries: [
          'commercials',
          'circus',
          'fashion',
          'film',
          'theater',
          'tv',
        ],
        languages: [
          'german', 'english', 'french', 'italian', 'portuguese', 'spanish', 'albanian', 'serbian', 'mandarin', 'hindi', 'arabic', 'russian', 'indonesian'
        ],
        licenses: [
          { text: 'Car license (<= 3.5t)', value: 'car'},
          { text: 'Truck license (> 3.5t)', value: 'truck'},
          { text: 'Diving license', value: 'diving'},
          { text: 'Motorcycle license', value: 'motorcycle'},
          { text: 'Trailer license', value: 'trailer'},
          { text: 'Forklift license', value: 'forklift'},
          { text: 'Certified pyrotechnician', value: 'pyro'},
          { text: 'Certified electrician', value: 'electrician'},
          { text: 'Firearm license', value: 'gun'},
        ],
        residency: [
          'Aargau',
          'Appenzell A.Rh.',
          'Appenzell I.Rh.',
          'Basel-Landschaft',
          'Basel-Stadt',
          'Bern',
          'Freiburg',
          'Genf',
          'Glarus',
          'Graubünden',
          'Jura',
          'Luzern',
          'Neuenburg',
          'Nidwalden',
          'Obwalden',
          'Sankt Gallen',
          'Schaffhausen',
          'Schwyz',
          'Solothurn',
          'Tessin',
          'Thurgau',
          'Uri',
          'Waadt',
          'Wallis',
          'Zug',
          'Zürich',
        ],
        jobs: [
          {
            jobId: 10,
            job: 'Production Design', // Szenenbildner:in / Chef décorateur',
            industry: 'film'
          },
          {
            jobId: 11,
            job: 'Assistant Production Design',  // Szenenbild-Assistenz / Assistant décorateur',
            industry: 'film'
          },
          {
            jobId: 12,
            job: 'Prop Master',  // Ausstatter:in / Décorateur',
            industry: 'film'
          },
          {
            jobId: 13,
            job: 'Stand-by Props',  // Set requisiteur:in / Accessoiriste de plateau',
            industry: 'film'
          },
          {
            jobId: 14,
            job: 'Set Constructor',  // Baubühne/Dekorbau / Construction de décor',
            industry: 'film'
          },
          {
            jobId: 100,
            job: 'Costume Designer',  // Kostümbildner:in / Chef costumier',
            industry: 'film'
          },
          {
            jobId: 101,
            job: 'Assistant Costume Designer',  // Kostümbild-Assistenz / Assistant costumier',
            industry: 'film'
          },
          {
            jobId: 200,
            job: 'Wardrobe',  // Garderobe / Habilleur/habilleuse',
            industry: 'film'
          },
          {
            jobId: 201,
            job: 'Assistant Wardrobe',  // Garderoben-Assistenz / Assistant/e habillage',
            industry: 'film'
          },
          {
            jobId: 300,
            job: 'Chief Make-up Artist',  // Chef-Maskenbildner:in / Chef maquilleur/cheffe maquilleuse',
            industry: 'film'
          },
          {
            jobId: 301,
            job: 'Make-up Artist',  // Maskenbildner:in / Maquilleur/maquilleuse',
            industry: 'film'
          },
          {
            jobId: 302,
            job: 'Assistant Make-up Artist',  // Maskenbild-Assistenz / Assistant maquilleur',
            industry: 'film'
          },
          {
            jobId: 400,
            job: 'Hair-Stylist',  // Hair-Stylist:in / Coiffeur',
            industry: 'film'
          },
          {
            jobId: 1000,
            job: 'Stage design',  // Bühnenbild
            industry: 'theater'
          },
          {
            jobId: 1001,
            job: 'Stage design & Costume design',  // Ausstattung (Bühnenbild & Kostümbild)
            industry: 'theater'
          },
          {
            jobId: 1002,
            job: 'Costume design',  // Kostümbild
            industry: 'theater'
          },
          {
            jobId: 1003,
            job: 'Make-up artist',  // Maskenbild
            industry: 'theater'
          },
          {
            jobId: 1005,
            job: 'Collective member with artistic lead',  // künstlerische Leitung im kollektiv
            industry: 'theater'
          },
          {
            jobId: 1006,
            job: 'Collective member',  // kollektivmitglieder
            industry: 'theater'
          },
        ],
      }
    },

    watch: {
      filter: function(){
        /* if(!this.filter.length) {
          this.$router.push({path: this.$route.path})
        } */
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout);  // do not overlapp last search
        }
        this.searchTimeout = setTimeout(() => {
          this.search();
        }, "750");
      },
      magnifyDialog: function() {
        if(!this.magnifyDialog) {
          // magnifyDialog was closed, reset URL
          this.$router.push({
            path: this.$route.path
          })
        }
      },
      'searchParams.experience': function(value) {
        if(value === 0) {
          delete this.searchParams.experience;
        }
      }
    },

    async created() {
      // this.showSearchParams = this.$vuetify.breakpoint.smAndUp;
      await this.getUsers('createdOn', 'desc', true);

      // this.searchParams = {};  // reset because props are not reactive when searchparams defined empty in data()!
      
      // If page hard refreshed/clicked, load user and display in full
      let userId = this.$route.query.user;
      if(userId) {
        await db.collection('users').doc(userId).get().then((doc) => {
            if (doc.exists) {
                this.displayUser(doc.data(), false);
            } else {
                this.$toasted.global.error({msg:`This user does not exist (anymore).`});
            }
        }).catch((error) => {
          this.$toasted.global.error({msg:error});
        });
      }
    },

    computed: {
      totalContribution() {
        let localTotal = 0;
        this.users.forEach(function(element) {
            if(!element.fake && element.contribution) localTotal += element.contribution;
          });
        return localTotal;
      },
      usersFound() {
        return this.users.filter(x => { if(x.display) return x }).length
      },
    },

    beforeDestroy() {
      if(typeof this.unsubscribeUsers === 'function') this.unsubscribeUsers();
    },

    methods: {
      async getUsers(orderBy, sort, initial=false) {
        // Terminate earlier snapshots if existing
        if(typeof this.unsubscribeUsers === 'function') this.unsubscribeUsers();
        // Circumvent doubled identical "orderBy" createdOn
        let secondary = orderBy === 'createdOn' ? 'email' : 'createdOn';
        this.unsubscribeUsers = db.collection('users')
        //   const getAllFriends = async (userName) => {
        .orderBy(orderBy, sort)
        .orderBy(secondary, 'desc')
        .where('public', '==', true)
        .onSnapshot(querySnapshot => {
          let newData = [];
          querySnapshot.forEach(doc => {
            let f = doc.data();
            f.id = doc.id;
            f.display = true;
            f.jobObject = this.getJobs(f.colleague.jobIds);
            if(!f.deletedUser) newData.push(f);
          });
          this.users = newData;

          let fakeUsers = []
          if(initial) {
            // SCRAMBLE
            // FIXME: this.users is still empty
            this.users = this.$helpers.shuffle(this.users);
            if(! this.user.public) {
              fakeUsers = [{name: 'YOU?', display: true, fake: true, email: 'your@email.com', title: 'Super worker', jobObject: {},   colleague: {jobIds: [], experience: new Date().getFullYear()}, avatar: {random: '2'}}]
              this.users = [...this.users, ...fakeUsers]
            }
          }

          // after re-sort, apply filter again
          if(initial && this.users.length < 16) {
            fakeUsers = [
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
              {name: 'Preview account', display: true, fake: true, email: 'fake@email.com', title: '', jobObject: {}, colleague: {jobIds: [], experience: this.$helpers.randomBetween(2015,2022)}, avatar: {random: this.$helpers.createUid()}},
            ];
            fakeUsers.slice(0, this.users.length*-1)
            this.users = [...this.users, ...fakeUsers]
          }
          if(this.filter || Object.keys(this.searchParams).length) {
            // If list was reloaded by re-sorting users and search params where used
            this.search()
          }
        });
      },

      displayUser(user, setUrl=true) {
        if(user.fake && user.name === 'YOU?') this.$router.push({path: '/profile'})
        if(user.fake && user.name !== 'YOU?') {
          this.$toasted.global.info({msg:"This is here just for demonstration until more colleagues join"});
          return
        }
        if(setUrl) {
          this.$router.push({
            path: this.$route.path,
            query: {user: user.uid}
          })
        }
        // Get jobs if empty on hard reload
        if(!user.jobObject) {
          user.jobObject = this.getJobs(user.colleague.jobIds);
        }
        Object.assign(this.magnifyUser, user);
        this.magnifyDialog = true;
      },

      getJobs(jobIds) {
        //if(user.colleague.jobIds === -1) return [{ job: user.title ? user.title : '', industry: '' }]
        let jobObjects = [];
        for (var i = 0; i < jobIds.length; i++) {
          if(Number.isInteger(jobIds[i])) {
            // ???????
            jobObjects.push(this.$helpers.findKey(this.jobs, 'jobId', jobIds[i], 'object'));
          } else {
            jobObjects.push(jobIds[i]);
          }
        // return `${this.$helpers.capitalize(jobObjects.industry)}: ${jobObjects.job}`
        }
        return jobObjects;
      },

      getMainJob(singleUser) {
        // Get first job that has an industry defined
        // FIXME SOMEDAY: Somehow, on hover, this gets recalculated 
        let industry = singleUser.jobObject.filter(x => {if(x.industry) { return x}})[0];
        industry= industry ? industry.industry : 'empty';
        let icon = {'empty': '', 'film': 'video-vintage', 'tv': 'video-vintage', 'commercials': 'video-vintage', 'theater': 'drama-masks', 'circus': 'stadium', 'fashion': 'tshirt-crew'}[industry]
        return {icon: icon, industry: industry};
      },

      getExperience(experience) {
        let calcExp = new Date().getFullYear() - experience;
        return calcExp > 0 ? `${calcExp} ${calcExp === 1 ? 'Year' : 'Years'} experience` : 'Novice'
      },

      getLicenses(colleague) {
        let licenses = [];
        if(colleague.licenses.car) licenses.push({name: 'Car license (<= 3.5t)', icon: 'car-side'});
        if(colleague.licenses.truck) licenses.push({name: 'Truck license (> 3.5t)', icon: 'truck-cargo-container'});
        if(colleague.licenses.diving) licenses.push({name: 'Diving license', icon: 'diving-scuba'});
        if(colleague.licenses.motorcycle) licenses.push({name: 'Motorcycle license', icon: 'racing-helmet'});
        if(colleague.licenses.trailer) licenses.push({name: 'Trailer license', icon: 'truck-trailer'});
        if(colleague.licenses.forklift) licenses.push({name: 'Forklift license', icon: 'forklift'});
        if(colleague.licenses.pyro) licenses.push({name: 'Certified pyrotechnician', icon: 'flare'});
        if(colleague.licenses.electrician) licenses.push({name: 'Certified electrician', icon: 'lightning-bolt-outline'});
        if(colleague.licenses.gun) licenses.push({name: 'Firearm license', icon: 'pistol'});
        return licenses
      },

      makeVcardData(user) {
        // ????????
        return {
          name: user.name,
          email: user.email,
          ...(user.colleague.tel && {tel: user.colleague.tel}),
          ...(user.colleague.web && {web: user.colleague.web}),
          ...(user.colleague.residency && {address: user.colleague.residency}),
          ...(user.colleague.jobIds >= 0 && {org: this.$helpers.findKey(this.jobs, 'jobId', user.colleague.jobIds, 'job')}),
          note: 'Generated by www.szenodb.ch',
        }
      },

      makeShareLink(magnifyUser) {
        // this.$forceUpdate();
        return `${this.$helpers.getCurrentUrl()}\n${
          magnifyUser.name}${magnifyUser.colleague.jobIds.length >= 0
            ? ', '+this.$helpers.findKey(this.jobs, 'jobId', magnifyUser.colleague.jobIds[0], 'job')
            : ''
          }`
      },

      setParamAndSearch(key, value) {
        // Regular value was unchecked
        if(!this.searchParams[key] || (value && value.length === 0)) delete this.searchParams[key];

        // Re-trigger search
        this.search()
      },

      search() {
        // Make all hide
        this.resetSearch(false);
        
        let normalized = this.$helpers.normalizeText(this.filter)

        for (const [key] of Object.entries(this.users)) {
          let user = this.users[key];
          let display = [];

          // Freetext search
          if(this.filter) {
            display.push(user.searchfield && user.searchfield.indexOf(normalized) >= 0)
          }

          // Params search
          if(user.colleague && Object.keys(this.searchParams).length) {  // this is only there because my user does not have colleagues but public is true
            for (const [keyParams] of Object.entries(this.searchParams)) {
              /* console.log(keyParams);
              console.log(user.colleague[keyParams])
              console.log(typeof user.colleague[keyParams]) */
              if(keyParams === 'experience') {
                // Special case experience
                display.push(user.colleague[keyParams] <= new Date().getFullYear() - this.searchParams[keyParams])
              
              } else if(typeof this.searchParams[keyParams] === 'object' && !user.colleague[keyParams]) {
                // For matching search array in various fields of target user
                display.push(this.searchParams[keyParams].every(elem => user.colleague[elem]))
              
              } else if(typeof user.colleague[keyParams] === 'object') {
                // For matching search array to field array
                let elementsToMatch = typeof this.searchParams[keyParams] === 'object'
                  ? this.searchParams[keyParams]
                  : [this.searchParams[keyParams]]

                if(keyParams === 'industries' || keyParams === 'languages') {
                  // Display if any selected industry or languages match
                  display.push(elementsToMatch.some(elem => user.colleague[keyParams].includes(elem)))

                } else if(keyParams === 'licenses') {
                  display.push(elementsToMatch.every(elem => user.colleague[keyParams][elem]))

                } else {
                  // Eg. jobs, ...
                  display.push(elementsToMatch.every(elem => user.colleague[keyParams].includes(elem)))
                }

              } else {
                // If key from search and field name of user is identical
                // console.log(user.colleague[this.searchParams.licenses[keyParams]])
                display.push(this.searchParams[keyParams] === user.colleague[keyParams])
              }
            }
          /* } else {
            console.log("no params"); */
          }

          // if everything matches, display user
          if(display.length && display.every(x => x === true)) {
            user.display = true;
          }

          if(!this.filter && Object.keys(this.searchParams).length === 0) {
            // console.log("no params, no search: reset search");
            this.resetSearch(true);
          }
        }
      },

      resetSearch(displayStatus) {
        Object.keys(this.users).forEach(key => {
          this.users[key].display = displayStatus;
          if(this.users[key].fake) delete this.users[key];  // remove fake users for searching
        });
      },

      resetAll() {
        this.searchParams = {};
        this.filter = '';
        this.resetSearch(true);
      },
    },
  }
</script>

<style scoped>
  .hover-red:hover {
    color:rgb(244,67,54);
  }
</style>