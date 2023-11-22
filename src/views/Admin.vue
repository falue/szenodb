<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : $vuetify.breakpoint.mdAndUp ? 'mx-auto my-4 mt-12 pa-8' : 'mx-auto my-4 mt-0 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 888 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >
      <div class="pb-16 mb-16" v-if="user.role === 'admin'">
        <!-- USERS -->
        <v-card-title class="justify-center">Users</v-card-title>

        {{users.length}} users in total, combined effort: <span class="orange--text">{{totalContribution >= 0 ? totalContribution.toLocaleString() : '--'}}</span> contribution points
        <br>
        <small class="grey--text">
          Sort / filter by
          <label class="mx-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('createdOn', 'desc')" checked> Created</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('contribution','desc')"> Contribution</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('public', 'desc')"> Public</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('name','asc')"> Name</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('email','asc')"> Email</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('role','asc')"> Role</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('lastLogin','desc')"> Last login</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('kicked','desc')"> Kicked</label>
          <label class="mr-3 nobr pointer"><input type="radio" class="text--vert-middle invert" name="sortby" @change="getUsers('deletedUser', 'desc')"> Deleted</label>
        </small>

        <div class="pt-4 text-right">
          <v-btn small dense color="primary" class="my-2" :href="`mailto:info@fluescher.ch?bcc=${users.map(x => {if(x.news || x.news === undefined) {return `${x.name}<${x.email}>`}}).filter(x => x).join(',%20')}`">Write email to every willing user</v-btn>
        </div>
        <div class="pa-0 pb-4" style="max-height:1000px; overflow-y:auto;">
          <div
            v-for="(singleUser, i) in users"
            class="my-2 pl-2 py-2 relative rounded"
            :key="i"
            :class="i % 2 == 0 ? 'grey darken-4' : ''"
          >
            <v-btn dense small class="ma-2 red right top absolute" :disabled="singleUser.id === user.uid" v-if="singleUser.kicked" @click="updateUserField('kicked', singleUser.id, false)">unkick me</v-btn>
            <v-btn dense small class="ma-2 right top absolute" :disabled="singleUser.id === user.uid" v-else-if="singleUser.kicked === false" @click="updateUserField('kicked', singleUser.id, true)">kick me</v-btn>
            
            <v-btn dense small class="ma-2 hover right top absolute" :class="singleUser.deletedUser ? '' : 'mt-10'" :disabled="singleUser.id === user.uid" v-if="userConfirmDelete !== singleUser.id" @click="userConfirmDelete = singleUser.id">delete {{$helpers.getFirstName(singleUser.name, "this")}}'s account</v-btn>
            <v-btn dense small class="ma-2 right top absolute error--fade" :class="singleUser.deletedUser ? '' : 'mt-10'" v-else @click="userDelete(singleUser.id)">yes delete me please dear god</v-btn>
            
            <div v-if="singleUser.deletedUser" class="">
              Self deleted user <b class="orange--text">#{{i+1}}</b>
              &middot;
              <div class="inline mr-2">
                <pre class="grey--text inline">{{singleUser.id}}</pre>
                <Copy :data="singleUser.id" opacity=".75" dataName="user ID"></Copy>
              </div>
              &middot;
              <small>
                Edited on:
                {{$helpers.fbTimeToString(singleUser.editedOn, "DD.MM.YY - HH:mm") }}
              </small>
            </div>
            <div v-else class="pr-2 maxWidth" :style="$vuetify.breakpoint.mdAndUp ? 'width:25%;' : 'width:100%;'" style="overflow:hidden; vertical-align: top; display:inline-block;">
              
            <div class="text-h6 overflowHidden ellipsis">
              <v-avatar color="grey" class="inlineBlock">
                <v-img
                  v-if="singleUser.avatar.url"
                  :src="singleUser.avatar.url"
                ></v-img>
                <v-img
                  v-else
                  :src="`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${singleUser.avatar && singleUser.avatar.random ? singleUser.avatar.random : $helpers.md5(singleUser.uid)}.svg`"
                ></v-img>
                <!-- <span v-else class="text-h5 uppercase">{{singleUser.name[0]}}</span> -->
              </v-avatar>
              <span :title="'User: '+singleUser.name" class="pl-2">{{singleUser.name}}</span>
            </div>
              
            </div>
            <div v-if="!singleUser.deletedUser" class="grey--text" :style="$vuetify.breakpoint.mdAndUp ? 'width:75%;' : 'width:100%;'" style="display:inline-block">
              <a :href="`mailto:${singleUser.email}`"
                class="no-underline"
                :title="singleUser.emailVerified ? `Email ${singleUser.email} verified` : `Email ${singleUser.email} not verified`"
              >
                <v-icon
                  small
                  class="mr-1"
                  :class="singleUser.emailVerified ? 'green--text' : 'red--text'">
                  {{singleUser.emailVerified  ? 'mdi-check-circle' : 'mdi-close-circle'}}
                </v-icon>
                {{singleUser.email}}
              </a>
              <br>
              Role:
              <b class="pointer inline"
                :class="singleUser.role === 'user' ? 'orange--text' : 'pink--text'"
                @click="setRoleForUser(singleUser.role === 'user' ? 'admin' :'user', singleUser.uid)" 
                :title="singleUser.role === 'user' ? 'Upgrade to admin' : 'Downgrade to user'"
              >
                {{singleUser.role}}
                <v-icon small v-if="singleUser.role === 'user'">mdi-account-arrow-up</v-icon>
                <v-icon small v-else>mdi-account-arrow-down</v-icon>
              </b>
              &middot;
              contribution: <b class="orange--text">{{singleUser.contribution}}</b>
              &middot;
              Newsletter:
              <v-icon small
                :color="singleUser.news === false ? 'error' : singleUser.news === true ? 'green' : 'grey'"
                :title="singleUser.news === false ? 'Opt-out' : singleUser.news === true ? 'Opt-in' : 'Has not yet decided'"
              >
                mdi-{{singleUser.news === false ? 'email-off' : 'email-check'}}
              </v-icon><br>
              ID: <pre class="grey--text inline">{{$vuetify.breakpoint.xs ? $helpers.truncate(singleUser.uid, 22, '…') : singleUser.uid}}</pre>
              <Copy :data="singleUser.uid" opacity=".75" dataName="user ID"></Copy>
              <a
                target="_blank"
                class="no-underline"
                :title="`Open Firebase document of ${singleUser.name}`"
                :href="`https://console.firebase.google.com/project/szenodb/firestore/data/~2Fusers~2F${singleUser.uid}`"
              >
                <v-icon small class="orange--text ml-2">mdi-firebase</v-icon>
              </a>
              <br>
              <small>
                Created on: {{singleUser.createdOn ? $helpers.fbTimeToString(singleUser.createdOn, "DD.MM.YY - HH:mm") : '---' }}
                &middot;
                last login: {{singleUser.lastLogin ? $helpers.fbTimeToString(singleUser.lastLogin, "DD.MM.YY - HH:mm") : '---' }}<br>
              </small>
            </div>
          </div>
        </div>
        <div v-if="!users.length">
          No users to show.
        </div>
        
        <hr class="mb-3 mt-16" style="border:none; border-top: solid 1px rgba(255,125,0,.25);">

        <v-card-title class="text-h3 justify-center italics error--text">DANGER ZONE!</v-card-title>

        <div class="pb-4">
          <!-- MAKE BACKUP -->
          <v-card-title class="justify-center">Backups</v-card-title>
          <v-card-title class="justify-center">
            <v-btn @click="setBackupName = !setBackupName" :loading="backupInProgress" class="green my-2">
              <v-icon color="white" class="mr-2">mdi-database-plus</v-icon>
              Make backups <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-1">of users & resources</span>
            </v-btn>
            <v-text-field dense height="1em" hide-details style="width:220px;" v-if="setBackupName" filled class="input ml-2 inline-block" placeholder="Set backup Name" type="text" v-model="backupName"></v-text-field>
            <v-btn :disabled="!backupName.length" v-if="setBackupName" @click="triggerBackups(backupName), backupName = '', setBackupName = false" :loading="backupInProgress" class="ml-2 my-2 primary">
              GO
            </v-btn>
          </v-card-title>

          <!-- READ BACKUPS -->
          <ol class="px-0 py-2" v-if="backups && backups['backups'] && backups['backups'].length">
            <li style="list-style:none;" v-for="(backup, x) in backups['backups'].slice().reverse()" :key="x">
              <!-- {{backup}} -->
              <div class="inline-block ellipsis" :title="backup.name" :style="$vuetify.breakpoint.xs ? 'width:100%' : 'width:225px'">
                <span class="grey--text">{{x+1}}. </span>
                <span v-html="starify(backup.name)"></span>
              </div>

              <v-btn icon small class="mr-2 nudge-y--50" :color="reloadBackupConfirmation === backup.date ? 'red' : 'grey'" @click="reloadBackupConfirmation === backup.date ? reloadBackupConfirmation = -1 :reloadBackupConfirmation = backup.date">
                <!-- <v-icon small>mdi-database-outline</v-icon> -->
                <v-icon>mdi-database-clock</v-icon>
              </v-btn>

              <!-- UNIX to date with format... -->
              <div class="grey--text inline-block ellipsis" :class="$vuetify.breakpoint.xs ? 'pb-5' : ''">
                {{ $moment(backup.date).format("dddd, DD. MM. YYYY - HH:mm:ss") }}<!-- 
                -->{{x === 0 ? `, ${$helpers.timeRelativeToNow($moment(backup.date))}, newest` : ''}}<!-- 
                -->{{x === backups.backups.length-1 && x != 0 ? ', oldest' : ''}}
              </div>

              <div class="error white--text bolder darken-1 rounded mb-8 pa-2 text-center" v-if="reloadBackupConfirmation === backup.date">
                <p class="mb-2">
                  Really sure to delete current data & reload this backup?
                </p>
                <v-btn color="red" class="mr-2 mb-2" small @click="reloadBackup(backup.date.trim(), 'resources')">
                  <v-icon class="mr-2">mdi-hammer-wrench</v-icon> Reload resources
                </v-btn>
                <v-btn color="white" class="mr-2 mb-2 black--text" small @click="reloadBackup(backup.date.trim(), 'settings')">
                  <v-icon class="mr-2">mdi-wrench</v-icon> Reload settings
                </v-btn>
                <v-btn color="primary"  class="mr-2 mb-2" small @click="reloadBackup(backup.date.trim(), 'users')">
                  <v-icon class="mr-2">mdi-account-cowboy-hat</v-icon> Reload users
                </v-btn>
              </div>
            </li>
          </ol>
          <div v-else class="pa-1 my-2 red">No backups yet, or page hard reloaded.</div>
        </div>

        <!-- MAINTENANCE MODE -->
        <hr class="mb-3 mt-16" style="border:none; border-top: solid 1px rgba(255,255,255,.25);">
        <v-card-title class="justify-center">Maintenance</v-card-title>
        <v-card-title class="justify-center">
          <v-btn @click="setMaintenance(!settings.maintenance)" :color="settings.maintenance ? 'error--fade' : 'green'">
            {{ settings.maintenance ? 'Turn off Maintenance mode' : 'Turn on Maintenance mode'}}
          </v-btn>
        </v-card-title>

        <p v-if="settings.maintenance" class="my-2">
          Maintenance mode is on.
          <br>
          During maintenance mode (now!), no user is able to login or make changes. Except for you, admin.
        </p>
        <p v-else class="my-2">
          Maintenance mode is off.
          <br>
          During maintenance mode, no user is able to login or make changes. Except for you, admin.
        </p>

      </div>
    </v-card>
  </div>
