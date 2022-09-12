<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero fill-width fill-height"></div>

    <!-- <div class="d-flex ma-0 red  fill-height fill-width">
      <v-img
        cover
        class="fill-height fill-width"
        src="../assets/home.jpg"
      ></v-img>
    </div> -->
    
    
    <!-- <v-img
  cover
  class="fill-height fill-width"
  src="../assets/home.jpg"
></v-img> -->
    <!-- <h1>This is the home page.</h1>

    <h1>This is data from the firestore:</h1>
    <v-chip
      v-for="(people, i) in persons"
      class="yellow mr-2"
      :key="i">
      <i class="mr-3 green--text">person {{i+1}}: </i> {{people.name}}, {{people.firstname}}
    </v-chip>
    <br><br>
    About me: {{about.me}}<br>
    emailaddress: {{about.email}}<br>
    <br><br>

    <h1>Some random helper functions</h1>

    {{$helpers.truncate("This truncates texts, a very long text which gets truncated after 40 characters in the middle", 40)}}
    <br>
    {{$helpers.ellipsis("This truncates texts at the end if it is longer than 40 char and so on", 40)}}
    <br>
    Display date:
    {{ new Date() | moment("dddd, MMMM D YYYY") }}
    <br>
    Humanize: 
    {{ [-3, 'minutes'] | duration('humanize', true) }}
    <br>
    {{ new Date() | moment("calendar") }}

    <br><br><br><br>
    <h1>Some random actions</h1>

    <v-btn type="submit" color="success" @click="$toasted.global.success({msg:'Success! Is for everyone.'});">Trigger success alert</v-btn>
    <v-btn type="submit" color="info" @click="$toasted.global.info({msg:'Info: Okay thing happend.'});">Trigger info alert</v-btn>
    <v-btn type="submit" color="error" @click="$toasted.global.error({msg:'Error:Not Authorized to Access'});">Trigger error alert</v-btn>
    <v-btn type="submit" to="/?error=ThisIsAUriWarning" color="warning" >Trigger alert vie route change</v-btn>

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    -->
  </div>
</template>

<script>
// import { db } from '../firebase'

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      firstname: null,
      lastname: null,
      emailaddress: null,
      phonenumber: null,
      persons: [],
      about: {},
    }
  },

  /* firebase: {
    persons: db.collection('persons'),
  }, */

  created() {
    // get all documents from live collection
    /* db.collection('persons')
      //.where('user_id', '==', firebaseUser.uid)
      .onSnapshot(querySnapshot => {
        let newData = [];
        querySnapshot.forEach(doc => {
          let f = doc.data();
          f.id = doc.id;
          newData.push(f);
        });
        this.persons = newData;
      });

    // get one specific live document and some of its contents
    db.collection("texts")
    .doc("about")
    .onSnapshot(doc => {
        //var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        let data = doc.data();
        //console.log("Data: ", data);
        // this.about = {"me": data.me, "email": data.email};
        this.about = data;
    }); */
  },
  methods: {
  },
}
</script>

<style scoped>
  .hero {
    background: url('../assets/home.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 100vh;
    position: fixed;
    left:0;
    top:0;
    z-index: 0;
  }
</style>