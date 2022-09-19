<template>
  <div class="mx-auto my-4 mt-12 pa-8 pt-4">
    <div class="pb-16 mb-16" v-if="user.role === 'admin'">
      <!-- BACKUP -->
      <div class="pb-4">
      <!-- MAKE BACKUP -->
        <div style="line-height:1em" class="mt-4 mb-2 primary--text text-h4">Backups</div>
        <v-btn @click="triggerBackups()" :loading="backupInProgress" class="my-2">
          <v-icon color="primary" class="mr-2">mdi-database-plus</v-icon>
          Make backups <span v-if="$vuetify.breakpoint.mdAndUp">&nbsp;&nbsp;of users, persons & resources</span>
        </v-btn>
        <!-- READ BACKUPS -->
        <ol class="px-0 py-2" v-if="backups && backups['date'] && backups['date'].length">
          <li style="list-style:none;" v-for="(backup, x) in backups.date.slice().reverse()" :key="x">
            <span class="grey--text">{{x+1}}.</span>
            <!-- UNIX to date with format... -->
            {{ $moment(backup).format("dddd, DD. MM. YYYY - HH:mm:ss") }}
            <span class="grey--text">{{x === 0 ? `(${$helpers.timeRelativeToNow($moment(backup))})` : ''}}</span>
            <span class="grey--text">{{x === backups['date'].length-1 && x != 0 ? '(oldest)' : ''}}</span>
            <v-btn icon small class="ml-2" :color="reloadBackupConfirmation === backup ? 'red' : 'grey'" @click="reloadBackupConfirmation === backup ? reloadBackupConfirmation = -1 :reloadBackupConfirmation = backup">
              <!-- <v-icon small>mdi-database-outline</v-icon> -->
              <v-icon>mdi-database-clock</v-icon>
            </v-btn>
            <div class="primary--text pb-4 pl-4" v-if="reloadBackupConfirmation === backup">
              <p class="mb-2">
                Really sure to delete current data & reload this backup?
              </p>
              <v-btn color="red"  class="mr-2 mb-2" small @click="reloadBackup(backup.trim(), 'resources')">
                <v-icon class="mr-2">mdi-hammer-wrench</v-icon> Reload resources
              </v-btn>
              <v-btn color="white" disabled class="mr-2 mb-2 black--text" small @click="reloadBackup(backup.trim(), 'persons')">
                <v-icon class="mr-2">mdi-account-group</v-icon> Reload persons
              </v-btn>
              <v-btn color="primary"  class="mr-2 mb-2" small @click="reloadBackup(backup.trim(), 'users')">
                <v-icon class="mr-2">mdi-account-cowboy-hat</v-icon> Reload users
              </v-btn>
            </div>
          </li>
        </ol>
        <div v-else class="pa-1 my-2 red">No backups yet.</div>
      </div>

      <v-divider class="mb-4"></v-divider>

      <!-- USERS -->
      <div style="line-height:1em" class="mt-6 primary--text text-h4">Users ({{users.length}})</div>
      <div class="pa-0 py-2">
        <div
          v-for="(singleUser, i) in users"
          class="my-2 py-2 px-4"
          style="relative"
          :key="i"
          :class="i % 2 == 0 ? 'grey darken-4' : ''"
        >
          <div class="" style="overflow:hidden; vertical-align: top; width:20%; display:inline-block">
            <span class="text-h6 primary--text">
            {{singleUser.name}}
            </span>
            <br>
            <a :href="`mailto:${singleUser.email}`">{{singleUser.email}}</a>
              <v-icon
                small
                class="ml-2"
                :title="singleUser.emailVerified ? 'Email verified' : 'Email not verified'"
                :class="singleUser.emailVerified ? 'green--text' : 'red--text'">
                {{singleUser.emailVerified  ? 'mdi-check-circle' : 'mdi-close-circle'}}
              </v-icon>
            <br>
            <v-btn dense small class="mt-2 mb-2 red" :disabled="singleUser.id === user.uid" v-if="singleUser.kicked" @click="updateUserField('kicked', singleUser.id, false)">unkick me</v-btn>
            <v-btn dense small class="mt-2 mb-2" :disabled="singleUser.id === user.uid" v-else @click="updateUserField('kicked', singleUser.id, true)">kick me</v-btn>
            <br>
          </div>
          <div class="grey--text" style="width:80%; display:inline-block">
            Role: <span class="pointer" @click="setRoleForUser(singleUser.role === 'user' ? 'admin' :'user', singleUser.uid)" 
            :title="singleUser.role === 'user' ? 'Upgrade to admin' :'Downgrade to user'" style="disaplay:inline-block">
              {{singleUser.role}}
              <v-icon small v-if="singleUser.role === 'user'">mdi-account-arrow-up</v-icon>
              <v-icon small v-else>mdi-account-arrow-down</v-icon>
            </span><br>
            Profession: {{singleUser.title}}<br>
            Contribution: {{singleUser.contribution}}<br>
            ID: <pre class="grey--text" style="display:inline">{{$vuetify.breakpoint.smAndDown ? $helpers.truncate(singleUser.uid, 15) : singleUser.uid}}</pre>
            <Copy :data="singleUser.uid" dataName="user ID"></Copy><br>
            Created on: {{singleUser.createdOn ? $helpers.fbTimeToString(singleUser.createdOn, "DD.MM.YY - HH:mm") : '---' }},
            last login: {{singleUser.lastLogin ? $helpers.fbTimeToString(singleUser.lastLogin, "DD.MM.YY - HH:mm") : '---' }}<br>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from '../firebase'
import Copy from '@/components/Copy'

  export default {
    name: 'Test',
    props: {
      user: Object,
    },
    components: {
      Copy
    },

    data () {
      return {
        success: false,
        somethingWrong: false,
        loading: false,
        backupInProgress: false,
        users: [],
        backups: [],
        reloadBackupConfirmation: -1,
      }
    },

    created() {
      if(this.user.role === 'admin') {
        // Get dates of backups
        db.collection("backups")
        .doc("backuplist")
        .onSnapshot(doc => {
            //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            let data = doc.data();
            //console.log("Data: ", data);
            // this.about = {"me": data.me, "email": data.email};
            this.backups = data
        });
        db.collection('users')
        .orderBy('createdOn', 'desc')
        //.where('user_id', '==', firebaseUser.uid)
        .onSnapshot(querySnapshot => {
          let newData = [];
          querySnapshot.forEach(doc => {
            let f = doc.data();
            f.id = doc.id;
            newData.push(f);
          });
          this.users = newData;
        });
      }
    },

    methods: {
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

      async triggerBackups() {
        let date = new Date();
        let fbTimestamps = [];
        if(this.backups && this.backups.date && this.backups.date.length) {
          fbTimestamps = [...this.backups.date, date.toISOString()];
        } else {
          fbTimestamps = [date.toISOString()];
        }
        // FIXME: overwrites always all timestamps.. but yeah
        await this.$store.dispatch('updateField', {'collection':'backups', 'document':'backuplist','field':'date', 'data': fbTimestamps});

        //this.makeBackup('texts', date);  // test
        this.backupInProgress = true;
        await this.makeBackup('users', date.toISOString());
        await this.makeBackup('persons', date.toISOString());
        await this.makeBackup('resources', date.toISOString());
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
          console.log(`try to delete old collection if '${collection}'`);
          const documents = await db.collection(collection).get();
          /* TODO DOES NOT WAIT ON DELETION !!! */
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

          /* TODO DOES NOT WAIT ON DELETION !!! */
          
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
