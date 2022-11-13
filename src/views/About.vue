<template>
  <div class="ma-0 fill-width fill-height">
    <div class="hero fill-width fill-height greyscale" v-if="$vuetify.breakpoint.mdAndUp"></div>

    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : $vuetify.breakpoint.mdAndUp ? 'mx-auto my-4 mt-12 pa-8' : 'mx-auto my-4 mt-0 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 666 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center" style="word-break: initial;">This is for the art departments needs</v-card-title>

      <v-card-text class="white--text italics text-center">
        Don't know where to get hayballs, a spider web spray, an astronaut suit?
        <br>
        In need of someone who makes authentic medieval axes for a living?
      </v-card-text>

      <v-card-actions class="pl-0">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-heart</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-hammer-wrench</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-format-paint</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-sofa-single</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-truck-cargo-container</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-desktop-classic</v-icon>
        <v-spacer></v-spacer>
        <v-icon small color="pink">mdi-head-flash</v-icon>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-card-actions>

      <v-card-text class="white--text">
        <p>This is a tool for the lovely people who work in the art department of switzerland.</p>
        <p><span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span> is a searchable collection of links of connections, materials, services and problem solvers; done by you for us all.</p>
        <p>
          Filmmaking and theater work is fast and needs answers equally fast.
          There is no point in holding back with your own curated list of interesting places with interesting stuff to get.
          We're in this together, and its scientifically proven to be more fun if we work together<sup class="grey--text">[citation needed]</sup>.
        </p>
        <!-- <p>This is not a community thing, point is to just have a list of stuff and where to get it in time.</p> -->
        <p v-if="!auth">
          Create <router-link to="/signup">an always free account</router-link> to contribute, or feel free to just leech around.
          Login <router-link to="/login">here</router-link> if you're already a user.
        </p>
        
        <v-card-title class="justify-center mt-16">FAQ</v-card-title>

        <v-row justify="center" class="mb-4">
          <v-expansion-panels accordion v-model="faqIndex">
            <v-expansion-panel
              v-for="(faq,i) in faqs"
              :key="i"
            >
              <v-expansion-panel-header style="min-height:initial;" :class="faqIndex === i ? 'pink darken-4':'grey darken-3'" >{{faq.question}}</v-expansion-panel-header>
              <v-expansion-panel-content class="grey darken-4">
                <p class="pt-4" v-html="faq.answer"></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>

        <v-card-title class="justify-center mt-16">Whodunit?</v-card-title>

        <v-card-title v-if="$vuetify.breakpoint.smAndDown" two-line class="justify-center">
          <v-list-item-avatar color="grey darken-3" size="250">
            <v-img
              alt=""
              :src="require('@/assets/portrait.jpg')"
            ></v-img>
          </v-list-item-avatar>
        </v-card-title>

        <v-list three-line class="pa-0" color="transparent">
          <v-list-item class="pa-0">
            <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp" style="display: block" color="grey darken-3" size="125">
            <v-img
              alt=""
              :src="require('@/assets/portrait.jpg')"
            ></v-img>
          </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Fabian Lüscher</v-list-item-title>
              <v-list-item-subtitle class="grey--text">Prop maker & professional nerd</v-list-item-subtitle>
              <v-list-item-subtitle class="grey--text mb-4">
                <a href="https://fluescher.ch" class="no-underline" target="_blank">fluescher.ch</a> /
                <a href="https://www.ssfv.ch/de/crew/crew-suche/fabian-luescher-1770" class="no-underline" target="_blank">ssfv.ch</a> /
                <a href="https://www.imdb.com/name/nm5535144" class="no-underline" target="_blank">imdb.com</a>
              </v-list-item-subtitle>
              <v-card-text class="ma-0 pa-0">
                <p>
                  Thank you <a href="https://www.isabellesimmen.com/" class="no-underline" target="_blank">Isabelle Simmen</a>
                  for testing, feedback and enthusiasm;
                  and szeno chat for the community.
                </p>
              </v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text class="pa-0 mb-16">
          <p>
            Get in contact if you have questions or want to improve this:
            <br>
            <a href="tel:0787424834" title="call" class="mr-2 no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}">
              <v-icon color="primary">mdi-phone</v-icon>
            </a>
            <a href="mailto:info@fluescher.ch" title="write email" class="mr-2 no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}">
              <v-icon color="primary">mdi-email</v-icon>
            </a>
            <a href="https://github.com/falue/szenodb" title="github repo" target="_blank" class="mr-2 no-underline" :class="{'bigMobileButton' : $vuetify.breakpoint.smAndDown}">
              <v-icon color="primary">mdi-github</v-icon>
            </a>
          </p>
          <br v-if="$vuetify.breakpoint.smAndDown">
          <p>
            If you think it's valuable what I do here, buy me a coffee:
          </p>
          <v-btn @click="popUpTwint = !popUpTwint" large color="black" class="mr-2">
            <img style="height:2em" :src="require('@/assets/twintLogo.svg')">
          </v-btn>
          <a href="https://www.buymeacoffee.com/falue" target="_blank">
            <v-btn large color="black" class="pa-0">
              <img style="height:44px" src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" title="Buy Me A Coffee (Credit card)">
            </v-btn>
          </a>
        </v-card-text>

        <v-card-text class="text-center mt-16">
          This project is open-source under <a href="https://github.com/falue/szenodb/blob/main/COPYING" target="_blank">GNU GPLv3</a>.
          <br>
          <router-link to="/privacy">Privacy agreement</router-link>
          &middot;
          <router-link to="/terms">Terms & conditions</router-link>
          &middot;
          <a href="https://github.com/falue/szenodb/blob/main/COPYING" target="_blank">GNU GPLv3</a>
        </v-card-text>
      </v-card-text>
    </v-card>

    <!-- TWINT QR CODE -->
    <v-dialog
      v-model="popUpTwint"
      width="300"
      :light="$vuetify.breakpoint.smAndUp"
    >
    <v-card :ripple="false" :class="$vuetify.breakpoint.smAndUp ? 'white' : ''" @click="$vuetify.breakpoint.mdAndUp ? popUpTwint = false : null">
        <v-card-text class="ma-0 pa-4" v-if="$vuetify.breakpoint.smAndUp">
          <v-card-title class="pa-0 justify-center">Scan with TWINT app</v-card-title>
          <img style="width:100%" :src="require('@/assets/twint.svg')">
        </v-card-text>
      <v-card-text class="ma-0 pa-4" v-if="$vuetify.breakpoint.smAndDown">
        <v-card-title class="pa-0 mb-6 justify-center">Copy to TWINT app</v-card-title>
        Fabian Lüscher
        <Copy data="Fabian Lüscher" dataName="TWINT Name" :opacity="1"></Copy>
        <br>
        078 742 48 34
        <Copy data="0787424834" dataName="TWINT number" :opacity="1"></Copy>
        <br>
        <v-card-subtitle v-if="$vuetify.breakpoint.xs" class="pa-0 mt-6 grey--text">
          (QR Code when visiting with bigger screen)
        </v-card-subtitle>
        
      </v-card-text>
    </v-card>
    </v-dialog>


  </div>