</template>

<script>
import { db } from '../firebase'
import Copy from '@/components/Copy'

  export default {
    name: 'Admin',
    props: {
      user: Object,
      settings: Object,
    },
    components: {
      Copy
    },

    data () {
      return {
        success: false,
        somethingWrong: false,
        setBackupName: false,
        backupName: '',
        loading: false,
        backupInProgress: false,
        userConfirmDelete: '',
        users: [],
        backups: [],
        reloadBackupConfirmation: -1,
        unsubscribeBackups: [],
        unsubscribeUsers: []
      }
    },

    created() {
      if(this.user.role === 'admin') {
        // Get dates of backups
        this.unsubscribeBackups = db.collection("backups")
        .doc("backuplist")
        .onSnapshot(doc => {
            //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            let data = doc.data();
            //console.log("Data: ", data);
            // this.about = {"me": data.me, "email": data.email};
            this.backups = data
        });
        this.getUsers('createdOn', 'desc');
      }
    },

    computed: {
      totalContribution() {
        let localTotal = 0;
        this.users.forEach(function(element) {
            localTotal += element.contribution;
          });
        return localTotal;
      }
    },

    beforeDestroy() {
      if(typeof this.unsubscribeBackups === 'function') this.unsubscribeBackups();
      if(typeof this.unsubscribeUsers === 'function') this.unsubscribeUsers();
    },

    methods: {
      getUsers(orderBy, sort) {
        // Terminate earlier snapshots if existing
        if(typeof this.unsubscribeUsers === 'function') {
          this.unsubscribeUsers();
        }
        // Circumvent doubled identical "orderBy" createdOn
        let secondary = orderBy === 'createdOn' ? 'email' : 'createdOn';
        secondary = orderBy === 'deletedUser' ? 'editedOn' : secondary;
        let where = false;
        
        // Do not show other users with these fitlers:
        if(orderBy === 'public' || orderBy === 'kicked' || orderBy === 'deleted') {
          where = orderBy;
          orderBy = 'lastLogin';
        }

        this.unsubscribeUsers = db.collection('users')
        .orderBy(orderBy, sort)
        .orderBy(secondary, 'desc');

        if(where) {
          this.unsubscribeUsers = this.unsubscribeUsers.where(where, '==', true)
        }
        
        this.unsubscribeUsers = this.unsubscribeUsers.onSnapshot(querySnapshot => {
          let newData = [];
          querySnapshot.forEach(doc => {
            let f = doc.data();
            f.id = doc.id;
            if(orderBy === 'deletedUser' || !f.deletedUser) newData.push(f);
          });
          this.users = newData;
        });
      },

      setMaintenance(value) {
        this.$store.dispatch('updateField', {'collection': 'settings', 'document': 'settings', 'field': 'maintenance', 'data': value})
      },

      setRoleForUser(newRole, userId) {
        if(userId === this.user.uid) {
          this.$toasted.global.error({msg:'Cannot downgrade yourself, dummy ;)'});
          return
        }
        this.updateUserField('role', userId, newRole);
      },

      updateUserField(fieldName, userId, value) {
        console.log(userId);
        this.$store.dispatch('updateField', {'collection':'users', 'document':userId,'field':fieldName, 'data': value}).then(() => {
          if(fieldName) {
              this.$toasted.global.success({msg:"Updated user"});
          } else {
              this.$toasted.global.info({msg:"Updated user"});
          }
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
      },

      starify(backupName) {
        // Yes yes kindly fuck off ;)
        return backupName.replace(/\*/g, '<i class="v-icon notranslate mdi mdi-star theme--dark orange--text" style="font-size: 1em;"></i>');
      },

      async triggerBackups(backupName) {
        let currentDate = new Date().toISOString();
        let allBackups = [];
        if(this.backups.backups.length) {
          allBackups = [...this.backups.backups, {date: currentDate, name: backupName}];
        } else {
          allBackups = [{date: currentDate, name: backupName}];
        }
        await this.$store.dispatch('updateField', {'collection':'backups', 'document':'backuplist','field':'backups', 'data': allBackups});
       
        this.backupInProgress = true;
        // this.makeBackup('texts', currentDate);  // test
        await this.makeBackup('users', currentDate);
        await this.makeBackup('settings', currentDate);
        await this.makeBackup('resources', currentDate);
        this.backupInProgress = false;
      },

      async makeBackup(source, date) {
        console.log(`Start backup for '${source}' => 'backups/${date}'.`);
        this.$store.dispatch('copyCollection', {'source': source, 'target': `backups/${date}/${source}`}).then(() => {
          console.log(`Sucessful created backup for ${source}`);
          this.$toasted.global.success({msg:`Sucessful created backup for ${source}`});
          return;
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
      },

      async reloadBackup(filename, collection) {
        // delete current resources
        try {
          console.log(`Try to delete old collection if '${collection}'`);
          const documents = await db.collection(collection).get();
          documents.forEach(async (doc)=> {
            await db.collection(collection).doc(doc.id).delete().then(function() {
              return true
            }).catch(function(error) {
              throw error;
            });
          })

        } catch (error) {
          console.log(error);
          return;

        } finally {
        // copy old to new
        console.log("copy old to new"); 
        console.log(filename);
        await this.$store.dispatch('copyCollection', {'source': `backups/${filename}/${collection}`, 'target': collection}).then(() => {
          console.log(`Sucessful reloaded backup '${filename}' @ ${collection}`);
          this.$toasted.global.success({msg:`Sucessful reloaded backup ${filename} @ ${collection}`});
          return;
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
        this.reloadBackupConfirmation = -1;
        }
      },

      async userDelete(userId) {
        console.log(userId)
        this.userConfirmDelete = '';
        this.$helpers.copyClipBoard(userId, '..forwarding to firebase and User ID');
        await this.$helpers.sleep(1250);
        await db.collection('users').doc(userId).delete().then(function() {
          window.open('https://console.firebase.google.com/project/szenodb/authentication/users', '_blank');
        }).catch(function(error) {
          throw error;
        });

      },
    },
  }
</script>
