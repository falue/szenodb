<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero black fill-width fill-height" @click="getPseudoRandomImg()">
      <v-img ref="hero" :src="randomImg.src" class="fill-height no-click"/>
      <div class="caption absolute text-center bottom fill-width text-shadow--black" :class="$vuetify.breakpoint.smAndDown ? 'mb-16 pb-4' : 'mb-14'">
        <span class="op-75">{{randomImg.imageName}} by</span>
        <a :href="randomImg.links[0].url" target="_blank" class="no-underline externalLink ml-1">
          <span class="white--text">{{randomImg.author}}</span>
        </a>
        <br>
        <a v-for="(link, i) in JSON.parse(JSON.stringify(randomImg.links)).slice(1)" :key="'link-'+i" :href="link.url" target="_blank" class="no-underline externalLink">
          {{link.name}}
          <span v-if="i+1 < randomImg.links.length-1" class="white--text mx-1">&middot;</span>
        </a>
      </div>
    </div>

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
  name: 'HomeView',
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
      imageIndex: 0,
      randomImg: {},
      randomImgs: [
        {src: require('@/assets/bg-1.jpg'), author: 'Anton Hangschlitt', imageName: '"Cloudy" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-2.jpg'), author: 'Anton Hangschlitt', imageName: '"Congress" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-3.jpg'), author: 'Anton Hangschlitt', imageName: '"Dinner" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-4.jpg'), author: 'Anton Hangschlitt', imageName: '"Ernst Reuter Platz" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-5.jpg'), author: 'Anton Hangschlitt', imageName: '"Hideaway" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-6.jpg'), author: 'Anton Hangschlitt', imageName: '"Knife blocks" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-7.jpg'), author: 'Anton Hangschlitt', imageName: '"Pannenhuis" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
        {src: require('@/assets/bg-8.jpg'), author: 'Anton Hangschlitt', imageName: '"Three last" ©', links: [{name: 'website', url: 'https://www.instagram.com/hangschlitt'}]},
      ]
    }
  },

  /* firebase: {
    persons: db.collection('persons'),
  }, */

  created() {
    this.getPseudoRandomImg(true);
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
    // swap backgrounds
    async getPseudoRandomImg(hourly) {
      if(hourly) {
        let currentHour = new Date().getHours();
        currentHour /= 3;
        this.imageIndex = Math.floor(currentHour) % this.randomImgs.length;
        this.randomImg = this.randomImgs[this.imageIndex];
      } else {
        let newRandom = this.$helpers.randomBetween(0, this.randomImgs.length-1);
        // do not display same as before
        if(this.imageIndex != newRandom) {
          this.$refs["hero"].$el.classList.add('fadeOutFast');
          await this.$helpers.sleep(250);
          this.imageIndex = newRandom
          this.randomImg = this.randomImgs[this.imageIndex];
          this.$refs["hero"].$el.classList.remove('fadeOutFast');
          this.$refs["hero"].$el.classList.add('fadeInFast');
          await this.$helpers.sleep(250);
          this.$refs["hero"].$el.classList.remove('fadeInFast');
        } else {
          this.getPseudoRandomImg();
        }
      }
    }
  },
}
</script>

<style scoped>
  .hero {
    /* background: url('../assets/bg.jpg'); */
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