</template>

<script>
import Copy from '@/components/Copy'
  export default {
    name: 'About',
    props: {
      auth: Boolean,
      user: Object,
    },
    components: {
      Copy
    },
    
    data () {
      return {
        popUpTwint: false,
        faqIndex: 0,
        faqs: [
          {
            'question': 'How are these resources curated?',
            'answer': `This list is created & curated by you, the users.
                      </p><p>
                      It is not meant to be a fixed, always correct and up-to-date list. It changes.
                      Double check.
                      </p><p>
                      Its a starting point for your own research.`
          },
          {
            'question': 'What types of resources should be here?',
            'answer': `Every company you've researched that delivers good stuff on time;
                      specialists for all kind of curiosities or skillsets that are hard to find;
                      or someone with a collection of things to rent or buy should be here.
                      </p><p>
                      That said, I'd like to keep this community driven, so if you think this should be different,
                      <a href="mailto:info@fluescher.ch">get in touch</a>.
                      </p><p>
                      This is not a material exchange. At least not yet.
                      </p><p>
                      For now, <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
                      is not meant for short-term one-off exchanges of goods
                      (it CAN be though, <a href="https://github.com/falue/szenodb" target="_blank">if you're willing
                      to help</a>).
                      </p><p>Have an old carpet from a project?
                      Maybe post it in our chat,
                      <a href="https://tutti.ch" target="_blank">tutti</a>,
                      or <a href="https://ricardo.ch" target="_blank">ricardo</a>.
                      Have a warehouse full of stuff that fills & empties all the time? Yes please.`
          },
          {
            'question': "What's new? Latest changes?",
            'answer': `See all the <a href="#/updates">updates & issues here</a>, big and small.`
          },
          {
            'question': 'I found incorrect data. What to do?',
            'answer': `If information is outdated here - update the resource, for the others to know!
                      </p><p>
                      You can delete the resource entirely, but sometimes its useful to mark it as
                      "unreliable" and leave a comment why that is. Is the company defunct? Hostile?
                      Owned by murderers?
                      </p><p>
                      No need for others to find out for themselves if you know it already.`
          },
          {
            'question': 'Is functionality X possible?',
            'answer': `Yes. No. Depends. Checkout
                      <a href="https://github.com/falue/szenodb/milestone/2" target="_blank">all the ideas out here</a>.
                      The time I need (or you need!) for new features can vary massively, and perhaps not in the ways you imagine.`
          },
          {
            'question': 'What external services do you use for this?',
            'answer': `
                      Frontend by <a href="https://vuejs.org" target="_blank">Vue.js</a> with <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a></p><p>
                      Backend & Authentication by <a href="https://firebase.google.com/" target="_blank">Google Firebase & Firestore</a></p><p>
                      Dynamic image storage by <a href="https://firebase.google.com/products/storage" target="_blank">Google Firebase Storage</a></p><p>
                      Hosting by <a href="https://metanet.ch" target="_blank">metanet.ch</a></p><p>
                      Dynamic translations by <a href="https://deepl.com" target="_blank">Deepl.com</a></p><p>
                      Random default user image API by <a href="https://avatars.dicebear.com" target="_blank">dicebear.com</a></p><p>
                      No tracking/analytics tools are being used.
                      `
          },
          {
            'question': 'I have problems!',
            'answer': `Not really a question, but good grief! I hope you're all right.
                      </p><p>
                      Drop me a <a href="mailto:info@fluescher.ch">message</a> with all the details you can imagine,
                      or even better, join github and
                      <a href="https://github.com/falue/szenodb/issues/new" target="_blank">create an issue</a>!
                      Sometimes I can solve things fast. Sometimes not, but I will try hard.`
          },
        ],
        classes: [
          'indigo--text italics',
          'warning--text',
          'pink--text darken-2',
          'red--text lighten-1',
          'deep-purple--text accent-4',
          'pink--text darken-2',
        ],
      }
    },
  }
</script>

<style scoped>
  .hero {
    background: url('../assets/bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 100vh;
    position: fixed;
    left:0;
    top:0;
    opacity: .25;
    filter: saturate(0);
  }
</style>