<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4 pt-0' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 888 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <!-- BACKUP -->
      <div class="pb-16 mb-16" v-if="user.role === 'admin'">
        <div class="pb-4">
          <!-- MAKE BACKUP -->
          <v-card-title class="justify-center">Backups</v-card-title>
          <v-btn @click="setBackupName = !setBackupName" :loading="backupInProgress" class="my-2">
            <v-icon color="primary" class="mr-2">mdi-database-plus</v-icon>
            Make backups <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-1">of users & resources</span>
          </v-btn>
          <v-text-field dense height="1em" hide-details style="width:220px;" v-if="setBackupName" filled class="input ml-2 inline-block" placeholder="Set backup Name" type="text" v-model="backupName"></v-text-field>
          <v-btn :disabled="!backupName.length" v-if="setBackupName" @click="triggerBackups(backupName), backupName = '', setBackupName = false" :loading="backupInProgress" class="ml-2 my-2 primary">
            GO
          </v-btn>

          <!-- READ BACKUPS -->
          <ol class="px-0 py-2" v-if="backups && backups['backups'] && backups['backups'].length">
            <li style="list-style:none;" v-for="(backup, x) in backups['backups'].slice().reverse()" :key="x">
              <!-- {{backup}} -->
              <span class="grey--text">{{x+1}}. </span>
              <span v-html="starify(backup.name)"></span>
              <!-- UNIX to date with format... -->
              <span class="grey--text">
                {{ $moment(backup.date).format("dddd, DD. MM. YYYY - HH:mm:ss") }}<!-- 
                -->{{x === 0 ? `, ${$helpers.timeRelativeToNow($moment(backup.date))}, newest` : ''}}<!-- 
                -->{{x === backups.backups.length-1 && x != 0 ? ', oldest' : ''}}
              </span>

              <v-btn icon small class="ml-2" :color="reloadBackupConfirmation === backup.date ? 'red' : 'grey'" @click="reloadBackupConfirmation === backup.date ? reloadBackupConfirmation = -1 :reloadBackupConfirmation = backup.date">
                <!-- <v-icon small>mdi-database-outline</v-icon> -->
                <v-icon>mdi-database-clock</v-icon>
              </v-btn>
              <div class="primary--text pb-4 pl-4" v-if="reloadBackupConfirmation === backup.date">
                <p class="mb-2">
                  Really sure to delete current data & reload this backup?
                </p>
                <v-btn color="red" class="mr-2 mb-2" small @click="reloadBackup(backup.date.trim(), 'resources')">
                  <v-icon class="mr-2">mdi-hammer-wrench</v-icon> Reload resources
                </v-btn>
                <v-btn color="white" disabled class="mr-2 mb-2 black--text" small @click="reloadBackup(backup.date.trim(), 'persons')">
                  <v-icon class="mr-2">mdi-account-group</v-icon> Reload persons
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

        <v-btn @click="setMaintenance(!settings.maintenance)" :color="settings.maintenance ? 'error--fade' : 'green'">
          {{ settings.maintenance ? 'Turn off Maintenance mode' : 'Turn on Maintenance mode'}}
        </v-btn>

        <!-- USERS -->
        <hr class="mb-3 mt-16" style="border:none; border-top: solid 1px rgba(255,255,255,.25);">
        <v-card-title class="justify-center">Users</v-card-title>

         {{users.length}} users in total, combined effort: {{totalContribution}} contribution points
        <div class="pa-0 py-2">
          <div
            v-for="(singleUser, i) in users"
            class="my-2 py-2 px-4 relative"
            :key="i"
            :class="i % 2 == 0 ? 'grey darken-4' : ''"
          >
            <div class="pr-2" :style="$vuetify.breakpoint.mdAndUp ? 'width:25%;' : 'width:100%;'" style="overflow:hidden; vertical-align: top; display:inline-block;">
              <span class="text-h6 primary--text">
              {{singleUser.name}}
              </span>
              <br>
              <v-icon
                small
                class="mr-1"
                :title="singleUser.emailVerified ? 'Email verified' : 'Email not verified'"
                :class="singleUser.emailVerified ? 'green--text' : 'red--text'">
                {{singleUser.emailVerified  ? 'mdi-check-circle' : 'mdi-close-circle'}}
              </v-icon>
              <a :href="`mailto:${singleUser.email}`">{{singleUser.email}}</a>
              <br>
              <v-btn dense small class="ma-2 red right top absolute" :disabled="singleUser.id === user.uid" v-if="singleUser.kicked" @click="updateUserField('kicked', singleUser.id, false)">unkick me</v-btn>
              <v-btn dense small class="ma-2 right top absolute" :disabled="singleUser.id === user.uid" v-else @click="updateUserField('kicked', singleUser.id, true)">kick me</v-btn>
              <br>
            </div>
            <div class="grey--text" :style="$vuetify.breakpoint.mdAndUp ? 'width:75%;' : 'width:100%;'" style="display:inline-block">
              Role: <b class="pointer" @click="setRoleForUser(singleUser.role === 'user' ? 'admin' :'user', singleUser.uid)" 
              :title="singleUser.role === 'user' ? 'Upgrade to admin' :'Downgrade to user'" style="disaplay:inline-block">
                {{singleUser.role}}
                <v-icon small v-if="singleUser.role === 'user'">mdi-account-arrow-up</v-icon>
                <v-icon small v-else>mdi-account-arrow-down</v-icon>
              </b>,
              contribution: {{singleUser.contribution}}<br>
              Profession: {{singleUser.title}}<br>
              ID: <pre class="grey--text" style="display:inline">{{$vuetify.breakpoint.xs ? $helpers.truncate(singleUser.uid, 22, '…') : singleUser.uid}}</pre>
              <Copy :data="singleUser.uid" dataName="user ID"></Copy><br>
              Created on: {{singleUser.createdOn ? $helpers.fbTimeToString(singleUser.createdOn, "DD.MM.YY - HH:mm") : '---' }},
              last login: {{singleUser.lastLogin ? $helpers.fbTimeToString(singleUser.lastLogin, "DD.MM.YY - HH:mm") : '---' }}<br>
            </div>
          </div>
        </div>
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
        this.unsubscribeUsers = db.collection('users')
        .orderBy('createdOn', 'desc')
        //.where('user_id', '==', firebaseUser.uid)
        .onSnapshot(querySnapshot => {
          let newData = [];
          querySnapshot.forEach(doc => {
            let f = doc.data();
            f.id = doc.id;
            if(!f.deletedUser) newData.push(f);
          });
          this.users = newData;
        });
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
        // await this.makeBackup('persons', currentDate);
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
    },
  }
</script>
