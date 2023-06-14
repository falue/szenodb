<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : $vuetify.breakpoint.mdAndUp ? 'mx-auto my-4 mt-12 pa-8' : 'mx-auto my-4 mt-0 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 666 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >

    <!-- user.public: <pre>{{user.public}}</pre> -->
    <!-- profile.public: <pre>{{profile.public}}</pre> -->
    <!-- profile.colleague: <pre>{{profile.colleague}}</pre> -->
    <!-- profile: <pre>{{profile.avatar}}</pre> -->
    <!-- profile.avatar: <pre>{{profile.avatar}}</pre> -->

    <v-card-title class="justify-center pa-0 pb-8">
      <div class="relative">
        <div class="halo ml-5 smoothMoves-1000" :class="!user.public && profile.public ? 'op-100 nudge-y--75' : 'op-0 nudge-y--500'"></div>
        <v-avatar :size="120" class="elevation-8">
          <v-img v-if="profile.avatar && profile.avatar.url && profile.avatar.url.length > 0" :src="profile.avatar.url" :alt="user.name"
            class="grey darken-3 "
          />
          <!-- https://avatars.dicebear.com/ -->
          <v-img v-else :src="`https://avatars.dicebear.com/api/adventurer-neutral/${profile.avatar && profile.avatar.random ? profile.avatar.random : $helpers.md5(user.uid)}.svg`" class="grey darken-3" :alt="user.name" />
        </v-avatar>
        <v-btn
          v-if="profile.avatar && user.avatar.url && user.avatar.url.length"
          icon
          small
          dense
          class="absolute top right op-50"
          @click="deleteImage(user.avatar.path)"
        ><v-icon small class="grey--text">mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          small
          dense
          class="absolute top right"
          @click="getRandomUserImage()"
        ><v-icon small class="primary--text">mdi-sync</v-icon>
        </v-btn>
        <FileUpload
          class="absolute bottom right"
          type="image/*"
          :target="`users/${user.uid}`"
          :multiple="false"
          :maxImageSize="666"
          :icon="profile.avatar && user.avatar.url && user.avatar.url.length ? 'camera' : 'camera-plus'"
          iconClasses=""
          buttonClasses="pink darken-3 elevation-8"
          position="right"
          tooltip="Change avatar"
          @uploadStarted="user.avatar={}"
          @uploaded="profile.avatar=$event, saveUserData()"
          @error="$toasted.global.error({msg:$event})"
        ></FileUpload>
      </div>
    </v-card-title>

      <form @submit.prevent="saveUserData" class="mb-12">
        <v-container class="pa-0">
          <v-row class="mb-2">
            <v-col class="py-0" :class="$vuetify.breakpoint.xs ? 'pb-4' : ''" cols="12" sm="6">
              <v-text-field filled label="Name" type="text" :hide-details="profile.name.length > 0" placeholder="Name" v-model="profile.name" :rules="requiered">
              </v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field filled label="Email" type="text" autocapitalize="none" :hide-details="profile.email.length > 0" placeholder="Email" v-model="profile.email" :rules="requiered">
                <v-icon :title="user.emailVerified ? 'Email verified' : 'Email not verified'" slot="append" :class="user.emailVerified ? 'green--text' : 'red--text'">{{user.emailVerified ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <v-checkbox
                class="inline-block mt-0 mb-3"
                hide-details
                dense
                v-model="profile.news"
                label="Receive crucial updates by email"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>

        <v-card class="mb-2" style="background-color:#282828">
        <!-- <v-card :style="profile.public ? 'background-color:#282828' : ''" :flat="!profile.public"> -->
          <v-card-text class="pb-3 white--text">
            <v-switch
              class="inline-block mt-0 mb-2"
              v-model="profile.public"
              :label="`Add yourself as a colleague`"
              :disabled="user.contribution < 12"
              hide-details
            ></v-switch>
            <!-- <Info v-if="!profile.public" title="Being a colleague" :opacity="profile.public ? '.75' : '1'" :iconClasses="profile.public ? 'nudge-y--25 ml-2' : 'primary--text nudge-y--25 ml-2'" text="Make yourself visible to other logged-in users and add additional information about yourself for networking and connecting."></Info> -->
            <div v-if="user.contribution < 12 || !user.public">
                <span class="overline pink--text">Being a colleague</span>
                <p>
                  As colleague, you make yourself visible to other logged-in users:
                  <span class="orange--text italics">Find others and be found.</span>
                </p>
                <p>
                  You can add additional information about yourself (like skillset and experience)
                  for networking and connecting in your industry.
                  Contribution is key to <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>.
                </p>
                <p v-if="user.contribution < 12">
                  To become a colleague, gain at least <span class="orange--text">12</span> contribution points:
                  <ul class="niceList">
                    <li><span class="orange--text">3 new</span> resources (<span class="orange--text">4</span> points each) or</li>
                    <li><span class="orange--text">improve 6</span> resources with details (<span class="orange--text">2</span> points each)</li>
                  </ul>
                </p>
                <p v-if="!user.emailVerified">
                  Also, please <router-link class="orange--text no-underline" to="/profile?hint=verifyEmail" @click="$helpers.scrollTo(this, 'verifyEmailButton')">verify your email</router-link>.
                </p>
            </div>
          </v-card-text>
          <v-card-text v-if="profile.public" class="white--text pt-0">
            <p>
              This profile and your email {{user.email}}
              <span class="orange--text">{{user.public ? 'is' : 'will be'}} visible</span>
              to other logged-in users.<br>
              Add additional information about yourself for networking and connecting.<br>
              Nothing in this list is mandatory.
            </p>

            <!-- <div class="primary--text caption mt-0 mb-1">Basics</div> -->
            <!-- <div class="primary--text fill-width">
              <hr class="mb-3 mt-12" style="border:none; border-top: solid 1px rgba(255,255,255,.25);">
              <v-card-title class="justify-center">Basics</v-card-title>
            </div> -->

            <v-stepper
              v-model="colleaguePage"
              vertical
              non-linear
              class="ma-0 pa-0 transparent elevation-0 flat"
            >
              <v-stepper-step
                :complete="profile.colleague.about.length > 0 || profile.colleague.industries.length > 0 || profile.colleague.industries.length > 0 || profile.colleague.skillset.length > 0 || experience > 0"
                editable
                edit-icon="mdi-playlist-check"
                step="1"
                class="pt-4 rounded"
                :class="colleaguePage == 1 ? 'grey darken-4' : ''"
              >
                Basics
                <small>About you, job, skillset & experience</small>
              </v-stepper-step>

              <v-stepper-content ref="step-1" step="1" :class="$vuetify.breakpoint.xs ? 'ml-0 pl-0 pr-9 pt-4' : ''" :style="$vuetify.breakpoint.xs ? 'border-left:none' : ''">
                <!-- ABOUT -->
                <v-textarea auto-grow rows="1" filled label="About me" hint="Who are you? Relevant education? Do you have a workshop?" type="text" v-model="profile.colleague.about"></v-textarea>
                <!-- https://vuetifyjs.com/en/components/chips/#in-selects -->
                
                <!-- INDUSTRY -->
                <v-select
                  filled
                  dense
                  v-model="profile.colleague.industries"
                  :items="industries"
                  chips
                  clearable
                  deletable-chips
                  label="Industries"
                  multiple
                  :menu-props="{ offsetY: true }"
                >
                <!-- , closeOnContentClick: true -->
                  <!-- <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      color="grey darken-3"
                      @click="select"
                      @click:close="removeSelectedChip(profile.colleague.industries, item)"
                    >
                      {{ $helpers.capitalize(item) }}
                    </v-chip>
                  </template> -->
                </v-select>

                <!-- JOB -->
                <!-- <pre>{{profile.colleague.jobIds}}</pre> -->

                  <!-- 
                  :return-object="false"
                  item-value="jobId"
                   -->
                  <!-- v-if="availableJobs.length > 1" -->
                <v-combobox
                  v-if="profile.colleague.industries.length > 0"
                  id="job"
                  :items="availableJobs"
                  item-text="job"
                  v-model="profile.colleague.jobIds"
                  :menu-props="{ offsetY: true }"
                  filled
                  clearable
                  label="Job titles - choose, or type your own. First one most important job."
                  :search-input.sync="comboboxSearchTerm"
                  allow-overflow
                  chips
                  deletable-chips
                  multiple
                  dense
                  hide-details
                  @change="calcSalary()"
                >
                  <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      color="grey darken-3"
                      @click="select"
                      @click:close="removeSelectedChip(profile.colleague.jobIds, item)"
                    >
                      {{ $helpers.capitalize(Number.isInteger(item) ? getJob(item).job : item.job ? item.job : item) }}
                    </v-chip>
                  </template>
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="orange--text">
                          
                          <span v-if="comboboxSearchTerm">No jobs matching "<strong>{{ comboboxSearchTerm }}</strong>".</span>
                          <span v-else-if="profile.colleague.industries && profile.colleague.industries.length">No jobs for <strong>{{ profile.colleague.industries.join(', ') }}</strong>.</span>
                          Type & press <kbd>enter</kbd> to create a new job title
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>

                <v-checkbox
                  v-model="profile.colleague.selfEmployed"
                  class="pt-0"
                  dense
                >
                  <template v-slot:label>
                    Self-employed
                    <Info title="Self-employed" text="persons are those who work under their own name for their own account and are in an independent position and bear their own economic risk.<br>In short, they can write their own bills and do not need to be employed by the production company."></Info>
                  </template>
                </v-checkbox>

                <!-- <v-text-field v-if="profile.colleague.jobId === -1" filled label="Custom job title" error :error-messages="['You won\'t be easily found through the search if you\'re not choosing a generalized job in the box above!']" persistent-hint type="text" v-model="profile.title"
                ></v-text-field> -->

                <!-- SKILLSET -->
                <v-combobox
                  filled
                  dense
                  v-model="profile.colleague.skillset"
                  chips
                  deletable-chips
                  allow-overflow
                  clearable
                  label="Skillset - Type and press enter"
                  multiple
                  hide-details
                  append-icon=""
                >
                </v-combobox>

                <small class="grey--text block mt-4">Skillset suggestions:</small>
                <v-hover
                  v-slot="{ hover }"
                >
                  <v-chip-group
                    v-model="profile.colleague.skillset"
                    column
                    multiple
                    class="mb-6 smoothMoves-500"
                    :class="hover ? 'maxy-auto' : 'maxy-75 ovfl-y--hidden fadeout-bottom'"
                  >
                    <v-chip
                      filter
                      outlined
                      v-for="(value, index) in skillset"
                      :key="'skillset-chip-'+index"
                      :value="value"
                      :input-value="profile.colleague.skillset.includes(value)"
                    >
                      {{value}}
                    </v-chip>
                  </v-chip-group>
                </v-hover>

                <!-- EXPERIENCE -->
                <div class="pa-2 pb-0 rounded white--text " style="background-color: #393939; border-bottom-right-radius: 0 !important; border-bottom-left-radius: 0 !important; border-bottom: solid .1em #CCC !important">
                  <div class="grey--text text--lighten-1 caption ml-1 my-0">{{experience >= 20 ? `${experience}+` : experience > 0 ? experience : ''}} years of experience</div>
                  <v-slider
                    class="nudge-y--25"
                    v-model="experience"
                    min="0"
                    max="20"
                    thumb-label
                    dense
                    hide-details
                  ></v-slider>
                </div>
                <div class="grey--text text--lighten-1 caption my-1 ml-3">Years since first paid professional job in your busiest industry</div>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="pink darken-3"
                    small dense
                    @click="colleaguePage++"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-stepper-content>

              <v-stepper-step
                editable
                edit-icon="mdi-playlist-check"
                :complete="Object.values(profile.colleague.licenses).some(Boolean)"
                step="2"
                class="pt-4 rounded"
                :class="colleaguePage == 2 ? 'grey darken-4' : ''"
              >
                Licenses
                <small>Car, pyro and electrician licenses</small>
              </v-stepper-step>
              <v-stepper-content ref="step-2" step="2" :class="$vuetify.breakpoint.xs ? 'ml-0 pl-0 pr-9 pt-4' : ''" :style="$vuetify.breakpoint.xs ? 'border-left:none' : ''">
                <v-container class="pa-0">
                  <v-row>
                    <v-col class="py-0" cols="12" sm="12" md="6">
                      <v-checkbox filled dense hide-details class="mt-0" label="Car license (<= 3.5t)" type="text" v-model="profile.colleague.licenses.car"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Truck license (> 3.5t)" type="text" v-model="profile.colleague.licenses.truck"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Motorcycle license" type="text" v-model="profile.colleague.licenses.motorcycle"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Trailer license" type="text" v-model="profile.colleague.licenses.trailer"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Diving license" type="text" v-model="profile.colleague.licenses.diving"></v-checkbox>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="12" md="6">
                      <v-checkbox filled dense hide-details class="mt-0" label="Forklift license" type="text" v-model="profile.colleague.licenses.forklift"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Certified pyrotechnician" type="text" v-model="profile.colleague.licenses.pyro"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Certified electrician" type="text" v-model="profile.colleague.licenses.electrician"></v-checkbox>
                      <v-checkbox filled dense hide-details class="mt-0" label="Firearm license" type="text" v-model="profile.colleague.licenses.gun"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="pink darken-3"
                    small dense
                    @click="colleaguePage++"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-stepper-content>

              <v-stepper-step
                editable
                edit-icon="mdi-playlist-check"
                :complete="profile.colleague.salary > 0"
                step="3"
                class="pt-4 rounded"
                :class="colleaguePage == 3 ? 'grey darken-4' : ''"
              >
                Salary
                <small>Calculators & Salary</small>
              </v-stepper-step>

              <v-stepper-content ref="step-3" step="3" :class="$vuetify.breakpoint.xs ? 'ml-0 pl-0 pr-9 pt-4' : ''" :style="$vuetify.breakpoint.xs ? 'border-left:none' : ''">
                <!-- user.colleague.jobIds: <pre>{{user.colleague.jobIds}}</pre>
                profile.colleague.jobIds: <pre>{{profile.colleague.jobIds}}</pre> -->
                
                <!-- FILM INDUSTRY - SSFV CALC -->
                <v-card class="mb-7" style="background-color: #333333;" v-if="isWorkingInFilmIndustry && profile.colleague.jobIds.filter(x => {if(x.industry === 'film') {return x}}).length > 0">
                  <v-card-title>
                    <img style="height:1.25em" class="mr-2 mb-2" :src="require('@/assets/ssfv.png')"/>
                    Film salary calculator
                  </v-card-title>
                  <v-card-text class="white--text">
                    This calculator helps you find your wage with the wage guidelines of SSFV.
                    <br>
                    First, select the film job
                    <span class="pointer primary--text" @click="colleaguePage = 1, goto('job')">
                      chosen above
                    </span>
                    you wish to use as a base for your calculation:
                    <!-- <pre>{{calcBaseJobId}}</pre> -->
                    <v-radio-group
                        dense
                        class="pt-0 mb-4 white--text"
                        v-model="calcBaseJobId"
                        @change="calcSalary()"
                        hide-details
                      >
                        <v-radio
                          filled
                          v-for="(job, i) in profile.colleague.jobIds.filter(x => {if(x.industry === 'film') {return x}})"
                          :key="'selectJobToCalc-'+i"
                          dense
                          hide-details
                          class="mt-0"
                          :label="job.job"
                          :value="job.jobId"
                        ></v-radio>
                    </v-radio-group>
                    <!-- {{profile.colleague.jobIds}} -->

                    <div v-if="calcBaseJobId >= 0 && calcBaseJobId < 1000">
                      <v-container class="pa-0">
                        <v-row justify="center" >
                          <v-col class="pa-2 pb-0" cols="12">
                            <div class="grey--text text--lighten-1 caption">Select your SSFV level:</div>
                          </v-col>
                        </v-row>
                        <v-row justify="center" class="rounded"
                            :class="calcBaseJobId >= 1000 ? 'op-25' : ''"
                        >
                          <v-col class="pa-2" cols="6" sm="3"
                            :style="calcBaseJobId >= 1000 ? 'pointer-events: none;' : ''"
                            @click="profile.colleague.ssfv.level = 0; calcSalary()"
                          >
                            <v-card class="pa-2 text-center rounded white--text pointer hover" :class="[profile.colleague.ssfv.level === 0 ? 'primary darken-2' : '', ssfvError ? 'error darken-3' : '']">
                              <v-chip color="white" class="pointer text-h4 primary--text my-2 px-4" align="center">0</v-chip>
                            </v-card>
                          </v-col>
                          <v-col class="pa-2" cols="6" sm="3"
                            :style="calcBaseJobId >= 1000 ? 'pointer-events: none;' : ''"
                            @click="profile.colleague.ssfv.level = 1; calcSalary()"
                          >
                            <v-card class="pa-2 text-center rounded white--text pointer" :class="[profile.colleague.ssfv.level === 1 ? 'primary darken-2' : '', ssfvError ? 'error darken-3' : '']">
                              <v-chip color="white" class="pointer text-h4 primary--text my-2 px-4" align="center">1</v-chip>
                            </v-card>
                          </v-col>
                          <v-col class="pa-2" cols="6" sm="3"
                            :style="calcBaseJobId >= 1000 ? 'pointer-events: none;' : ''"
                            @click="profile.colleague.ssfv.level = 2; calcSalary()"
                          >
                            <v-card class="pa-2 text-center rounded white--text pointer" :class="[profile.colleague.ssfv.level === 2 ? 'primary darken-2' : '', ssfvError ? 'error darken-3' : '']">
                              <v-chip color="white" class="pointer text-h4 primary--text my-2 px-4" align="center">2</v-chip>
                            </v-card>
                          </v-col>
                          <v-col class="pa-2" cols="6" sm="3"
                            :style="calcBaseJobId >= 1000 ? 'pointer-events: none;' : ''"
                            @click="profile.colleague.ssfv.level = 3; calcSalary()"
                          >
                            <v-card class="pa-2 text-center rounded white--text pointer" :class="[profile.colleague.ssfv.level === 3 ? 'primary darken-2' : '', ssfvError ? 'error darken-3' : '']">
                              <v-chip color="white" class="pointer text-h4 primary--text my-2 px-4" align="center">3</v-chip>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-container>

                      <span v-if="profile.colleague.ssfv.level != null">
                        Level {{profile.colleague.ssfv.level}}: {{ssfvLevel[profile.colleague.ssfv.level]}}
                      </span>

                      <v-radio-group
                        :error="ssfvError"
                        row
                        dense
                        class="pt-0 white--text"
                        v-model="profile.colleague.ssfv.rate"
                        @change="calcSalary()"
                        :disabled="calcBaseJobId >= 1000"
                      >
                        <v-radio
                          filled
                          dense
                          hide-details
                          class="mt-0"
                          label="Base rate: Weekly (for long jobs)"
                          value="weekly"
                        ></v-radio>
                        <v-radio
                          filled
                          dense
                          hide-details
                          class="mt-0"
                          label="Base rate: Daily (for short jobs)"
                          value="daily"
                        ></v-radio>
                        <small v-if="ssfvError" class="error--text">
                          Choose a rate when selecting a SSFV level
                        </small>
                      </v-radio-group>

                      <p>
                        You find your suggested salary below.
                        Feel free to change it to your literal needs.
                        <span class="italics orange--text">
                          Never go below!
                        </span>
                      </p>
                    </div>

                    <p class="white--text">
                      For more infos about the ssfv salaray calculation, visit <a class="externalLink" href="https://www.ssfv.ch/de/arbeiten-im-film" target="_blank">ssfv.ch</a>.
                    </p>
                  </v-card-text>
                </v-card>

                <!-- T.PUNKT CALC -->
                <!-- FIXME does not show up if industry/theater job was chosen new but not yet saved -->
                <v-card class="mb-7" style="background-color: #333333;" v-if="isWorkingInTheaterIndustry && profile.colleague.jobIds.filter(x => {if(x.industry === 'theater') {return x}}).length > 0">
                  <v-card-title>
                    <img style="height:1.25em" class="mr-2 mb-2" :src="require('@/assets/tpunkt.svg')"/>
                    Theater salary calculator
                  </v-card-title>
                  <v-card-text class="white--text">
                    This calculator helps you find your wage with the wage guidelines of T.PUNKT.
                    <br>
                    First, select the theater job
                    <span class="pointer primary--text" @click="colleaguePage = 1, goto('job')">
                      chosen above
                    </span>
                    you wish to use as a base for your calculation:
                    <!-- <pre>{{calcBaseJobId}}</pre> -->
                    <v-radio-group
                        dense
                        class="pt-0 white--text"
                        v-model="calcBaseJobId"
                        @change="calcSalary()"
                      >
                        <v-radio
                          filled
                          v-for="(job, i) in profile.colleague.jobIds.filter(x => {if(x.industry === 'theater') {return x}})"
                          :key="'selectJobToCalc-theater-'+i"
                          dense
                          hide-details
                          class="mt-0"
                          :label="job.job"
                          :value="job.jobId"
                        ></v-radio>
                    </v-radio-group>
                    <!-- {{profile.colleague.jobIds}} -->

                    <div v-if="calcBaseJobId >= 1000">
                      <!-- Based on your theater job
                      ({{$helpers.findKey(jobs, 'jobId', profile.colleague.jobId, 'job')}}) 
                      <span class="pointer mx-1 primary--text" @click="colleaguePage = 1, goto('job')">
                        chosen above
                      </span>,
                      and T.Punkt guidline wages,
                      you find your suggested salary below.
                      Feel free to change it to your literal needs.
                      <br>
                      Never go below!
                      <br> -->

                      <!-- Diese Richtgagen und Richtlöhne entsprechen Mindestangaben. -->
                      <!-- <br>
                      These figures with the free theater scene. -->
                      Set your base rate:
                                      
                      <v-radio-group row hide-details dense class="pt-0"
                        v-model="profile.colleague.theater.phase" @change="calcSalary()"
                        :disabled="calcBaseJobId < 1000 && calcBaseJobId != -1"
                      >
                        <v-radio
                          filled
                          dense
                          hide-details
                          class="mt-0"
                          label="Use base rate during conceptual phase"
                          value="conceptual"
                        ></v-radio>
                        <v-radio
                          filled
                          dense
                          hide-details
                          class="mt-0"
                          label="Use base rate during rehersals"
                          value="rehersal"
                        ></v-radio>
                      </v-radio-group>
                      <br>

                      <p>
                        <v-icon small color="yellow" >mdi-note-text</v-icon>
                        Note: The difference between those two base rates is currently only apparent when you select the job "Collective member with artistic lead".
                      </p>
                      <p>
                        <v-icon small color="yellow" >mdi-alert</v-icon>
                        These guideline wages and guideline salaries correspond to minimum figures.
                      </p>
                      <p>
                        SOME of these wages correspond to 24 prep days per project.
                      </p>
                      <p>
                        You find your suggested salary below.
                        Feel free to change it to your literal needs.
                        <span class="italics orange--text">
                          Never go below!
                        </span>
                      </p>

                      <p>
                        For more infos about the t.Theaterschaffen salaray calculation, visit <a class="externalLink" href="https://www.tpunkt.ch/richtgagen-richtloehne" target="_blank">tpunkt.ch</a>.
                      </p>
                    </div>
                  </v-card-text>
                </v-card>
                
                <p v-if="!profile.colleague.jobId || profile.colleague.jobId < 0">
                  Set your own wage; or choose an industry standard
                  <span class="pointer mx-1 primary--text" @click="goto('job')">job above</span>
                  to get salary suggestions.
                </p>
                <!-- {{typeof profile.colleague.salary}} -->
                <!-- theater.phase: {{profile.colleague.theater.phase}}
                ssfv.rate: {{profile.colleague.ssfv.rate}} -->
                <v-text-field filled prefix="CHF" suffix="per day (à 10h, netto)"
                  v-model.number="profile.colleague.salary"
                  @blur="profile.colleague.salary = ((profile.colleague.salary*10)/10).toFixed(2)"
                  @input="salaryError='', profile.colleague.theater.phase = null, profile.colleague.ssfv.rate = '', profile.colleague.ssfv.level = null"
                  :label="`Salary`"
                  type="text"
                  hint="Set to zero if you'd rather not say."
                  :error-messages="salaryError"
                  :error="salaryError.length > 0"
                  persistent-hint
                ></v-text-field>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="pink darken-3"
                    small dense
                    @click="colleaguePage++"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-stepper-content>

              <v-stepper-step
                editable
                edit-icon="mdi-playlist-check"
                :complete="profile.colleague.web.length > 0 || profile.colleague.webProfile.length > 0 || profile.colleague.tel.length > 0 || profile.colleague.residency.length > 0 || profile.colleague.languages.length > 0 || profile.colleague.languages.length > 0"
                step="4"
                class="pt-4 rounded"
                :class="colleaguePage == 4 ? 'grey darken-4' : ''"
              >
                Contact
                <small>Websites, Residency & Languages</small>
              </v-stepper-step>

              <v-stepper-content ref="step-4" step="4" :class="$vuetify.breakpoint.xs ? 'ml-0 pl-0 pr-9 pt-4' : ''" :style="$vuetify.breakpoint.xs ? 'border-left:none' : ''">
                <v-text-field
                  label="Main website"
                  hint="Your main website or social account"
                  autocapitalize="none"
                  filled
                  v-model.trim="profile.colleague.web"
                  type="text"
                ></v-text-field>

                <v-textarea
                  label="Profile websites"
                  autocapitalize="none"
                  auto-grow rows="1"
                  hint="IMDB, crewunited, SSFV, instagram... if more than one, comma seperate"
                  filled
                  v-model.trim="profile.colleague.webProfile"
                  type="text"
                ></v-textarea>

                <v-text-field
                  filled
                  label="Mobile"
                  hint="If non-CH number, include your country code"
                  type="text"
                  v-model="profile.colleague.tel"
                ></v-text-field>
                
                <!-- RESIDENCY -->
                <v-select
                  :items="residency"
                  v-model="profile.colleague.residency"
                  filled
                  label="Current residency"
                  clearable
                  dense
                  :menu-props="{ offsetY: true }"
                ></v-select>
                
                <!-- LANGUAGES -->
                <!-- <v-text-field filled label="Languages" type="text" v-model="profile.colleague.languages"></v-text-field> -->
                <!-- <v-combobox
                  filled
                  dense
                  v-model="profile.colleague.skillset"
                  :items="skillset"
                  :search-input.sync="comboboxSearchTerm"
                  chips
                  clearable
                  label="Skillset - choose or type your own"
                  multiple
                > -->
                <!-- profile.colleague.languages: <pre>{{profile.colleague.languages}}</pre> -->
                
                <v-combobox
                  filled
                  dense
                  v-model="profile.colleague.languages"
                  :items="languages"
                  chips
                  deletable-chips
                  clearable
                  label="Languages - Choose or type your own"
                  multiple
                  :search-input.sync="comboboxSearchTerm"
                  allow-overflow
                  :rules="requiered"
                  :menu-props="{ offsetY: true }"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="orange--text">
                          No results matching "<strong>{{ comboboxSearchTerm }}</strong>". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="pink darken-3"
                    small dense
                    @click="colleaguePage = 0, saveUserData()"
                    :disabled="hasMadeChanges"
                  >
                    DONE!
                  </v-btn>
                </v-card-actions>
              </v-stepper-content>
            </v-stepper>
          </v-card-text>
        </v-card>


        <!-- GENERAL USER ACTIONS -->
        <v-container class="pa-0">
          <v-row>
            <v-col cols="6" sm="4">
              <v-btn :small="$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'fill-width' : ''" @click="deleteAccountConfirmation = !deleteAccountConfirmation">
                Delete my account
              </v-btn>
            </v-col>
            <v-col cols="6" sm="4" align="center">
              <v-btn :small="$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'fill-width' : ''" @click="requestResetPassword()">
                Reset password
              </v-btn>
            </v-col>
            <v-col  v-if="!deleteAccountConfirmation || $vuetify.breakpoint.smAndUp" cols="12" sm="4" align="right">
              <v-btn 
                :class="$vuetify.breakpoint.xs ? 'fill-width' : ''" 
                type="submit" color="primary"
                :disabled="hasMadeChanges"
              >
                Save {{$vuetify.breakpoint.smAndUp ? "changes" : ""}}
                <v-progress-circular
                  :size="16"
                  :width="2"
                  v-if="loading"
                  indeterminate
                  color="primary"
                  class="ml-1"
                ></v-progress-circular>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="deleteAccountConfirmation || !user.emailVerified">
            <v-col :class="$vuetify.breakpoint.smAndUp ? 'py-0' : ''" cols="12" align="center">
              <v-btn :class="$vuetify.breakpoint.xs ? 'fill-width' : ''" v-if="deleteAccountConfirmation" :disabled="profile.email === 'info@fluescher.ch'" @click="deleteAccount()" color="red">
                {{$vuetify.breakpoint.smAndUp ? 'Delete account now and everything with it.' : 'Delete account now'}}
              </v-btn>
              <v-btn ref="verifyEmailButton" :small="$vuetify.breakpoint.xs" :class="[$vuetify.breakpoint.xs ? 'fill-width' : '', this.$route.query.hint === 'verifyEmail' ? 'error--fade' : '']" v-if="!deleteAccountConfirmation && !user.emailVerified" @click="sendEmailVerification(), $router.push({query: {}}) " type="button" color="">
                Resend verification email
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </form>

      Your user ID is
      <pre class="grey--text" style="display:inline">{{user.uid}}</pre>
      <Copy :data="user.uid" dataName="user ID"></Copy>
      <a class="no-underline" :href="`mailto:info@fluescher.ch?subject=szenodb.ch%3A%20My%20User%20ID&body=Hello%20there%21%0AThe%20reason%20I%27m%20writing%20you%20is%20%28as%20discussed%2Fbecause%20I%27m%20happy%2Fawful%2Fother%29.%0A%0AFor%20further%20troubleshooting%2C%20my%20user%20ID%20is%20${user.uid}%0A%0APlease%20get%20in%20touch%2C%0A${user.name}%0A-----%0ADirect%20admin%20link%3A%0Ahttps%3A%2F%2Fconsole.firebase.google.com%2Fproject%2Fszenodb%2Ffirestore%2Fdata%2F~2Fusers~2F${user.uid}`">
        <v-icon small class="grey--text pointer ml-2" title="Mail this to the admin">mdi-email</v-icon>
      </a>
      <br>
      and you have <span class="orange--text">{{user.contribution ? user.contribution.toLocaleString() : 0}}</span> contribution {{user.contribution == 1 ? 'point' : 'points'}}. {{"🥳 ".repeat(user.contribution > 500 ? 5 : user.contribution / 100)}}
      <Info title="Contribution Points" text="are calculated from your activity: Creating or editing resources, and being a regular user.<br>They are only used for two things:<br>- With 12 or more points, you can be a public colleague, and your points are shown to other colleagues<br>- If you're very active, maybe you get a bottle of wine from the admins 🍷"></Info>
    </v-card>
  </div>
</template>

<script>
import { db, auth } from '../firebase'
import Copy from '@/components/Copy'
import FileUpload from '@/components/FileUpload'
import Info from '@/components/Info'

  export default {
    name: 'Profile',
    props: {
      user: Object,
    },
    components: {
      Copy, Info, FileUpload
    },

    data () {
      return {
        profile: {},
        loading: false,
        deleteAccountConfirmation: false,
        requiered: [value => !!value || 'Required.'],
        comboboxSearchTerm: '',
        salaryError:'',
        calcBaseJobId:-1,
        colleaguePage: 0,
        experience: 0,
        industries: [
          'commercials',
          'circus',
          'fashion',
          'film',
          'theater',
          'tv',
        ],
        skillset: [
          'Woodworking/Carpenter',
          'Woodworking/joiner',

          'Metalworking',
          'Welding (TIG)',
          'Welding (MIG/MAG)',
          'Welding (other)',
          
          'Upholstery',
          'Sewing',
          'Sewing (leather)',
          'Pattern design',

          'Logistics pro',
          'Hunter & gatherer',
          'Gardening/Plants',
          'Propmaking',
          'Modelmaking',

          'Painting (surface)',
          'Painting (artsy)',
          'Fake materials by painting them',
          'Patinage (objects)',
          'Patinage (clothes)',
          'Foil objects',
          
          'Mechanical design',
          'Electrical design',
          'Electrical wiring',
          'Can mount a lamp',
          'Soldering',
          'PCB soldering',

          'Creative on demand',
          'Sketching',
          'Visualizing (analog)',
          'Visualizing (digital)',
          'Graphic design',
          '3d designs',
          'CAD / Architectural drawings',
          'Fake various handwritings',
          
          'Good with computers',
          'Bad with computers',
          'Programming',
          'Linux',
          'Adobe suite',
          'Playback operator',
          'Digital props',
          'PCB Design',

          'CNC machine',
          '3d printing',

          'Car fixing',
          'Car wrangling',

          'Good with small stuff',
          'Good with big stuff',

          'Self proclaimed nerd',
          'Like to teach knowledge',
          'Like to receive knowledge',
        ],
        jobs: [
          {
            jobId: 10,
            job: 'Production Design', // Szenenbildner:in / Chef décorateur',
            salary: {
              daily: [0, 685, 775],
              weekly: [1870/5,2150/5,2430/5],
            },
            industry: 'film',
          },
          {
            jobId: 11,
            job: 'Assistant Production Design',  // Szenenbild-Assistenz / Assistant décorateur',
            salary: {
              daily: [325, 370, 420],
              weekly: [1500/5,1725/5,1950/5],
            },
            industry: 'film',
          },
          {
            jobId: 12,
            job: 'Prop Master',  // Ausstatter:in / Décorateur',
            salary: {
              // Todo: NATALINA fragen, aussen requisite?? wochen/tagesliste wiederspricht sich
              daily: [510,590,665],
              weekly: [1390/5,1600/5,1810/5],
            },
            industry: 'film',
          },
          {
            jobId: 13,
            job: 'Stand-by Props',  // Set requisiteur:in / Accessoiriste de plateau',
            salary: {
              // Todo: NATALINA fragen, set requisite?? wochen/tagesliste wiederspricht sich
              daily: [380,440,495],
              weekly: [1390/5,1600/5,1810/5],
            },
            industry: 'film',
          },
          {
            jobId: 14,
            job: 'Set Constructor',  // Baubühne/Dekorbau / Construction de décor',
            salary: {
              daily: [380,440,495],
              weekly: [1390/5,1600/5,1810/5],
            },
            industry: 'film',
          },
          {
            jobId: 100,
            job: 'Costume Designer',  // Kostümbildner:in / Chef costumier',
            salary: {
              daily: [595,685,435],
              weekly: [1750/5,2015/5,2275/5],
            },
            industry: 'film',
          },
          {
            jobId: 101,
            job: 'Assistant Costume Designer',  // Kostümbild-Assistenz / Assistant costumier',
            salary: {
              daily: [325,370,420],
              weekly: [1600/5,1770/5,1950/5],
            },
            industry: 'film',
          },
          {
            jobId: 200,
            job: 'Wardrobe',  // Garderobe / Habilleur/habilleuse',
            salary: {
              daily: [335,385,435],
              weekly: [1390/5,1600/5,1810/5],
            },
            industry: 'film',
          },
          {
            jobId: 201,
            job: 'Assistant Wardrobe',  // Garderoben-Assistenz / Assistant/e habillage',
            salary: {
              // Todo: gibt kenen lohn für tages???
              daily: [0,0,0],
              weekly: [1110/5,1280/5,1445/5],
            },
            industry: 'film',
          },
          {
            jobId: 300,
            job: 'Chief Make-up Artist',  // Chef-Maskenbildner:in / Chef maquilleur/cheffe maquilleuse',
            salary: {
              // TODO: Ask someone, maskenbild vs makeup? makup artist FX?
              // TODO: gibt kenen lohn für tages???
              daily: [0,0,0],
              weekly: [1670/5,1920/5,2170/5],
            },
            industry: 'film',
          },
          {
            jobId: 301,
            job: 'Make-up Artist',  // Maskenbildner:in / Maquilleur/maquilleuse',
            salary: {
              daily: [0,620,700],
              weekly: [1440/5,1655/5,1870/5],
            },
            industry: 'film',
          },
          {
            jobId: 302,
            job: 'Assistant Make-up Artist',  // Maskenbild-Assistenz / Assistant maquilleur',
            salary: {
              daily: [290,335,380],
              weekly: [1110/5,1280/5,1445/5],
            },
            industry: 'film',
          },
          {
            jobId: 400,
            job: 'Hair-Stylist',  // Hair-Stylist:in / Coiffeur',
            salary: {
              daily: [475,550,620],
              weekly: [1275/5,1465/5,1655/5],
            },
            industry: 'film',
          },
          {
            jobId: 1000,
            job: 'Stage design',  // Bühnenbild
            salary: {
              conceptual: [250],
              rehersal: [250],
            },
            industry: 'theater',
          },
          {
            jobId: 1001,
            job: 'Stage design & Costume design',  // Ausstattung (Bühnenbild & Kostümbild)
            salary: {
              conceptual: [416.67],
              rehersal: [416.67],
            },
            industry: 'theater',
          },
          {
            jobId: 1002,
            job: 'Costume design',  // Kostümbild
            salary: {
              conceptual: [250],
              rehersal: [250],
            },
            industry: 'theater',
          },
          {
            jobId: 1003,
            job: 'Make-up artist',  // Maskenbild
            salary: {
              conceptual: [700],
              rehersal: [700],
            },
            industry: 'theater',
          },
          {
            jobId: 1005,
            job: 'Collective member with artistic lead',  // künstlerische Leitung im kollektiv
            salary: {
              conceptual: [250],
              rehersal: [350],
            },
            industry: 'theater',
          },
          {
            jobId: 1006,
            job: 'Collective member',  // kollektivmitglieder
            salary: {
              conceptual: [250],
              rehersal: [250],
            },
            industry: 'theater',
          },
        ],
        ssfvLevel: [
          'You have no or little experience on professional filmsets.',
          '1.–4. langer Film und 1.–3. Berufsjahr/de 1 à 4 films longs et de 1 à 3 ans d’expérience prof.',
          '5.–8. langer Film oder 4.–6. Berufsjahre/de 5 à 8 films longs ou de 4 à 6 ans d’exp. prof.',
          'ab 9. langem Film oder 7. Berufsjahre/à partir du 9ème film long ou de la 7ème année d’exp.',
        ],
        languages: [
          'german', 'english', 'french', 'italian', 'portuguese', 'spanish', 'albanian', 'serbian', 'mandarin', 'hindi', 'arabic', 'russian', 'indonesian', 'others'
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
        ]
      }
    },

    mounted() {
      if(this.$route.query.hint === 'verifyEmail') {
        this.$helpers.scrollTo(this, 'verifyEmailButton');
      }
    },

    async created() {
      this.profile = JSON.parse(JSON.stringify(this.user));

      if(this.profile.news === undefined) {
        this.profile.news = true;
      }
      
      if(!this.profile.colleague) {
        // New users don't have this
        let moreData = {
          about: '',
          skillset: [],
          industries: [],
          jobIds: [],
          ssfv: {
            level: 0,
            rate: false,
          },
          theater: {
            phase: false
          },
          salary: 0.0,
          experience: new Date().getFullYear(),
          web: '',
          webProfile: '',
          tel: '',
          licenses: {
            car: false,
            truck: false,
            diving: false,
            motorcycle: false,
            trailer: false,
            forklift: false,
            pyro: false,
            electrician: false,
            gun: false,
          },
          languages: [],
          residency: '',
          ...(this.profile.colleague && {...this.profile.colleague}),
        }
        this.$set(this.profile, 'colleague', moreData);
        // this.experience = 0;
      } else {
        // Translate job ids to job object
        for (var i = 0; i < this.profile.colleague.jobIds.length; i++) {
            if(Number.isInteger(this.profile.colleague.jobIds[i])) {
              this.profile.colleague.jobIds[i] = this.getJob(this.profile.colleague.jobIds[i])
            }
          }
      }

      this.experience = new Date().getFullYear() - this.profile.colleague.experience;
      // console.log(this.profile);
    },

    beforeDestroy() {
      this.profile = {};
    },

    watch: {
      experience() {
        this.profile.colleague.experience = new Date().getFullYear() - this.experience;
      },
      async colleaguePage() {
        // BUGFIX OF VUIETIFY:
        //   On first loading of page (soft or hard), height if stepper wrapper is absolutely
        //   set in px not 'auto'.
        //   Hotfix: Wait for stepper to open, then set it to auto.
        await this.$helpers.sleep(1000);
        // console.log(this.$refs[`step-${this.colleaguePage}`].height);
        this.$refs[`step-${this.colleaguePage}`].height = 'auto';
      },
    },

    computed: {
      isWorkingInFilmIndustry() {
        return this.profile.colleague.industries && (this.profile.colleague.industries.includes('film') || this.profile.colleague.industries.includes('tv') || this.profile.colleague.industries.includes('commercials'))
      },
      isWorkingInTheaterIndustry() {
        return this.profile.colleague.industries && this.profile.colleague.industries.includes('theater')
      },
      availableJobs() {
        // let other = {job: 'other (not recommended)', jobId: -1};
        if(this.isWorkingInFilmIndustry && this.isWorkingInTheaterIndustry) {
          // Add (film) or (theater) to the end of the job to distinguish
          return [
            ...JSON.parse(JSON.stringify(this.jobs)).filter(x => {
              x.job = x.job + ` (${x.industry})`; return x
            })
          ];
        }
        if(this.isWorkingInFilmIndustry) return [...this.jobs.filter(x => {if(x.industry === 'film') return x})];
        if(this.isWorkingInTheaterIndustry) return [...this.jobs.filter(x => {if(x.industry === 'theater') return x})];
        return []
      },
      hasMadeChanges() {
        return JSON.stringify(this.user) === JSON.stringify(this.profile) || this.loading
      },
      ssfvError() {
        return !(this.profile.colleague.ssfv.level != null && this.profile.colleague.ssfv.rate.length > 0) && !(this.profile.colleague.ssfv.level === null && this.profile.colleague.ssfv.rate.length === 0)
      },
    },

    methods: {
      //// FIXME:
      // Make readable! split in small chunky functions
      async saveUserData () {
        if(this.profile.name.length === 0) {
          this.$toasted.global.error({msg:"Name cannot be empty."});
          return
        }
        if(this.profile.email.length === 0 || !this.$helpers.checkEmail(this.profile.email)) {
          this.$toasted.global.error({msg:"Email is formatted badly."});
          return
        }

        try {
          this.loading = true;
          let changedEmail = this.profile.email != this.user.email
          let newEmail = this.profile.email;
          let namedJobListOld = '';
          let namedJobListNew = '';
          // this.profile.colleague.experience = new Date().getFullYear() - this.profile.colleague.experience;
          // Reset job objects to just ID
          // FIXME: generalize
          if(this.user.colleague) {
            for (let i = 0; i < this.user.colleague.jobIds.length; i++) {
              if(!isNaN(this.user.colleague.jobIds[i])) {
                namedJobListOld += this.$helpers.findKey(this.jobs, 'jobId', this.user.colleague.jobIds[i], 'job')
              } else {
                namedJobListOld += this.user.colleague.jobIds[i]
              }
            }
          }

          // FIXME: generalize
          for (let i = 0; i < this.profile.colleague.jobIds.length; i++) {
            if(this.profile.colleague.jobIds[i].jobId) {
              namedJobListNew += this.profile.colleague.jobIds[i].job
              this.profile.colleague.jobIds[i] = this.profile.colleague.jobIds[i].jobId
            } else {
              namedJobListNew += this.profile.colleague.jobIds[i]
            }
          }

          this.profile.colleague.salary = parseFloat(this.profile.colleague.salary);

          // Strip html
          // TODO:
          // this.user.colleague.about = this.$helpers.stripHtml(this.user.colleague.about);

          /* TRANSLATE */
          let originalText = [];
          if(this.user.colleague) {
            originalText = [
              this.user.name,
              this.user.email,
              this.user.colleague.about,
              // FIXME: this needs to iterate over array this.user.colleague.jobIds
              // ...(this.user.colleague.jobId >= 0 ? [this.$helpers.findKey(this.jobs, 'jobId', this.user.colleague.jobId, 'job')] : []),
              namedJobListOld,
              this.user.colleague.skillset.join(', '),
              this.user.colleague.industries.join(', '),
              this.user.colleague.languages.join(', '),
              this.user.colleague.residency,
              this.user.colleague.web,
              this.user.colleague.webProfile,
            ];
          }
          
          let translateText = [
            this.profile.name,
            this.profile.email,
            this.profile.colleague.about,
            // FIXME: this needs to iterate over array this.user.colleague.jobIds
            // ...(this.profile.colleague.jobId >= 0 ? [this.$helpers.findKey(this.jobs, 'jobId', this.profile.colleague.jobId, 'job')] : []),
            namedJobListNew,
            this.profile.colleague.skillset.join(', '),
            this.profile.colleague.industries.join(', '),
            this.profile.colleague.languages.join(', '),
            this.profile.colleague.residency,
            this.profile.colleague.web,
            this.profile.colleague.webProfile,
          ];

          let searchfield;
          // Only update if something in these fields have changed.
          //   Do not re-translate if changing only salary, user-image, etc
          if(this.$helpers.symmetricDifference(originalText, translateText).length || !this.user.searchfieldOriginal) {
            translateText = translateText.join('\n');
            searchfield = [
              await this.$store.dispatch('translate', {text: translateText, lang: 'DE'}).then(function(text) { return text[0].text }),
              await this.$store.dispatch('translate', {text: translateText, lang: 'EN-GB'}).then(function(text) { return text[0].text }),
              await this.$store.dispatch('translate', {text: translateText, lang: 'FR'}).then(function(text) { return text[0].text }),
              await this.$store.dispatch('translate', {text: translateText, lang: 'IT'}).then(function(text) { return text[0].text }),
            ].join("\n");
          // eslint-disable-next-line no-unreachable
          } else {
            searchfield = this.user.searchfieldOriginal;
          }

          /* WRITE TO DB */
          await db.collection("users").doc(this.user.uid).update({
            'avatar': this.profile.avatar || {},
            'name': this.profile.name,
            'news': this.profile.news,
            'role': this.profile.role,  // Someone can shape the sent object and overwrite this..
            'email': this.profile.email,
            'public': this.profile.public,
            'colleague': this.profile.colleague,
            'searchfieldOriginal': searchfield,
            'searchfield': this.$helpers.normalizeText(searchfield),
          }).then(() => {
            if(changedEmail) {
              auth.currentUser.updateEmail(newEmail).then(() => {
                this.profile.email = newEmail;
                this.profile.emailVerified = false;
                this.$store.commit('setUserProfile', this.profile)
                this.sendEmailVerification();
                this.$toasted.global.success({msg:"Updated profile & email"});
                this.loading = false;
              }).catch((error) => {
                this.$toasted.global.error({msg:error.message});
                this.loading = false;
              });
            } else {
              this.$toasted.global.success({msg:"Updated profile"});
              this.loading = false;
            }
            // Revert job integer to job object
            for (let i = 0; i < this.profile.colleague.jobIds.length; i++) {
              if(!isNaN(this.profile.colleague.jobIds[i])) {
                this.profile.colleague.jobIds[i] = this.$helpers.findKey(this.jobs, 'jobId', this.profile.colleague.jobIds[i], 'object')
              }
            }
          })
        } catch (err) {
          console.log(err)
          this.$toasted.global.error({msg:err.message});
          this.loading = false;
        }
      },
      
      sendEmailVerification() {
        this.$store.dispatch('sendEmailVerification').then(() => {
          this.$toasted.global.info({msg:"Verification email sent. Please check your spam folder."});
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
      },

      async requestResetPassword() {
        try {
          await auth.sendPasswordResetEmail(this.user.email)
          this.$toasted.global.success({msg:"Check your email inbox for a reset link."});
        } catch (err) {
          this.$toasted.global.error({msg:err.message});
        }
      },

      getRandomUserImage() {
        let randomImg = this.$helpers.createUid();
        // this.user.avatar.random = randomImg;
        if(this.profile.avatar === '') this.profile.avatar = {}
        this.profile.avatar.random = randomImg;
        this.$forceUpdate();
      },

      deleteImage(current) {
        this.$store.dispatch('deleteFile', current);
        this.user.avatar={};
        this.profile.avatar={};
        this.saveUserData();
      },

      removeSelectedChip(target, item) {
        target.splice(target.indexOf(item), 1)
      },

      goto(refName) {
        let el = document.getElementById(refName);
        el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      },

      getJob(jobId) {
        // if(user.colleague.jobIds === -1) return [{ job: user.title ? user.title : '', industry: '' }]
        let jobObject = this.$helpers.findKey(this.jobs, 'jobId', jobId, 'object');
        // return `${this.$helpers.capitalize(jobObject.industry)}: ${jobObject.job}`
        return jobObject;
      },

      calcSalary(industry=false) {
        let salary = 0;
        let job = this.$helpers.findKey(this.jobs, 'jobId', this.calcBaseJobId, 'object');
        // console.log(job);
        industry = industry ? industry : job.industry;
        // console.log(industry);
        if(job.length === 0) return;  // no job was chosen yet

        if(industry === 'film') {
          if(!this.profile.colleague.ssfv.rate) return 0;
          let salaryRange = job.salary[this.profile.colleague.ssfv.rate];
          salary = salaryRange[this.profile.colleague.ssfv.level-1]
          // salary = salary ? salary : 0;
          if(!salary && this.profile.colleague.ssfv.level > 0) {
            // this.$toasted.global.info({msg:"For this combination of job & experience, SSFV does not provide a salary"});
            this.salaryError = 'For this combination of job & experience, SSFV does not provide a salary';
            this.profile.colleague.salary='0.00';
          } else {
            this.salaryError = '';
            this.$toasted.clear();
          }
        } else {
          if(!this.profile.colleague.theater.phase) return 0;
          salary = job.salary[this.profile.colleague.theater.phase][0];  // rehersal/conceptual
        }
        if(salary) this.profile.colleague.salary = salary.toFixed(2);
      },

      async deleteAccount() {
        // Overwrite existing user file - cannot remove file, because that will trigger logout
        //   & no authority to remove user. Vice versa also!
        await db.collection("users").doc(auth.currentUser.uid).set({
          'deletedUser': true,
          'editedOn': new Date()
        }).then(() => {
          auth.currentUser.delete().then(() => {
            this.$store.commit('setUserProfile', {})
            this.$router.push("/");
            this.$toasted.global.info({msg:"Sad to see you go, but thanks for the ride!"});
          }).catch(function(error) {
            this.$toasted.global.error({msg:error.message});
            throw error;
          });
        }).catch(error => {
          this.$toasted.global.error({msg:error.message});
          throw error;
        });
      }
    }
  }
</script>

<style scoped>
  .halo {
    position: absolute;
    pointer-events: none;
    border-top: solid .08em white;
    border-right: solid .35em white;
    border-bottom: solid .08em white;
    border-left: solid .35em white;
    height: 1em;
    width: 4em;
    border-radius:50%;
    /* z-index: 1; */
    box-shadow: 0 0 2em white, 0 0 .75em khaki, 0 0 .35em #f8a100, inset 0 0 .65em #f8a100;
  }
</style>